import cron from 'node-cron';
import { Op } from 'sequelize';
import models from '../models/index.js';
import { getActiveUsers, emitUserActivityUpdate, cleanupInactiveUsers } from '../socket.js';

const { Accounts } = models;

// Run every 2 minutes to check user activity status
cron.schedule('*/2 * * * *', async () => {
  try {
    const now = new Date();
    console.log('User Status Cron triggered at', now.toLocaleString());

    // Get active users from socket
    const activeUsers = getActiveUsers();
    const activeUserIds = new Set(activeUsers.map(user => user.userId));

    // Find users who were active in the last 5 minutes but are not in active users list
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    
    const recentlyActiveUsers = await Accounts.findAll({
      attributes: ['account_id', 'activeAt'],
      where: {
        activeAt: { [Op.gte]: fiveMinutesAgo },
        account_id: { [Op.notIn]: Array.from(activeUserIds) }
      }
    });

    console.log('Users to mark as offline:', recentlyActiveUsers.length);

    let offlineCount = 0;
    if (recentlyActiveUsers.length > 0) {
      for (const user of recentlyActiveUsers) {
        // Emit user activity update to mark as offline
        emitUserActivityUpdate(user.account_id, 'offline');
        offlineCount++;
      }
    }

    // Also check for users who haven't been active in the last 10 minutes
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    
    const inactiveUsers = await Accounts.findAll({
      attributes: ['account_id', 'activeAt'],
      where: {
        activeAt: { [Op.lt]: tenMinutesAgo },
        account_id: { [Op.notIn]: Array.from(activeUserIds) }
      }
    });

    console.log('Inactive users found:', inactiveUsers.length);

    // Emit offline status for inactive users
    for (const user of inactiveUsers) {
      emitUserActivityUpdate(user.account_id, 'offline');
    }

    console.log(
      `User Status Updater -> ${offlineCount} users marked as offline, ${inactiveUsers.length} inactive users processed.`
    );

  } catch (error) {
    console.error('User Status Updater Error:', error.message);
  }
});

// Run every 30 seconds to clean up old socket connections
cron.schedule('*/30 * * * * *', async () => {
  try {
    console.log('Running socket cleanup...');
    cleanupInactiveUsers();
  } catch (error) {
    console.error('Socket Cleanup Error:', error.message);
  }
});

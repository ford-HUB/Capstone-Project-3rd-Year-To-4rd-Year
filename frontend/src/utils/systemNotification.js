import toast from "react-hot-toast";

export const showNotification = (title, content) => {
    if(Notification.permission === 'granted') {
        new Notification(title, {
            body : content,
            icon: '👋'
        })
    }
}

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications.')
      return false;
    }
  
    if (Notification.permission === 'granted') {
      return true
    }
  
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
  
    return false;
  };
  
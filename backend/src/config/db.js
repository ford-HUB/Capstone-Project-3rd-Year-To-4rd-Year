import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let db;

if (process.env.DATABASE_URL) {
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allow Railway's self-signed SSL
      },
    },
    logging: false,
  });
} else {
  db = new Sequelize({
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: "localhost",
    port: process.env.POSTGRES_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

import "../models/index.js";

const testConnection = async () => {
  try {
    await db.authenticate();
    console.log("PostgreSQL database connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

const dropTables = async () => {
  try {
    await db.sync({ force: true });
    console.log("All tables successfully dropped");
  } catch (error) {
    console.error("❌ Drop tables failed:", error.message);
  }
};

const updateSchemaChanges = async () => {
  try {
    await db.sync({ alter: true });
    console.log("Schema synchronized");
  } catch (error) {
    console.error("Schema update failed:", error.message);
    console.error("Full error:", error);
  }
};

export { 
    db,
    updateSchemaChanges,
    testConnection,
    dropTables 
};

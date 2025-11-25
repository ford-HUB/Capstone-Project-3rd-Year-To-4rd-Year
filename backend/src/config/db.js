import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

let db;

// Check if we're using Railway (DATABASE_URL) or local development
if (process.env.DATABASE_URL) {
  // Railway PostgreSQL connection
  console.log("🔌 Using Railway DATABASE_URL for database connection");
  
  db = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Allow Railway's self-signed SSL
      },
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
      evict: 1000,
    },
    retry: {
      max: 3,
    },
  });
} else {
  // Local development connection
  console.log("🔌 Using local PostgreSQL connection");
  
  db = new Sequelize({
    database: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST || "localhost",
    port: process.env.POSTGRES_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
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
    console.log("PostgreSQL database connected successfully");
    
    const dbName = process.env.POSTGRES_DB;
    console.log(`Database: ${dbName}`);
  } catch (error) {
    console.error("Database connection failed!", error.message);
    console.error("Error code:", error.original?.code);
    console.error("Error details:", error.original?.detail);
  }
};

const dropTables = async () => {
  try {
    await db.sync({ force: true });
    console.log("All tables successfully dropped");
  } catch (error) {
    console.error("Drop tables failed:", error.message);
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

export { db, updateSchemaChanges, testConnection, dropTables }

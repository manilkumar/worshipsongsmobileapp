import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Open and connect to SQLite database
const connectSQLiteDB = async () => {
  return open({
    filename: "./worshipsongs.db", // or any path you want for your SQLite file
    driver: sqlite3.Database,
  });
};

export default connectSQLiteDB;
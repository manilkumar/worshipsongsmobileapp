const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Open and connect to SQLite database
const connectSQLiteDB = async () => {
  return open({
    filename: "./worshipsongs.db", // or any path you want for your SQLite file
    driver: sqlite3.Database,
  });
}

module.exports = connectSQLiteDB;
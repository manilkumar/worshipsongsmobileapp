import mysql from 'mysql2/promise';

const connectMySQLDB = async () => {
  let connection = null;
  if (!connection) {
    connection = await mysql.createConnection({
      host: 'shortline.proxy.rlwy.net',      // your MySQL host
      user: 'root',  // your MySQL username
      password: 'eRBPjbVtlQrycpOGKanTCXVPkjAsryyE', // your MySQL password
      database: 'WorshipSongs',  // your database name
      port: 15263, // your MySQL port, default is 3306
    });
  }
  return connection;
};

export default connectMySQLDB;
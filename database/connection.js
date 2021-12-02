const sqlite3 = require("sqlite3").verbose();

const DBSOURCE = "./database/database.db";

const db = new sqlite3.Database(DBSOURCE, function (err) {
  if (err) {
    console.log("errrojidfj")
    throw err;
  }
  console.log("Database connected");
});

module.exports = db;

//file:///C:/Users/jipva/Desktop/school/development%202/database/boeken.db
/**
 * Node App for the MangoApps Resources Page
 */
'use strict';

const express = require('express');
const multer = require('multer');
const app = express();
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

app.use(express.urlencoded({extended: true})); // for application/x-www-form-urlencoded
app.use(express.json()); // for application/json
app.use(multer().none()); // for multipart/form-data (required with FormData)

const SERVER_ERROR_CODE = 500;
const CLIENT_ERROR_CODE = 400;
const PORT_DEFAULT = 8000;

app.get('/all-resources', async function(req, res) {
  try {
    const db = await getDBConnection("ma-resources.db");
    let query = "SELECT * FROM resources";
    let result = await db.all(query);
    await db.close();
    res.send(result);
  } catch {
    console.log("catch in app.js got an error: " + error);
    //res.status(SERVER_ERROR_CODE).text("An error occurred on the server. Try again later.");
  }
})

app.post('/filtered-resources', async function(req, res) {
  let row = req.body.row
  let value = req.body.value
  if (!row || !value) {
    res.status(CLIENT_ERROR_CODE).text("Missing one or more of the required params.");
  } else {
    try {
      const db = await getDBConnection("ma-resources.db");
      let query = "SELECT * FROM resources WHERE " + row + " = \'" + value + "\'";
      let result = await db.all(query);
      await db.close();
      res.send(result);
    } catch {
      console.log("ahhhh there was an error: " + error);
    }
  }
})

/**
 * Establishes the connection to the database.
 * @param {String} dbFilePath - The path of the file to the database
 * @returns {db} the database connection
 */
async function getDBConnection(dbFilePath) {
  try {
    const db = await sqlite.open({
      filename: dbFilePath,
      driver: sqlite3.Database
    });
    return db;
  } catch {
    console.log("error in the catch block: " + error);
  }
}

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_DEFAULT;
app.listen(PORT);

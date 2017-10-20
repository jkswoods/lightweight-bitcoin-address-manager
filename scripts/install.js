// Require dependencies
const MongoClient = require("mongodb").MongoClient;
const auth = require("../src/Database/DatabaseHandler");

/**
 *  Create the database.
 */
MongoClient.connect(auth.url + auth.database, function(err, db) {
  // Error handling.
  if (err) throw err;

  // Log to the console that the database was successfully created.
  console.log("Database successfully created!");

  // Close the connection.
  db.close();
});

/**
 * Create the addresses collection.
 */
MongoClient.connect(auth.url + auth.database, function(err, db) {
  // Error handling.
  if (err) throw err;

  // Attempt to create the collections for storing the addresses.
  db.createCollection("addresses", function(err, res) {
    // Error handling.
    if (err) throw err;

    // Log to the console that the collection was successfully created.
    console.log("Address collection successfully created!");

    // Close the connection.
    db.close();
  });
});

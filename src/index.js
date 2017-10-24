// Require dependencies.
const btc = require("bitcoinjs-lib");
const express = require("express");
const bodyParser = require("body-parser");
const schedule = require("node-schedule");
const backup = require("mongodb-backup");
const timestamp = require("time-stamp");
const fs = require("fs-extra");
const dateMath = require("date-arithmetic");

/**
 *  Schedule a backup job to run every day at 00:00
 * 
 *  The job also removes the backup older than 10 days.
 */
schedule.scheduleJob("0 0 * * *", function() {
  const database = require("./Database/DatabaseHandler");

  // Perform the backup and save to the backups directory.
  backup({
    uri: database.url + database.database,
    root: __dirname + "/../backups/backup-" + timestamp(),
    collections: ["addresses"]
  });
  console.log(
    "Backup created: " + __dirname + "/../backups/backup-" + timestamp()
  );

  // Remove the backup which is now 10 days old.
  fs.remove(
    __dirname +
      "/../backups/backup-" +
      timestamp(dateMath.subtract(new Date(), 11, "day")),
    err => {
      if (err) return console.log(err);

      console.log(
        "Backup removed: " +
          __dirname +
          "/../backups/backup-" +
          timestamp(dateMath.subtract(new Date(), 11, "day"))
      );
    }
  );
});

const app = express();
app.use(bodyParser.json());

/**
 *  Generates a Bitcoin key pair, only the 'public' address
 *  is returned in the request. The private key is stored in a database.
 * 
 *  The private key MUST NEVER be returned in the response.
 */
app.get("/api/generate-address", function(req, res) {
  const handler = require("./Bitcoin/AddressHandler");

  // Generate the address.
  const address = handler.getAddress();

  // Return the address to the user.
  res.send(address);
});

/**
 *  Generates a SegWit compatible Bitcoin key pair, similar to 
 *  generating a normal address, only the 'public' key is returned.
 */
app.get("/api/generate-address-segwit", function(req, res) {
  const handler = require("./Bitcoin/AddressHandler");

  // Generate an address and get the SegWit equivalent.
  const address = handler.getSegWit();

  // Return the address to the user.
  res.send(address);
});

/**
 *  Create, sign and broadcast a transaction to the
 *  bitcoin network.
 */
app.post("/api/send-transaction", async (req, res) => {
  const transaction = require("./Bitcoin/TransactionHandler");

  // Foreach of the input addresses, retrieve the private key.
  let returned = await transaction.sendTransaction(req.body);

  // Return the transaction hex.
  res.send(returned);
});

/**
 *  Create, sign and broadcast a segwit transaction to the
 *  bitcoin network.
 */
app.post("/api/send-transaction-segwit", async (req, res) => {
  const transaction = require("./Bitcoin/TransactionHandler");

  // Foreach of the input addresses, retrieve the private key.
  let returned = await transaction.sendTransactionSegWit(req.body);

  // Return the transaction hex.
  res.send(returned);
});

// Initialise web server.
app.listen(3000);

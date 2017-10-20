/**
 * Handle saving addresses and keys in to the database.
 */

const MongoClient = require("mongodb").MongoClient;
const timestamp = require("time-stamp");

// Export the connection details.
module.exports = {
  // Variables.
  url: "mongodb://localhost:27017/",
  database: "addressServer",

  // Save a new address to the database.
  saveAddress: function(address, private) {
    MongoClient.connect(this.url + this.database, function(err, db) {
      // Error handling.
      if (err) throw err;

      // Save the address to the database.
      db.collection("addresses").insertOne({
        address: address,
        private: private,
        created: timestamp("YYYY/MM/DD:mm:ss")
      }, function(err, res) {
        // Error handling.
        if (err) throw err;

        // Close the connection.
        db.close();
      });
    });
  },

  getPrivate: async address => {
    const db = await MongoClient.connect(this.url + this.database);
    const result = await db.collection("addresses").find({
      address: address
    });

    for (
      let address = await result.next();
      address != null;
      address = await result.next()
    ) {
      return address.private;
    }
  }
};

/**
 *  Bitcoin address handling. 
 */

const bitcoin = require("bitcoinjs-lib");
const database = require("../Database/DatabaseHandler");

module.exports = {
  // Generate an address.
  getAddress: function() {
    let keyPair = bitcoin.ECPair.makeRandom();

    // Save the address and WIF to the database.
    database.saveAddress(keyPair.getAddress(), keyPair.toWIF());

    // Return the address.
    return keyPair.getAddress();
  },

  // Get the SegWit address..
  getSegWit: function() {
    let keyPair = bitcoin.ECPair.makeRandom();
    let pubKey = keyPair.getPublicKeyBuffer();
    let witnessScript = bitcoin.script.witnessPubKeyHash.output.encode(
      bitcoin.crypto.hash160(pubKey)
    );
    let scriptPubKey = bitcoin.script.scriptHash.output.encode(
      bitcoin.crypto.hash160(witnessScript)
    );
    let address = bitcoin.address.fromOutputScript(scriptPubKey);

    // Save the address and WIF to the database.
    database.saveAddress(address, keyPair.toWIF());

    // Return the address.
    return address;
  }
};

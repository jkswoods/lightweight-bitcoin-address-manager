/**
 *  Handle generating & signing transactions.
 */

const bitcoin = require("bitcoinjs-lib");
const database = require("../Database/DatabaseHandler");

module.exports = {
  // Create a transaction that can be broadcast to the Bitcoin network.
  sendTransaction: async req => {
    let tx = new bitcoin.TransactionBuilder();

    // Assign each privateKey to the corresponding input.
    for (let index = 0; index < req.input.length; index++) {
      req.input[index].private = await database
        .getPrivate(req.input[index].address)
        .catch(error => {
          console.log(error);
        });

      // Add each previous unused transaction output to the input.
      tx.addInput(req.input[index].previous_txo, index);
    }

    // Add the output to the transaction.
    for (let index = 0; index < req.output.length; index++) {
      tx.addOutput(req.output[index].address, req.output[index].amount);
    }

    // Sign the transactions
    for (let index = 0; index < req.input.length; index++) {
      tx.sign(index, bitcoin.ECPair.fromWIF(req.input[index].private));
    }

    // Return the transaction hex. Ready for broadcasting.
    return tx.build().toHex();
  },

  // Create, sign and broadcast a SegWit transaction to the Bitcoin network.
  sendTransactionSegWit: async req => {
    let tx = new bitcoin.TransactionBuilder();

    // Assign each privateKey to the corresponding input.
    for (let index = 0; index < req.input.length; index++) {
      req.input[index].private = await database
        .getPrivate(req.input[index].address)
        .catch(error => {
          console.log(error);
        });

      req.input[index].redeemScript = await module.exports
        .generateRedeemScript(req.input[index].private)
        .catch(error => {
          console.log(error);
        });

      // Add the input to the transaction.
      tx.addInput(req.input[index].previous_txo, index);
    }

    // Add the output to the transaction
    for (let index = 0; index < req.output.length; index++) {
      tx.addOutput(req.output[index].address, req.output[index].amount);
    }

    // Sign the transactions.
    for (let index = 0; index < req.input.length; index++) {
      tx.sign(
        index,
        bitcoin.ECPair.fromWIF(req.input[index].private),
        req.input[index].redeemScript,
        null,
        req.input[index].amount
      );
    }

    // Return the transaction hex. Ready for broadcasting.
    return tx.build().toHex();
  },

  generateRedeemScript: async private => {
    let keyPair = bitcoin.ECPair.fromWIF(private);
    let pubKey = keyPair.getPublicKeyBuffer();
    let pubKeyHash = await bitcoin.crypto.hash160(pubKey);

    // Generate and return the redeem script.
    return bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash);
  }
};

/*

Example transaction request body

{
	"input": [
		{
            "address": "xxxxxxxxxxxxxxx",
            // The amount is in satoshis
            "amount": 10000, 
            // A previous transaction output that will be used to fund the output of this transaction.
			"previous_txo": ""
		},
		{
			"address": "xxxxxxxxxxxxxxx",
			"amount": 150000,
			"previous_txo": ""
		}
	],
	"output": [
		{
			"address": "xxxxxxxxxxxxxxx",
			"amount": 155000 // Transaction fee is 5000 Satoshis
		}
	]
}

*/

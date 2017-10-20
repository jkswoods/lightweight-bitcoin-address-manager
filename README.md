# Lightweight Bitcoin Address Management (LBAM) for web applications

[![license](https://img.shields.io/github/license/jkswoods/lightweight-bitcoin-address-manager.svg)]()
[![Travis](https://img.shields.io/travis/jkswoods/lightweight-bitcoin-address-manager.svg)]()

The aim of this project is to provide a means of generating and storing Bitcoin key pairs as securely as possible for general-purpose Web applications.

Now, just looking at the code you may think to yourself "how is this secure?" - to that I say, it isn't, at least not by itself. Let me explain how this project is meant to work...

## How it works

This project is intended to run on its own dedicated server, separate and only accepting incoming connections from port 3000. Incoming connections can only come from sources you trust, this will need to be configured by you.

Private keys are not returned in any request, they are created, stored and used for signing transactions. Only addresses are returned after a generation request.

Key pairs are stored in a MongoDB collection.

## Install

Ensure you have MongoDB and Node 8 running on the server you wish to install.

Deploy LBAM to somewhere on the server and run:

``` npm run install-server ```

## Automated backups

Automated backups of the key pair data are scheduled to run every day at midnight (00:00), backups are retained for 10 days before automatic deletion. Backups are stored in the "backups" directory.

## Tests

A few tests are available to ensure the main components of LBAM are functioning correctly. It should be noted that there is currently no existing tests for transactions. 

``` npm run tests ```

## Documentation

Documentation is available here

## License

MIT
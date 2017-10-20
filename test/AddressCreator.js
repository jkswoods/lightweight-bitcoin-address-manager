// Require dependencies.
const expect = require("chai").expect;
const addressHandler = require("../src/Bitcoin/AddressHandler");

describe("Bitcoin address", function() {
  it("Generates a SegWit compatible Bitcoin address", function() {
    // Generate a SegWit address.
    const address = addressHandler.getSegWit();

    expect(address.length).to.equal(34);
  });

  it("Generates a Bitcoin address", function() {
    // Generate the address.
    const address = addressHandler.getAddress();

    expect(address.length).to.equal(34);
  });
});

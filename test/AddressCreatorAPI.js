// Require dependencies.
const expect = require("chai").expect;
const request = require("request");

describe("Bitcoin address API", function() {
  describe("Generates a SegWit compatible Bitcoin address", function() {
    let url = "http://localhost:3000/api/generate-address-segwit";

    it("Returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("The returned address is the expected length", function() {
      request(url, function(error, response, body) {
        expect(body.length).to.equal(34);
      });
    });
  });

  describe("Generates a Bitcoin address", function() {
    let url = "http://localhost:3000/api/generate-address";

    it("Returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

    it("The returned address is the expected length", function() {
      request(url, function(error, response, body) {
        expect(body.length).to.equal(34);
      });
    });
  });
});

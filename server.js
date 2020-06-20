// server.js
// where your node app starts
"use strict";
// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const apiToken = process.env.API_TOKEN;
const testToken = process.env.TEST_TOKEN;
const request = require("request");
var stream;
var partialMessage;

// our default array of dreams
const tickers = ["AAPL", "GOOG"];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/app/index.html");
});

// send the default array of dreams to the webpage
app.get("/update", (req, response) => {
  let thingsWanted = [
    "symbol",
    "latestPrice",
    "latestVolume",
    "previousClose",
    "previousVolume",
    "volume",
    "avgTotalVolume",
    "week52High",
    "week52Low"
  ];
  // express helps us take JS objects and send them as JSON
  const options = {
    url: `https://sandbox.iexapis.com/v1/stock/market/batch?types=quote&symbols=${tickers.join(
      ","
    )}&token=${testToken}`,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Accept-Charset": "utf-8"
    }
  };

  request(options, function(err, res, body) {
    if (res.statusCode === 200) {
      let json = JSON.parse(body);
      let transformedResponse = [];
      const filtered = Object.keys(json).forEach(tickerSymbol => {
        transformedResponse.push(
          Object.keys(json[tickerSymbol].quote)
            .filter(key => thingsWanted.includes(key))
            .reduce((obj, key) => {
              obj[key] = json[tickerSymbol].quote[key];
              return obj;
            }, {})
        );
      });
      response.send(transformedResponse);
    } else {
      response.send(res);
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

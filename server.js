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
const refreshInterval = 15000;     // TODO: Update this to 600000 for real server
let lastRequest = null;
let nextRefreshTime = Date.now() + refreshInterval;
let tickers = require("./tickers");

// our default array of dreams
// const tickers = ["AAPL", "GOOG", "SNAP"];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/app/index.html");
});

setInterval(() => {
  updateLastRequest();
}, refreshInterval);

function updateLastRequest() {
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
        Object.keys(json).forEach(tickerSymbol => {
            let tickersLastResponse = lastRequest ? lastRequest.stockData.find(i => i.symbol === tickerSymbol) : null;
            let filtered = Object.keys(json[tickerSymbol].quote)
              .filter(key => thingsWanted.includes(key))
              .reduce((obj, key) => {
                obj[key] = json[tickerSymbol].quote[key];
                return obj;
              }, {});
              let volumeOverYesterdays = filtered.latestVolume - filtered.previousVolume;
              let volumeOverAverage = filtered.latestVolume - filtered.avgTotalVolume;
              // Percent of daily volume increase over average volume
              let percentOverVolume = ((volumeOverAverage / filtered.avgTotalVolume) * 100).toFixed(2);
              let percentSinceLast = lastRequest ? (((filtered.latestVolume - tickersLastResponse.latestVolume) / filtered.latestVolume) * 100).toFixed(2) : 'n/a';
              let priceSinceLast = lastRequest ? (filtered.latestPrice - tickersLastResponse.latestPrice).toFixed(4) : 'n/a';
              let addedFormulas = { ...filtered, percentOverVolume, percentSinceLast, priceSinceLast, volumeOverAverage, volumeOverYesterdays };
              transformedResponse.push(addedFormulas);
        });

        nextRefreshTime = Date.now() + refreshInterval;
        lastRequest = { stockData: transformedResponse, nextRefreshTime, refreshInterval };
      } else {
        console.log(res);
      }
    });
}

// send the default array of dreams to the webpage
app.get("/update", (req, response) => {
  response.send(lastRequest);
});

// listen for requests :)
const listener = app.listen(3333, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

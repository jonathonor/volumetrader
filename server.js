let port = process.env.PORT || 8000;
let express = require("express");
let request = require("request-promise");
let app = express();
let server = require("http")
  .createServer(app)
  .listen(port, function() {
    console.log("Server is listening at port: ", port);
  });
let apiKey = process.env.API_KEY;
const refreshInterval = 120000; // Every 2 minutes
let nextRefreshTime = Date.now() + refreshInterval;
let lastResponse = null;
let sockets = [];

app.use(express.static("public"));

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/app/index.html");
});

let io = require("socket.io").listen(server);
var inputs = io.of("/");
let interval;
let inTestMode = false;

let isOpen = () => {
  let today = new Date();
  var startTime = "13:00:00";
  var endTime = "20:00:00";

  let currentDate = new Date();
  let currentDate2 = new Date();

  let startDate = new Date(currentDate.getTime());
  startDate.setHours(startTime.split(":")[0]);
  startDate.setMinutes(startTime.split(":")[1]);
  startDate.setSeconds(startTime.split(":")[2]);

  let endDate = new Date(currentDate2.getTime());
  endDate.setHours(endTime.split(":")[0]);
  endDate.setMinutes(endTime.split(":")[1]);
  endDate.setSeconds(endTime.split(":")[2]);

  let inTradingHours = startDate < currentDate && endDate > currentDate;

  return (today.getDay() % 6 && inTradingHours) || inTestMode;
};

let updateLastRequest = () => {
  let apiEndpoint = `https://sheets.googleapis.com/v4/spreadsheets`;
  let documentId = `1Cl7FVblJXjfhjva2BlJ57tu1PNdB8CU-u5qWd1RC_v0`;
  let range = `Sheet1!A1:O5`;

  if (isOpen()) {
    const options = {
      url: `${apiEndpoint}/${documentId}/values/${range}?key=${apiKey}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Charset": "utf-8"
      }
    };

    // console.log("in trading hours, sending requests");
    request(options)
      .then(body => {
        let json = JSON.parse(body);
        let responsesAsObjects = [];
        json.values.forEach((responseRow, i) => {
          // the first entry contains header data
          if (i > 0) {
            let ticker = responseRow[0];
            let volume = responseRow[7];
            let price = responseRow[1];
            let tickersLastResponse = lastResponse
              ? lastResponse.stockData.find(i => i.ticker === ticker)
              : null;

            let percentSinceLast = tickersLastResponse
              ? (
                  ((volume - tickersLastResponse.volume) / volume) *
                  100
                ).toFixed(2)
              : "n/a";

            let priceSinceLast = tickersLastResponse
              ? (price - tickersLastResponse.price).toFixed(4)
              : "n/a";

            let stockEntry = {
              ticker,
              price,
              abvavgpercent: responseRow[2],
              abvavgypercent: responseRow[3],
              abvavgvolume: responseRow[4],
              abvavgyesterday: responseRow[5],
              avgvolume: responseRow[6],
              volume,
              pricechangetoday: responseRow[8],
              pricepercentsinceyesterday: responseRow[9],
              fiftylow: responseRow[10],
              fiftyhigh: responseRow[11],
              beta: responseRow[12],
              datadelay: responseRow[13],
              yesterdaysvolume: responseRow[14],
              percentSinceLast,
              priceSinceLast
            };

            responsesAsObjects.push(stockEntry);
          }
        });

        nextRefreshTime = Date.now() + refreshInterval;
        lastResponse = {
          stockData: responsesAsObjects,
          nextRefreshTime
        };
        sockets.forEach(s => s.emit("stocks", lastResponse));
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    // console.log("not in trading hours");
  }
};

// on server start, fetch data and set up timer to continuously update request
updateLastRequest();
setInterval(() => {
  updateLastRequest();
}, refreshInterval);

inputs.on("connection", function(socket) {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  // emit as soon as connected
  socket.emit("stocks", lastResponse);

  // after connected, emit every 30 seconds
  // interval = setInterval(() => getDataAndEmit(socket), 30000);
  sockets.push(socket);
  socket.on("disconnect", () => {
    sockets = sockets.filter(s => s.id !== socket.id);
    console.log("Client disconnected");
    // clearInterval(interval);
  });
});

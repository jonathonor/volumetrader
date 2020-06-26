const React = require("react");
const socketIOClient = require("socket.io-client");

const TableHeader = require("./TableHeader");
const TableRow = require("./TableRow");

const ENDPOINT = window.location.href;

function Home() {
  const [response, setResponse] = React.useState([]);
  const [column, setColumn] = React.useState("percentSinceLast");
  const [direction, setDirection] = React.useState(true);
  const [nextRefreshTime, setNextRefreshTime] = React.useState("");

  React.useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("stocks", data => {
      setNextRefreshTime(data.nextRefreshTime);
      sorter(column, direction, data.stockData);
    });
  }, []);

  let sanitize = val => {
    return val.replace(/\$|\%|,/, "");
  };

  let sorter = (col, dir, incData) => {
    let data = incData || [...response];
    let stringCols = ["ticker"];
    // remove , and $
    let intCols = [
      "abvavgvolume",
      "abvavgyesterday",
      "avgvolume",
      "volume",
      "datadelay",
      "yesterdaysvolume"
    ];
    //remove % and $
    let floatCols = [
      "percentSinceLast",
      "priceSinceLast",
      "fiftylow",
      "fiftyhigh",
      "beta",
      "price",
      "abvavgpercent",
      "abvavgypercent",
      "pricechangetoday",
      "pricepercentsinceyesterday"
    ];
    if (intCols.includes(col)) {
      data.sort((a, b) => {
        let sanA = parseInt(sanitize(a[col]));
        let sanB = parseInt(sanitize(b[col]));

        if (sanB > sanA) {
          return -1;
        } else if (sanB < sanA) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (floatCols.includes(col)) {
      data.sort((a, b) => {
        let sanA = parseFloat(sanitize(a[col]));
        let sanB = parseFloat(sanitize(b[col]));

        if (sanB > sanA) {
          return -1;
        } else if (sanB < sanA) {
          return 1;
        } else {
          return 0;
        }
      });
    } else {
      data.sort((a, b) => a[col].localeCompare(b[col]));
    }

    if (direction) {
      data.reverse();
    }
    setResponse(data);
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <div>Volume Trader</div>
      <div>
        Next Refresh Time: {new Date(nextRefreshTime).toLocaleTimeString()}
      </div>
      <table id="stocks">
        <tbody>
          <TableHeader
            sortColumn={(col, dir) => sorter(col, dir)}
            column={column}
            setColumn={v => setColumn(v)}
            direction={direction}
            setDirection={() => setDirection()}
          />
          {response.map((arr, i) => {
            return <TableRow stockEntry={arr} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

module.exports = Home;

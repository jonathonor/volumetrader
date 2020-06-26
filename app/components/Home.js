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

  let sorter = (col, dir, incData) => {
    let data = incData || [...response];
    let stringCols = ["ticker"];
    if (!stringCols.includes(col)) {
      data.sort((a, b) => {
        if (b[col] > a[col]) {
          return -1;
        } else if (b[col] < a[col]) {
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

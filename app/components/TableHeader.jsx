const React = require("react");

const TableHeader = function({ sortColumn, direction, setDirection, column, setColumn }) {
  let headers = [
    { title: "Ticker", key: "symbol" },
    { title: "Latest Price", key: "latestPrice" },
    { title: 'Todays # Over Average Volume', key: "volumeOverAverage" },
    { title: 'Todays % Over Average Volume', key: "percentOverVolume" },
    { title: 'Todays # Over Yesterdays Volume', key: "volumeOverYesterdays" },
    { title: 'Volume Increase Since Last Call', key: "percentSinceLast" },
    { title: 'Price Change Since Last Call', key: "priceSinceLast" },
    { title: 'Volume (With Premarket)', key: "latestVolume" },
    { title: "Volume (Since Open)", key: "volume" },
    { title: "Yesterdays Volume", key: "previousVolume" },
    { title: "30 Day Average Volume", key: "avgTotalVolume" },
    { title: "Yesterdays Close Price", key: "previousClose" },
    { title: "52 Week Low", key: "week52Low" },
    { title: "52 Week High", key: "week52High" }
  ];

  return (
    <tr style={{ textAlign: "left" }}>
      {headers.map(h => {
        let sortText = direction ? "▴" : "▾";
        return (
          <th
            onClick={() => {
                setColumn(h.key);
                sortColumn(h.key, direction);
                setDirection(!direction);
            }}
          >
            <span>
              {h.title} {column === h.key ? sortText : ""}
            </span>
          </th>
        );
      })}
    </tr>
  );
};

module.exports = TableHeader;

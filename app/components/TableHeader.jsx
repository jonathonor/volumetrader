const React = require("react");

const headers = [
  "symbol",
  "latestPrice",
  "latestVolume",
  "volume",
  "previousVolume",
  "avgTotalVolume",
  "previousClose",
  "week52High",
  "week52Low"
];

const TableHeader = function() {
  return (
    <tr>
      {headers.map((header, key) => {
        return (
          <th key={key}>
            {header}
          </th>
        );
      })}
    </tr>
  );
};

module.exports = TableHeader;
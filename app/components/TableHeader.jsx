const React = require("react");

const TableHeader = function({
  sortColumn,
  direction,
  setDirection,
  column,
  setColumn
}) {
  let headers = [
    { title: "Ticker", key: "ticker" },
    { title: "Price", key: "price" },
    { title: "% Over Avg Volume", key: "abvavgpercent" },
    { title: "% Over Y Volume", key: "abvavgypercent" },
    { title: "Abv Avg Vol", key: "abvavgvolume" },
    { title: "Abv Avg Y", key: "abvavgyesterday" },
    { title: "Avg Volume", key: "avgvolume" },
    { title: "Volume", key: "volume" },
    { title: "$ today", key: "pricechangetoday" },
    { title: "$ % y", key: "pricepercentsinceyesterday" },
    { title: "52 low", key: "fiftylow" },
    { title: "52 high", key: "fiftyhigh" },
    { title: "Beta", key: "beta" },
    { title: "Delay", key: "datadelay" },
    { title: "Y Volume", key: "yesterdaysvolume" },
    { title: "% last", key: "percentSinceLast" },
    { title: "$ last", key: "priceSinceLast" }
  ];

  return (
    <tr style={{ textAlign: "left" }}>
      {headers.map(h => {
        let sortText = direction ? "▴" : "▾";
        return (
          <th
            onClick={() => {
              setDirection(!direction);
              setColumn(h.key);
              sortColumn(h.key, direction);
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

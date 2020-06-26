const React = require("react");

const TableRow = function({ stockEntry }) {
  let addCommas = x => {
    return x ? x.toLocaleString("en") : x;
  };
  console.log(stockEntry)
  return (
    <tr>
      <td>{stockEntry.ticker}</td>
      <td>{`$${stockEntry.price}`}</td>
      <td>{stockEntry.abvavgpercent}</td>
      <td>{stockEntry.abvavgypercent}</td>
      <td>{stockEntry.abvavgvolume}</td>
      <td>{stockEntry.abvavgyesterday}</td>
      <td>{stockEntry.avgvolume}</td>
      <td>{stockEntry.volume}</td>
      <td>{stockEntry.pricechangetoday}</td>
      <td>{stockEntry.pricepercentsinceyesterday}</td>
      <td>{`$${stockEntry.fiftylow}`}</td>
      <td>{`$${stockEntry.fiftyhigh}`}</td>
      <td>{stockEntry.beta}</td>
      <td>{stockEntry.datadelay}</td>
      <td>{stockEntry.yesterdaysvolume}</td>
      <td>{stockEntry.percentSinceLast}</td>
      <td>{`$${stockEntry.priceSinceLast}`}</td>
    </tr>
  );
};

module.exports = TableRow;

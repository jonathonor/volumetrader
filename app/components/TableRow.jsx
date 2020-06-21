const React = require("react");

const TableRow = function({ stockEntry }) {
  let addCommas = (x) => { return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") };
  return (
    <tr>
      <td>
        {stockEntry.symbol}
      </td>
      <td>
        {`$${stockEntry.latestPrice}`}
      </td>
      <td>
        {addCommas(stockEntry.volumeOverAverage)}
      </td>
      <td>
        {`${stockEntry.percentOverVolume}%`}
      </td>
      <td>
        {addCommas(stockEntry.volumeOverYesterdays)}
      </td>
      <td>
        {`${stockEntry.percentSinceLast}%`}
      </td>
      <td>
        {`${stockEntry.priceSinceLast}`}
      </td>
      <td>
        {addCommas(stockEntry.latestVolume)}
      </td>
      <td>
        {addCommas(stockEntry.volume)}
      </td>
      <td>
        {addCommas(stockEntry.previousVolume)}
      </td>
      <td>
        {addCommas(stockEntry.avgTotalVolume)}
      </td>
      <td>
        {`$${stockEntry.previousClose}`}
      </td>
      <td>
        {`$${stockEntry.week52Low}`}
      </td>
      <td>
        {`$${stockEntry.week52High}`}
      </td>
    </tr>
  );
};

module.exports = TableRow;

const React = require("react");

const TableRow = function({ stockEntry }) {
  return (
    <tr>
      {stockEntry ? Object.keys(stockEntry).map(function(key, i) {
        return (
          <td key={i}>
            {stockEntry[key]}
          </td>
        );
      }) : null}
    </tr>
  );
};

module.exports = TableRow;

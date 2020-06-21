const axios = require("axios");
const React = require("react");
const TableHeader = require("./TableHeader");
const TableRow = require("./TableRow");
const selfUrl = window.location.href;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      column: "",
      direction: true,
      nextRefreshTime: "",
      stockData: []
    };
  }

  setColumn(col) {
    this.setState({ column: col })
  }

  // true = asc | false = desc
  setDirection() {
    this.setState({ direction: !this.state.direction })
  }

  setRequestTimeData(requestData) {
    let nextRefreshTimeMillis = requestData.nextRefreshTime;
    let nextRefreshTime = new Date(requestData.nextRefreshTime).toLocaleTimeString();
    let refreshInterval = requestData.refreshInterval;
    this.setState({ nextRefreshTime, refreshInterval, nextRefreshTimeMillis });
  }

  componentDidMount() {
    this.getStockData().then(() => {
      setTimeout(() => {
        this.getStockData();
        this.interval = setInterval(() => {
          this.getStockData();
        }, this.state.refreshInterval + 100);
      }, this.state.nextRefreshTimeMillis - Date.now());
    });
  }

  getStockData() {
    return axios
      .get(`${selfUrl}update`)
      .then(response => {
        if (response.status === 200) {
          this.setRequestTimeData(response.data);
          this.sort(this.state.column, !this.state.direction, response.data.stockData);
          return response;
        } else {
          console.log(response);
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  sort(col, direction, responseData) {
    let data = responseData ? [ ...responseData] : [ ...this.state.stockData];
    let stringCols = ["symbol"];
    if (!stringCols.includes(col)) {
      data.sort((a, b) => {
        if (parseInt(b[col]) > parseInt(a[col])) return -1;
        else if (parseInt(b[col]) < parseInt(a[col])) return 1;
        else return 0;
      });
    } else {
      data.sort((a, b) => a[col].localeCompare(b[col]));
    }

    if (direction) {
      data.reverse();
    }
    this.setState({ stockData: data });
  }

  render() {
    return (
      <div>
        <div>Volume Trader</div>
        <div>Next Refresh Time: {this.state.nextRefreshTime}</div>
        <table id="stocks">
          <tbody>
            <TableHeader sortColumn={(col, dir) => this.sort(col, dir)} column={this.state.column} setColumn={(v) => this.setColumn(v)}
            direction={this.state.direction} setDirection={() => this.setDirection()}/>
            {this.state.stockData.map((arr, i) => {
              return <TableRow stockEntry={arr} />;
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = Main;

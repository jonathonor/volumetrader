const axios = require("axios");
const React = require("react");
const TableHeader = require("./TableHeader");
const TableRow = require("./TableRow");

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stockData: []
    };
  }

  componentDidMount() {
    this.getStockData();
    this.interval = setInterval(() => {
      this.getStockData();
    }, 15000);
    // TODO: Update this to 600000 for real server
  }

  getStockData() {
    axios
      .get("https://volumetrades.glitch.me/update")
      .then(response => {
        //console.log(response.data);
        if (response.status === 200) {
          this.setState({
            stockData: response.data
          });
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

  render() {
    return (
      <div>
        <div>Volume Trader</div>
        <table>
          <tbody>
            <TableHeader />
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

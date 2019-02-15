import React, { Component } from "react";
import "./App.css";
const ymaps = window.ymaps;

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newPointName: "",
      points: []
    };
  }
  render() {
    return (
      <div className="App">
        <div className="points-section">
          <form onSubmit={this.handleNewPointSubmit}>
            <legend>New waypoint</legend>
            <input
              required
              type="text"
              placeholder="Name"
              value={this.state.newPointName}
              onChange={this.handleNewPointNameChange}
            />
          </form>
          <ol>
            <li>Point1</li>
            <li>Point2</li>
          </ol>
        </div>
        <div id="map" className="map"></div>
      </div>
    );
  }

  componentDidMount() {
    ymaps.ready(init);
    function init() {
      var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
      });
    }
  }

  handleNewPointSubmit = (event) => {
    event.preventDefault();
    // TODO
    console.log(this.state.newPointName);
  }
  handleNewPointNameChange = (event) => {
    this.setState({ newPointName: event.target.value });
  }
}

export default App;

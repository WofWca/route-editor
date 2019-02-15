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
    this.map = null;
    this.nextPointId = 1;
  }
  render() {
    return (
      <div className="App">
        <div className="points-editor">
          <form onSubmit={this.handleNewPointSubmit}>
            <legend>New waypoint</legend>
            <input
              required
              autoFocus
              type="text"
              placeholder="Name"
              value={this.state.newPointName}
              onChange={this.handleNewPointNameChange}
            />
          </form>
          <ol className="points-list">
            {this.state.points.map((point) => (
              <li key={point.id}>{point.name}</li>
            ))}
          </ol>
        </div>
        <div id="map" className="map"></div>
      </div>
    );
  }

  componentDidMount() {
    const ymapsInit = () => {
      this.map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
      });
    };
    ymaps.ready(ymapsInit);
    this.mapDrawPoints();
  }

  handleNewPointSubmit = (event) => {
    event.preventDefault();

    this.setState((state, props) => {
      let newStatePoints = state.points.slice();
      const newPointId = this.nextPointId;
      this.nextPointId++;
      newStatePoints.push(
        {
          id: newPointId,
          name: this.state.newPointName,
          coordinates: this.map.getCenter() //TODO
        }
      );
      return { points: newStatePoints, newPointName: "" };
    });
  }

  handleNewPointNameChange = (event) => {
    this.setState({ newPointName: event.target.value });
  }

  mapDrawPoints = () => {
    for (let listPoint of this.state.points) {
      let newYmapsPoint = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: listPoint.coordinates
        },
        properties: {
          hintContent: ""
        }
      }, { draggable: true }
      );
      this.map.geoObjects.add(newYmapsPoint);
    }
  }

  mapClearPoints = () => {
    this.map.geoObjects.removeAll();
  }

  componentDidUpdate () {
    this.mapClearPoints();
    this.mapDrawPoints();
  }
}

export default App;

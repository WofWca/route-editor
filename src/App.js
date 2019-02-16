import React, { Component } from "react";
import "./App.css";
const ymaps = window.ymaps;

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      newPointName: "",
      /* `points` item structure: {
          id,
          name,
          ymapsObj: Yandex Maps GeoObject
      } */
      points: []
    };
    this.map = undefined;
    this.nextPointId = 1;
    this.ymapsRouteObj = undefined;
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
      this.ymapsRouteObj = new ymaps.Polyline([55.76, 37.64]);
      this.map.geoObjects.add(this.ymapsRouteObj);
    };
    ymaps.ready(ymapsInit);
  }

  handleNewPointSubmit = (event) => {
    event.preventDefault();

    const newPointName = this.state.newPointName;
    this.setState((state, props) => {
      let newStatePoints = state.points.slice();
      const newPointId = this.nextPointId;
      this.nextPointId++;
      let newYmapsPoint = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: this.map.getCenter()
        },
        properties: {
          balloonContent: newPointName
        }
      }, { draggable: true }
      );
      newYmapsPoint.events.add("geometrychange", () => {
        this.mapRefreshRoute();
      });
      this.map.geoObjects.add(newYmapsPoint);
      newStatePoints.push(
        {
          id: newPointId,
          name: newPointName,
          ymapsObj: newYmapsPoint
        }
      );
      return { points: newStatePoints, newPointName: "" };
    });
  }

mapRefreshRoute = () => {
    const routeCoordinates = [];
    for (let point of this.state.points) {
      // For a point, its bounds is a 0 area rectangle.
      let pointCoordinates = point.ymapsObj.geometry.getBounds()[0];
      routeCoordinates.push(pointCoordinates);
    }
    this.ymapsRouteObj.geometry.setCoordinates(routeCoordinates);
  }

  handleNewPointNameChange = (event) => {
    this.setState({ newPointName: event.target.value });
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (this.state.points !== prevState.points) {
      this.mapRefreshRoute();
    }
  }
}

export default App;

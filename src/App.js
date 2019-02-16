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
      points: [],
      mapReady: false
    };
    this.map = undefined;
    this.nextPointId = 1;
    this.ymapsRouteObj = undefined;
    this.newPointNameInput = React.createRef();
  }
  render() {
    return (
      <div className="App">
        <div className="points-editor">
          <form onSubmit={this.handleNewPointSubmit}>
            <legend>New waypoint</legend>
            <input
              disabled={!this.state.mapReady}
              required
              autoFocus
              type="text"
              placeholder="Name"
              value={this.state.newPointName}
              onChange={this.handleNewPointNameChange}
              ref={this.newPointNameInput}
            />
          </form>
          <ol className="points-list">
            {this.state.points.map((point) => (
              <li
                key={point.id}
                draggable
                onDragStart={(e) => this.handlePointListItemDragStart(e, point)}
                onDragOver={this.allowDrop}
                onDrop={(e) => this.handlePointListItemDrop(point)}
                onDragEnd={this.handlePointListItemDragEnd}
                className="point"
              >
                {point.name}</li>
            ))}
          </ol>
        </div>
        <div id="map" className="map"></div>
      </div>
    );
  }

  handlePointListItemDragEnd = (event) => {
    this._draggedPoint = null;
  }

  handlePointListItemDragStart = (event, draggedPoint) => {
    this._draggedPoint = draggedPoint;
    event.dataTransfer.setData("text", "Stub data");
  }

  handlePointListItemDrop = (dropOntoPoint) => {
    if (this._draggedPoint) {
      this.setState((state, props) => {
        const newStatePoints = state.points.slice();
        const dropOntoPointInd = state.points.indexOf(dropOntoPoint);
        const draggedPointInd = state.points.indexOf(this._draggedPoint);
        newStatePoints.splice(draggedPointInd, 1);
        newStatePoints.splice(dropOntoPointInd, 0, this._draggedPoint);
        return { points: newStatePoints };
      });
    }
  }

  allowDrop (event) {
    event.preventDefault();
  }

  componentDidMount() {
    const ymapsInit = () => {
      this.setState({mapReady: true});
      this.map = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 10
      });
      this.ymapsRouteObj = new ymaps.Polyline([55.76, 37.64]);
      this.map.geoObjects.add(this.ymapsRouteObj);
      this.map.events.add("actionbegin", () => {
        this.newPointNameInput.current.focus();
      });
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

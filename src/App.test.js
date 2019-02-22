import React from "react";
import App from "./App";
import ymaps from "./ymaps";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
jest.mock("./ymaps");

let appWrapper;
it("renders without crashing", () => {
  appWrapper = mount(<App />);
});

let mapObj;
it("Creates a map object", () => {
  expect(ymaps.Map).toHaveBeenCalledTimes(1);
  mapObj = ymaps.Map.mock.instances[0];
});

/* Moves the map to `coordinates`, types `name`, sumbits the form,
returns the new `ymaps.GeoObject` */
function createNewPoint({ name, coordinates }) {
  mapObj._setCenter(coordinates);
  appWrapper.find(".points-editor input")
    .simulate("change", { target: { value: name } });
  appWrapper.find(".points-editor form").simulate("submit");
  const pointGeoObjects = ymaps.GeoObject.mock.instances.filter((geoObj, ind) => {
    return ymaps.GeoObject.mock.calls[ind][0].geometry.type === "Point";
  });
  return pointGeoObjects[pointGeoObjects.length - 1];
}

let testPoints = [
  {
    name: "Miami",
    coordinates: [11.22, 33.444],
    _coordinatesAfterMove: [12.22, 30.4],
    geoObj: undefined
  }, {
    name: "Berlin",
    coordinates: [22.33, 44.5],
    geoObj: undefined
  }, {
    name: "Ottawa",
    coordinates: [33.4, 55.666],
    _coordinatesAfterMove: [33.6, 54.5],
    geoObj: undefined
  }, {
    name: "Warsaw",
    coordinates: [44.55, 66.777],
    geoObj: undefined
  }, {
    name: "Saint-Petersburg",
    coordinates: [55.5, 44.4],
    _coordinatesAfterMove: [56.5, 45.4],
    geoObj: undefined
  }, {
    name: "Panama",
    coordinates: [200.2, 10.1],
    _coordinatesAfterMove: [201.3, 11.2],
    geoObj: undefined
  }
];
describe("Create one point", () => {
  let pointWrappers;
  it("Creates a new point", () => {
    testPoints[0].geoObj = createNewPoint(testPoints[0]);
    expect(testPoints[0].geoObj).not.toBeUndefined();
  });

  it("Adds the new point to the map", () => {
    expect(mapObj.geoObjects.add).toHaveBeenCalledWith(testPoints[0].geoObj);
  });

  it("Adds the new point to the list", () => {
    pointWrappers = appWrapper.find(".point");
    expect(pointWrappers).toHaveLength(1);
  });

  it("Renders the correct point label in the list", () => {
    expect(pointWrappers.find(".point-name").text())
      .toStrictEqual(testPoints[0].name);
  });

  it("Places the new point in the center of the map", () => {
    expect(testPoints[0].geoObj.geometry.getBounds()[0])
      .toStrictEqual(mapObj.getCenter());
  });
});

let polylineGeoObject;
describe("Create one more point", () => {
  it("Creates a second point", () => {
    testPoints[1].geoObj = createNewPoint(testPoints[1]);
    expect(testPoints[1].geoObj).not.toBeUndefined();
  });

  it("Places the second point at the center of the map", () => {
    expect(testPoints[1].geoObj.geometry.getBounds()[0])
      .toStrictEqual(mapObj.getCenter());
  });

  it("Creates a polyline", () => {
    polylineGeoObject = ymaps.GeoObject.mock.instances.find((geoObj, ind) => {
      return ymaps.GeoObject.mock.calls[ind][0].geometry.type === "LineString";
    });
    expect(polylineGeoObject).not.toBeUndefined();
  });

  it("Connects the two points with a polyline", () => {
    expect(polylineGeoObject.geometry._coordinates[0])
      .toStrictEqual(testPoints[0].geoObj.geometry._coordinates);
    expect(polylineGeoObject.geometry._coordinates[1])
      .toStrictEqual(testPoints[1].geoObj.geometry._coordinates);
  });

  it("Holds only 3 GeoObjects on the map", () => {
    expect(mapObj.geoObjects._collection).toHaveLength(3);
  });
});

describe("Create more points", () => {
  it("Creates more points and adds them to the map", () => {
    for (let pointI=2; pointI < testPoints.length; pointI++) {
      testPoints[pointI].geoObj = createNewPoint(testPoints[pointI]);
      expect(testPoints[pointI].geoObj).not.toBeUndefined();
      expect(mapObj.geoObjects.add).toHaveBeenLastCalledWith(testPoints[pointI].geoObj);
    }
  });

  it("Connects all the points with a polyline in the right order", () => {
    for (let pointI = 0; pointI < testPoints.length; pointI++) {
      expect(polylineGeoObject.geometry._coordinates[pointI])
        .toStrictEqual(testPoints[pointI].geoObj.geometry._coordinates);
    }
  });

  it("Sets balloon contents correctly", () => {
    for (let pointI = 0; pointI < testPoints.length; pointI++) {
      expect(testPoints[pointI].geoObj._feature.properties.balloonContent)
        .toStrictEqual(testPoints[pointI].name);
    }
  });

  it("Creates draggable points", () => {
    for (let point of testPoints) {
      expect(point.geoObj._options.draggable).toBe(true);
    }
  });

  it("Doesn't hold any excess objects on the map", () => {
    // Points + a polyline
    expect(mapObj.geoObjects._collection).toHaveLength(testPoints.length + 1);
  });

  // For the sake of performance, GeoObjects should be changed, not re-created.
  it("Doesn't re-create already existing objects", () => {
    expect(mapObj.geoObjects.add).toHaveBeenCalledTimes(testPoints.length + 1);
  });
});

describe("Moving points on the map", () => {
  it("Redraws the route according new point locations", () => {
    for (let pointI = 0; pointI < testPoints.length; pointI++) {
      if (testPoints[pointI]._coordinatesAfterMove !== undefined) {
        testPoints[pointI].coordinates = testPoints[pointI]._coordinatesAfterMove;
        testPoints[pointI].geoObj.geometry._coordinates =
          testPoints[pointI].coordinates;
        testPoints[pointI].geoObj.events._trigger("geometrychange");
      }
      expect(polylineGeoObject.geometry._coordinates[pointI])
        .toStrictEqual(testPoints[pointI].geoObj.geometry._coordinates);
    }
  });
});

describe("Reordering points in the list", () => {
  const pointReorderMoves = [
    { drag: 5, drop: 0, expectedOrder: [5, 0, 1, 2, 3, 4] },
    { drag: 4, drop: 2, expectedOrder: [0, 1, 4, 2, 3, 5] },
    { drag: 1, drop: 3, expectedOrder: [0, 2, 3, 1, 4, 5] },
    { drag: 0, drop: 5, expectedOrder: [1, 2, 3, 4, 5, 0] },
  ];
  function MockReorderEvent () {
    this.preventDefault = jest.fn();
    this.dataTransfer = { setData: jest.fn() };
  }
  it("Redraws the route and the list on drag-n-drop reordering", () => {
    for (let reorder of pointReorderMoves) {
      let pointsWrapperBefore = appWrapper.find(".point");
      let mockReorderEvent = new MockReorderEvent();
      // Reorder the test points.
      let testPointsReordered = [];
      for (let pointI = 0; pointI < testPoints.length; pointI++) {
        testPointsReordered[pointI] = testPoints[reorder.expectedOrder[pointI]];
      }
      testPoints = testPointsReordered;
      // Reorder the component points.
      pointsWrapperBefore.at(reorder.drag).simulate("dragstart", mockReorderEvent);
      pointsWrapperBefore.at(reorder.drop).simulate("dragover", mockReorderEvent);
      pointsWrapperBefore.at(reorder.drop).simulate("drop", mockReorderEvent);
      pointsWrapperBefore.at(reorder.drag).simulate("dragend", mockReorderEvent);
      let pointNamesWrapperAfter = appWrapper.find(".point-name");
      for (let pointI = 0; pointI < pointNamesWrapperAfter.length; pointI++) {
        expect(pointNamesWrapperAfter.at(pointI).text())
          .toStrictEqual(testPoints[pointI].name);
        expect(polylineGeoObject.geometry._coordinates[pointI])
          .toStrictEqual(testPoints[pointI].coordinates);
      }
    }
  });

  it("Does nothing if it's not a list item dropped on another one", () => {
    const pointsWrapper = appWrapper.find(".point");
    const somethingElseWrapper = appWrapper.find("input").first();
    const mockReorderEvent = new MockReorderEvent();
    somethingElseWrapper.simulate("dragstart", mockReorderEvent);
    pointsWrapper.at(3).simulate("dragover", mockReorderEvent);
    pointsWrapper.at(3).simulate("drop", mockReorderEvent);
    somethingElseWrapper.simulate("dragend", mockReorderEvent);
  });
});

describe("Deleting points", () => {
  const pointsToDelete = [2, 0, testPoints.length - 3]; // Third, first, last.
  const deletedTestPoints = [];
  it("Deletes points from the list", () => {
    for (let pointToDeleteInd of pointsToDelete) {
      let pointsWrapperBefore = appWrapper.find(".point");
      // Delete a point from the test array.
      deletedTestPoints.push(testPoints.splice(pointToDeleteInd, 1)[0]);
      pointsWrapperBefore.find("button.delete").at(pointToDeleteInd).simulate("click");
      let pointsWrapperAfter = appWrapper.find(".point");
      expect(pointsWrapperAfter).toHaveLength(testPoints.length);
      for (let pointI = 0; pointI < testPoints.length; pointI++) {
        expect(pointsWrapperAfter.at(pointI).find(".point-name").text())
          .toStrictEqual(testPoints[pointI].name);
      }
    }
  });

  it("Deletes points from the map", () => {
    expect(mapObj.geoObjects.remove).toHaveBeenCalledTimes(deletedTestPoints.length);
    for (let deletedPoint of deletedTestPoints) {
      expect(mapObj.geoObjects.remove).toHaveBeenCalledWith(deletedPoint.geoObj);
    }
  });

  it("Redraws the route accordingly", () => {
    for (let pointI; pointI < testPoints; pointI++) {
      expect(polylineGeoObject.geometry._coordinates[pointI])
        .toStrictEqual(testPoints[pointI].geoObj.geometry._coordinates);
    }
  });
});

it("Can stand the deletion of all points", () => {
  let pointsWrapper = appWrapper.find(".point");
  while (pointsWrapper.length > 0) {
    pointsWrapper.at(0).find("button.delete").simulate("click");
    pointsWrapper = appWrapper.find(".point");
  }
});

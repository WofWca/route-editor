import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ymaps from "./ymaps";
import { mount, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
jest.mock("./ymaps");

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("Create one point", () => {
  let newPointGeoObject;
  let mapObj;
  let newPointNameInput;
  let newPointNameInputForm;
  beforeAll(() => {
    jest.clearAllMocks();
    const wrapper = mount(<App />);
    mapObj = ymaps.Map.mock.instances[0];
    mapObj._setCenter([12.34, 56.78]);
    newPointNameInput = wrapper.find(".points-editor input");
    newPointNameInput.simulate("change", { target: { value: "Test name" } });
    newPointNameInputForm = wrapper.find(".points-editor form");
    newPointNameInputForm.simulate("submit");
    newPointGeoObject = ymaps.GeoObject.mock.instances.find((geoObj, ind) => {
      return ymaps.GeoObject.mock.calls[ind][0].geometry.type === "Point";
    });
  });

  it("Creates no more than two GeoObjects", () => {
    // Polyline (may be created later, when there is a second point) and the first point.
    expect(ymaps.GeoObject.mock.instances.length).toBeLessThanOrEqual(2);
  });
  
  it("Creates a point on form submission", () => {
    expect(mapObj.geoObjects.add).toHaveBeenCalledWith(newPointGeoObject);
  });

  it("Places the new point in the center of the map", () => {
    expect(newPointGeoObject.geometry.getBounds()[0]).toEqual(mapObj.getCenter());
  });
});

describe("Create two points", () => {

});
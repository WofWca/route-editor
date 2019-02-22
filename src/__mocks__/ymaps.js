const PointGeometry = jest.fn().mockImplementation(function (coordinates) {
  this._coordinates = coordinates;
  this.getBounds = jest.fn().mockImplementation(() => { return [this._coordinates]; });
});

const LineStringGeometry = jest.fn().mockImplementation(function (coordinates) {
  this._coordinates = coordinates;
  this.setCoordinates = jest.fn().mockImplementation((coordinates) => {
    this._coordinates = coordinates;
  });
});

const Map = jest.fn().mockImplementation(function () {
  this._center = [11.22, 33.44]; // TODO
  this.geoObjects = {
    _collection: [],
    add: jest.fn().mockImplementation(function (geoObject) {
      this._collection.push(geoObject);
    }),
    remove: jest.fn().mockImplementation(function (geoObjectToDelete) {
      const toDeleteInd = this._collection.indexOf(geoObjectToDelete);
      this._collection.splice(toDeleteInd, 1);
    })
  };
  this.events = { add: jest.fn() };
  this.getCenter = jest.fn().mockImplementation(() => {
    return this._center;
  });
  this._setCenter = (coordinates) => {
    this._center = coordinates;
  };
});

const GeoObject = jest.fn().mockImplementation(function (feature, options) {
  this._feature = feature;
  this._options = options;
  if (feature.geometry.type === "Point") {
    this.geometry = new PointGeometry(feature.geometry.coordinates);
  } else if (feature.geometry.type === "LineString") {
    this.geometry = new LineStringGeometry(feature.geometry.coordinates);
  } else throw "Not implemented";
  this.events = {
    _collection: {},
    add: jest.fn().mockImplementation(function (name, handler) {
      this._collection[name] = handler;
    }),
    _trigger: function (name) {
      this._collection[name]();
    }
  };
});

const Polyline = jest.fn().mockImplementation(function (coordinates) {
  GeoObject.call(this,
    {
      geometry: {
        coordinates,
        type: "LineString"
      }
    }
  );
  this.__proto__ = GeoObject;
});

const ymaps = {
  ready: jest.fn().mockImplementation((callback) => callback()),
  Polyline,
  Map,
  GeoObject
};
export default ymaps;

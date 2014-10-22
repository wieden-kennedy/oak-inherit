"use strict";

oak.Base = function () {
}.inherit();

oak.extend(oak.Base.prototype, { 

  _defaults: {},

  // Default _init method, will take spec hash and match it against defaults property
  // Will only assing properties in spec that exist in the defaults hash
  _init: function (spec) {
    spec = spec || {};
    // Function for assigning defaults and overriding those defaults with a spec object
    var key;
    for (key in this._defaults) {
      if (typeof spec[key] === "undefined") {
        this[key] = this._defaults[key];
      } else {
        this[key] = spec[key];
      }
    }
  },

  defaults: function (params) {
    var
      key,
      map = {};

    if (typeof this._defaults !== "undefined") {
      for (key in this._defaults) {
        map[key] = this._defaults[key];
      }
    }
    for (key in params) {
      map[key] = params[key];
    }
    this._defaults = map;
  }

});

"use strict";

(function () {

  var initializing = false;

  var inherit = window.inherit = function (Parent, self, props) {
    // Proxy constructor
    var Child = function () {
      self.apply(this);
      if (initializing === false && typeof this._init === "function") {
        this._init.apply(this, arguments);
      }
    };
    
    // So _init doesn't get called on parent classes when setting prototype
    var proto;
    if (Parent) {
      initializing = true;
      proto = Child.prototype = new Parent();
      initializing = false;
    }

    Child.prototype.constructor = Child;

    // If props were passed, extend the Child's prototype
    if (typeof props === "object" && proto) {
      oak.extend(proto, props);
    }

    return Child;
  };
  
  Function.prototype.inherit = function (Parent, props) {
    return inherit(Parent, this, props);
  };
  
}());

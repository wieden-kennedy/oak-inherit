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

"use strict";

oak.Evented = function () {
}.inherit(oak.Base);

oak.extend(oak.Evented.prototype, { 

  _init: function (spec) {
    oak.Base.prototype._init.call(this, spec);
    this._events = {};
    this._observers = {};
  },

  // Adds an event listener using a inding scope 
  addObserver: function (target, type, listener, scope) {
    scope = scope || this;

    var handler = function () {
      listener.apply(scope, oak._arrProto.slice.call(arguments, 0));
    };

    this._observers[type] = this._observers[type] || [];

    this._observers[type].push({
      target: target,
      type: type,
      listener: listener,
      scope: scope,
      handler: handler
    });

    target.addEventListener(type, handler, false); 
  },

  // Remove a scope handler
  removeObserver: function (target, type, listener, scope) {
    scope = scope || this;

    if (typeof this._observers[type] === "undefined") { return; }

    var observer,
        i = this._observers[type].length;
    
    while (i--) {
      observer = this._observers[type][i];
      if (observer.target === target && observer.type === type && observer.listener === listener && observer.scope === scope) {
        target.removeEventListener(type, observer.handler);
      }
    }
  },

  // On
  // --
  // Bind an event to the strapped collection 
  on: function (name, callback, scope) {
    if (!oak.defined(name, callback)) {
      return this;
    }
    scope = scope || null;

    this._events = this._events || {};
    var list = this._events[name] || (this._events[name] = []); 
    list.push({
      callback: callback,
      scope: scope
    });

    return this;
  },

  // Off
  // ---
  // Unbind an event
  off: function (name, callback) {
    if (!oak.defined(name, this._events) || typeof this._events[name] === "undefined") {
      return this;
    }

    var self = this;
    if (oak.defined(callback)) {
      oak.each(this._events[name], function (obj, index) {
        if (obj.callback === callback) {
          self._events[name].splice(index, 1);
        }
      });
    }

    if (typeof callback === "undefined" || this._events[name].length === 0) {
      delete this._events[name];
    }

    return this;
  },

  // Once
  // ----
  // Binds an event that is only trigger once
  // Once triggered, it is removed
  once: function (name, callback, scope) {
    if (!oak.defined(name, callback)) {
      return this;
    }

    var once = function () {
      var scope = scope || this;
      callback.apply(scope, arguments);
      this.off(name, once);
    };

    return this.on(name, once);
  },

  // Trigger
  // -------
  // Dispatch an event
  trigger: function (name) {
    if (typeof name !== "string" || typeof this._events !== "object" || typeof this._events[name] === "undefined") {
      return this;
    }

    var 
      scope,
      self = this,
      args = oak._arrProto.slice.call(arguments, 1);

    oak.each(this._events[name], function (obj) {
      scope = obj.scope || self;
      obj.callback.apply(scope, args);
    });

    return this;
  }

});

"use strict";

oak.Statable = function () {


}.inherit(oak.Evented, {

  states: {},

  // setState
  // --------
  // setting a state will look for an on handler in the states object
  // E.g. setState("loading") will call the states.onLoading function if it's
  // defined.
  setState: function (state) {
    var args = oak._arrProto.slice.call(arguments, 1);
    var offCallback, offEvent, onCallback, onEvent,
        newState = state;

    if (typeof this.currentState === "undefined" || newState !== this.currentState) {
      onCallback = this.states["on" + newState.replace(/^\w/, function (s) { return s.toUpperCase(); })];
      onEvent = "on:" + newState;
      if (typeof this.currentState !== "undefined") {
        offCallback = this.states["off" + this.currentState.replace(/^\w/, function (s) { return s.toUpperCase(); })];
        offEvent = "off:" + this.currentState;
      }

      this.currentState = newState;
      if (typeof offCallback !== "undefined") {
        offCallback.apply(this);
        this.trigger(offEvent, args);
      }
      if (typeof onCallback !== "undefined") {
        onCallback.apply(this, args);
        this.trigger(onEvent, args);
      }
    }
  }
});


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

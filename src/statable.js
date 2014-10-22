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


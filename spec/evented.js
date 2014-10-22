"use strict";

describe("evented", function () {

  var facade, startupCalled;
  beforeEach(function () {
    facade = new oak.Evented();
    startupCalled = false;

    facade.on("startup", function () {
      startupCalled = true;
    });
  });

  it("Evented exists", function () {
    expect(oak.Evented).toBeDefined();
  });

  it("Triggers event", function () {
    facade.trigger("startup");
    expect(startupCalled).toBe(true);
  });

  describe("off", function () {

    it("removes handler", function () {
      var count = 0;
      facade.on("click", function () {
        count += 1;
        facade.off("click");
      });

      facade.trigger("click");
      facade.trigger("click");
      facade.trigger("click");

      expect(count).toBe(1);
    });

    it("removes multiple handlers", function () {
      var count = 0;
      facade.on("count", function () {
        count += 1;
      });

      facade.on("count", function () {
        count += 1;
      });

      facade.trigger("count");

      expect(count).toBe(2);
    });

  });

  describe("once", function () {

    it("Calls handler once", function () {
      var count = 0;

      facade.once("tick", function () {
        count += 1;
      });

      facade.trigger("tick");
      facade.trigger("tick");
      facade.trigger("tick");

      expect(count).toBe(1);
    });


    it("Calls correct handler", function () {
      var count = 0;

      facade.once("tick", function () {
        count += 1;
      });

      facade.once("tickTwice", function () {
        count += 2;
      });

      facade.trigger("tick");

      expect(count).toBe(1);
    });
  });

  describe("trigger", function () {
    it("Only triggers on child class and not prototype", function () {
      var Observer = function () {

      }.inherit(oak.Evented, {
        triggered: false
      });

      var ChildObserver = function () {
      }.inherit(Observer);

      var obs = new Observer();
      var pObs = new ChildObserver();

      obs.on("completed", function () {
        obs.triggered = true;
      });
      pObs.on("completed", function () {
        pObs.triggered = true;
      });

      pObs.trigger("completed");

      expect(obs.triggered).toBe(false);
      expect(pObs.triggered).toBe(true);
    });
  });

});

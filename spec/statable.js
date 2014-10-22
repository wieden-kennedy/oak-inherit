"use strict";

describe("inherit", function () {

  var foo;

  var TestBed = inherit(oak.Statable, function () {

    this.started = false;

    this.states = {
      onFart: function () {
      },
      offStartup: function () {
      },
      onStartup: function () {
        this.started = true;
      }
    };

  });

  beforeEach(function () {
    foo = new TestBed();
  });

  it("Statable exists", function () {
    expect(oak.Statable).toBeDefined();
  });

  describe("inherit evented", function () {
    it("calls init", function () {
      expect(foo instanceof oak.Evented).toBe(true);
    });
  });

  describe("statable calls", function () {
    it("sets states", function () {
      foo.setState("startup");
      expect(foo.currentState).toBe("startup");
      foo.setState("fart");
    });

    it("calls states", function () {
      foo.setState("startup");
      expect(foo.started).toBe(true);
    });

  });

});

"use strict";

describe("inherit", function () {

  var Base, Bear, Horse, Mammal, PolarBear;
  beforeEach(function () {

    Base = function () {
    };

    Mammal = inherit(Base, function () {});

    oak.extend(Mammal.prototype, {
      warmBlooded: true
    });

    Horse = inherit(Mammal, function () {
      this._init = function () {};
    });

    oak.extend(Horse.prototype, {
      genus: "Equus"
    });

    Bear = function () {
      this._init = function (genus) {
        this.genus = genus || "";
      }
    }.inherit(Mammal);

    oak.extend(Bear.prototype, {
    });

    PolarBear = function () {
      this._init = function (genus) {
        PolarBear.prototype._init.call(this, genus);
      }
    }.inherit(Bear);

  });
  
  it("inherit exist", function () {
    expect(Function.inherit).toBeDefined();
    expect(inherit).toBeDefined();
  });

  it("child is instanceof parent", function () {
    var mammal = new Mammal();
    expect(mammal instanceof Base).toBe(true);
  });

  it("grandchild is instanceof grandparent", function () {
    var horse = new Horse();
    expect(horse instanceof Base).toBe(true);
  });
 
  it("inherit property", function () {
    var horse = new Horse();
    expect(horse.warmBlooded).toBe(true);
  });
 
  it("calls _init", function () {
    var horse = new Horse()
    expect(horse.genus).toBe("Equus");
  });

  it("passes params via _init", function () {
    var polarBear = new Bear("Ursus");
    expect(polarBear.genus).toBe("Ursus");
  });

  it("calls parent init", function () {
    var polarBear = new PolarBear("Ursus");
    expect(polarBear.genus).toBe("Ursus");
  });

  it("inherit down the chain", function () {
    var PapaPolarBear = function () {
      this._init = function (genus) {
        PapaPolarBear.prototype._init.call(this, genus);
      }
    }.inherit(PolarBear);

    var papaBear = new PapaPolarBear("Ursus");
    expect(papaBear.genus).toBe("Ursus");
    expect(papaBear.warmBlooded).toBe(true);
  });

  it("inherit with no parent", function () {
    var Foo = function () {
      this._init = function (genus) {
        this.name = "bar"
      }
    }.inherit();

    var foo = new Foo("Ursus");
    expect(foo.name).toBe("bar");
  });

  describe("defaults", function () {
    var Bar, Foo;
    beforeEach(function () {
      Foo = function () {

      }.inherit(oak.Base);

      Foo.prototype.defaults({
        boom: "bam",
        hello: "world"
      })

      Bar = function () {
      }.inherit(Foo);

      Bar.prototype.defaults({
        hello: "frank"
      });
    });

    it("inherits defaults", function () {
      expect(Foo.prototype._defaults).toBeDefined();
      expect(Foo.prototype._defaults.hello).toBe("world");

      expect(Foo.prototype._defaults.hello).toBe("world");
      expect(Foo.prototype._defaults.boom).toBe("bam");
      expect(Bar.prototype._defaults.hello).toBe("frank");
    });
    
    it("sets property from spec", function () {
      var bar = new Bar({
        hello: "Stephen"
      });
      expect(bar.hello).toBe("Stephen");
    });

  });

});

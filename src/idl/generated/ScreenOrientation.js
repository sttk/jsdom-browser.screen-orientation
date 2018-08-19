"use strict";

const conversions = require("webidl-conversions");
const utils = require("jsdom/lib/jsdom/living/generated/utils.js");

const convertOrientationLockType = require("./OrientationLockType.js").convert;
const impl = utils.implSymbol;
const EventTarget = require("jsdom/lib/jsdom/living/generated/EventTarget.js");

function ScreenOrientation() {
  throw new TypeError("Illegal constructor");
}

Object.setPrototypeOf(ScreenOrientation.prototype, EventTarget.interface.prototype);
Object.setPrototypeOf(ScreenOrientation, EventTarget.interface);

Object.defineProperty(ScreenOrientation, "prototype", {
  value: ScreenOrientation.prototype,
  writable: false,
  enumerable: false,
  configurable: false
});

ScreenOrientation.prototype.lock = function lock(orientation) {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  if (arguments.length < 1) {
    throw new TypeError(
      "Failed to execute 'lock' on 'ScreenOrientation': 1 argument required, but only " + arguments.length + " present."
    );
  }
  const args = [];
  {
    let curArg = arguments[0];
    curArg = convertOrientationLockType(curArg, {
      context: "Failed to execute 'lock' on 'ScreenOrientation': parameter 1"
    });
    args.push(curArg);
  }
  return utils.tryWrapperForImpl(this[impl].lock(...args));
};

ScreenOrientation.prototype.unlock = function unlock() {
  if (!this || !module.exports.is(this)) {
    throw new TypeError("Illegal invocation");
  }

  return this[impl].unlock();
};

Object.defineProperty(ScreenOrientation.prototype, "type", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return utils.tryWrapperForImpl(this[impl]["type"]);
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(ScreenOrientation.prototype, "angle", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return this[impl]["angle"];
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(ScreenOrientation.prototype, "onchange", {
  get() {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    return utils.tryWrapperForImpl(this[impl]["onchange"]);
  },

  set(V) {
    if (!this || !module.exports.is(this)) {
      throw new TypeError("Illegal invocation");
    }

    V = utils.tryImplForWrapper(V);

    this[impl]["onchange"] = V;
  },

  enumerable: true,
  configurable: true
});

Object.defineProperty(ScreenOrientation.prototype, Symbol.toStringTag, {
  value: "ScreenOrientation",
  writable: false,
  enumerable: false,
  configurable: true
});

const iface = {
  // When an interface-module that implements this interface as a mixin is loaded, it will append its own `.is()`
  // method into this array. It allows objects that directly implements *those* interfaces to be recognized as
  // implementing this mixin interface.
  _mixedIntoPredicates: [],
  is(obj) {
    if (obj) {
      if (utils.hasOwn(obj, impl) && obj[impl] instanceof Impl.implementation) {
        return true;
      }
      for (const isMixedInto of module.exports._mixedIntoPredicates) {
        if (isMixedInto(obj)) {
          return true;
        }
      }
    }
    return false;
  },
  isImpl(obj) {
    if (obj) {
      if (obj instanceof Impl.implementation) {
        return true;
      }

      const wrapper = utils.wrapperForImpl(obj);
      for (const isMixedInto of module.exports._mixedIntoPredicates) {
        if (isMixedInto(wrapper)) {
          return true;
        }
      }
    }
    return false;
  },
  convert(obj, { context = "The provided value" } = {}) {
    if (module.exports.is(obj)) {
      return utils.implForWrapper(obj);
    }
    throw new TypeError(`${context} is not of type 'ScreenOrientation'.`);
  },

  create(constructorArgs, privateData) {
    let obj = Object.create(ScreenOrientation.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return obj;
  },
  createImpl(constructorArgs, privateData) {
    let obj = Object.create(ScreenOrientation.prototype);
    obj = this.setup(obj, constructorArgs, privateData);
    return utils.implForWrapper(obj);
  },
  _internalSetup(obj) {
    EventTarget._internalSetup(obj);
  },
  setup(obj, constructorArgs, privateData) {
    if (!privateData) privateData = {};

    privateData.wrapper = obj;

    this._internalSetup(obj);
    Object.defineProperty(obj, impl, {
      value: new Impl.implementation(constructorArgs, privateData),
      writable: false,
      enumerable: false,
      configurable: true
    });

    obj[impl][utils.wrapperSymbol] = obj;
    if (Impl.init) {
      Impl.init(obj[impl], privateData);
    }
    return obj;
  },
  interface: ScreenOrientation,
  expose: {
    Window: { ScreenOrientation }
  }
}; // iface
module.exports = iface;

const Impl = require("../ScreenOrientation-impl.js");

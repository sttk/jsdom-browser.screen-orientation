"use strict";

const DOMException = require("domexception");
const EventTargetImpl = require("jsdom/lib/jsdom/living/events/EventTarget-impl").implementation;
const idlUtils = require("jsdom/lib/jsdom/living/generated/utils.js");

// https://www.w3.org/TR/2018/WD-screen-orientation-20180706/#screenorientation-interface

class ScreenOrientationImpl extends EventTargetImpl {
  constructor(args, privateData) {
    super();

    this._ownerDocument =
      idlUtils.implForWrapper(privateData.associatedDocument);
  }
}

ScreenOrientationImpl.prototype.type = "landscape-primary";
ScreenOrientationImpl.prototype.angle = 0;
ScreenOrientationImpl.prototype.lock = () => {
  return Promise.reject(new DOMException(
    "screen.orientation.lock() is not available on this device.",
    "NotSupportedError"
  ));
};
ScreenOrientationImpl.prototype.unlock = () => {};
ScreenOrientationImpl.prototype.onchange = () => {};

exports.implementation = ScreenOrientationImpl;

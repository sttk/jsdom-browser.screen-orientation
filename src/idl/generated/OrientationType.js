"use strict";

const enumerationValues = new Set([
  "portrait-primary",
  "portrait-secondary",
  "landscape-primary",
  "landscape-secondary"
]);
module.exports = {
  enumerationValues,
  convert(value, { context = "The provided value" } = {}) {
    const string = `${value}`;
    if (!enumerationValues.has(value)) {
      throw new TypeError(`${context} '${value}' is not a valid enumeration value for OrientationType`);
    }
    return string;
  }
};

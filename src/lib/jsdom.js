'use strict'

const idlUtils = require('jsdom/lib/jsdom/living/generated/utils')
const Event = require('jsdom/lib/jsdom/living/generated/Event')

function getWindow (node) {
  const nodeImpl = idlUtils.implForWrapper(node)
  return nodeImpl._ownerDocument._defaultView
}

// For passing web-platform-tests/wpt/screen-orientation/lock-basic.html
function getPromiseClass (node) {
  return (getWindow(node).Promise || Promise)
}

function dispatchChangeEvent (eventTarget) {
  eventTarget.dispatchEvent(Event.create(['change']))
}

module.exports = {
  getWindow,
  getPromiseClass,
  dispatchChangeEvent,
}

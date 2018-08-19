'use strict'

// https://html.spec.whatwg.org/multipage/origin.html
//   #sandboxed-orientation-lock-browsing-context-flag

const { getWindow } = require('./jsdom')

function isSandboxedOrientationLock (config) {
  const win = getWindow(config.$eventTarget)

  const frame = win._frameElement
  if (!frame || !frame.hasAttribute('sandbox')) {
    return false
  }

  const sandbox = ` ${frame.getAttribute('sandbox')} `
  return !(sandbox.includes(' allow-orientation-lock '))
}

module.exports = isSandboxedOrientationLock

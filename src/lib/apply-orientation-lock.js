'use strict'

const DOMException = require('domexception')
const { getPromiseClass } = require('./jsdom')
const isSandboxedOrientationLock = require('./sandboxed-orientation-lock')
const lockOrientation = require('./lock-orientation')
const handleOrientationChanges = require('./handle-orientation-changes')

// (4.2) #locking-the-screen-orientation
function promiseToApplyOrientationLock (config, lockType) {
  const promiseClass = getPromiseClass(config.$eventTarget)

  if (!config.isSupportedLocking) {
    return promiseClass.reject(new DOMException(
      config.message.lockNotSupportedError, 'NotSupportedError'))
  }

  if (config.pendingPromise) {
    config.pendingPromise.abort = true
    config.pendingPromise = null
  }

  if (config.isSecurityError || isSandboxedOrientationLock(config)) {
    return promiseClass.reject(new DOMException(
      config.message.lockSecurityError, 'SecurityError'))
  }

  const orientations = []

  switch (lockType) {
    case 'portrait-primary':
    case 'portrait-secondary':
    case 'landscape-primary':
    case 'landscape-secondary': {
      orientations.push(lockType)
      break
    }
    case 'landscape':
    case 'portrait': {
      config.defaultOrientation
        .filter(type => type.startsWith(lockType))
        .forEach(type => orientations.push(type))
      break
    }
    case 'natural': {
      // (3.2) #screenorientation-interface
      const type = Object.keys(config.relationsOfTypeAndAngle)
        .find(t => config.relationsOfTypeAndAngle[t] === 0)
      orientations.push(type)
      break
    }
    case 'any': {
      orientations.push('portrait-primary')
      orientations.push('portrait-secondary')
      orientations.push('landscape-primary')
      orientations.push('landscape-secondary')
      break
    }
    default: {
      // For passing web-platform-tests/wpt/screen-orientation/
      //   lock-bad-argument.html
      return promiseClass.reject(new TypeError(
        config.message.lockInvalidLockType))
    }
  }

  const newPromise = new promiseClass((resolve, reject) => {
    setImmediate(() => {
      if (newPromise.abort) {
        reject(new DOMException(config.message.lockAbortError, 'AbortError'))
        return
      }

      if (lockOrientation(config, orientations)) {
        handleOrientationChanges(config, true)
      }
      resolve()
      config.pendingPromise = null
    })
  })

  config.pendingPromise = newPromise
  return newPromise
}

module.exports = promiseToApplyOrientationLock


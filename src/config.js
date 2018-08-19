'use strict'

// https://www.w3.org/TR/screen-orientation/
// https://www.w3.org/TR/2018/WD-screen-orientation-20180706/

const ConfigBase = require('class-config-base')
const { readonly, writable, method } = ConfigBase
const { ScreenConfig } = require('jsdom-browser.screen')
const { calcScreenAngle } = ScreenConfig
const { EventEmitter } = require('events')
const defaultValue = require('default-val')

const readScreenOrientation = require('./lib/read-screen-orientation')
const updateOrientationInformation = require('./lib/update-orientation-info')
const promiseToApplyOrientationLock = require('./lib/apply-orientation-lock')
const lockOrientation = require('./lib/lock-orientation')
const handleOrientationChanges = require('./lib/handle-orientation-changes')
const handleDocumentVisible = require('./lib/handle-document-visible')

// (3.2) #screenorientation-interface
// (3.3) #orientationtype-enum
const defaultConfig = require('./default')

class ScreenOrientationConfig extends ConfigBase {

  constructor (screenConfig, initConfig) {
    super(initConfig, defaultConfig)

    // (4) #concept
    this.pendingPromise = null

    Object.defineProperties(this, {
      $screenConfig: { value: screenConfig },
      $eventEmitter: { value: new EventEmitter() },
    })
  }

  on (eventName, listener) {
    this.$eventEmitter.on(eventName, listener)
  }

  configure (orientation, descriptors) {
    super.configure(orientation, descriptors)

    Object.defineProperties(this, {
      $eventTarget: { value: orientation },
    })

    // (4.4) #handling-screen-orientation-changes
    handleOrientationChanges.setup(this)

    // (4.1) #reading-the-screen-orientation
    readScreenOrientation(this)
  }

  // (3.2) #screenorientation-interface
  defineInterfaces (config) {
    return {
      lock: method(
        lockType => promiseToApplyOrientationLock(config, lockType)
      ),

      unlock: method(
        () => {
          if (lockOrientation(config, config.defaultOrientation)) {
            handleOrientationChanges(this, true)
          }
        }
      ),

      type: readonly({
        get: () => config.currentType,
      }),

      angle: readonly({
        get: () => config.currentAngle,
      }),

      onchange: writable({
        get: () => config.onchange,
        set: fn => { config.onchange = fn },
      }),
    }
  }

  defineMorePrivates (priv) {
    priv.currentType = ''
    priv.currentAngle = 0
    priv.orientations = priv.defaultOrientation
    priv.onchange = noop
  }

  defineAccessors (priv, config) {
    return {
      // (3.2) #screenorientation-interface
      currentAngle: writable({
        get: () => priv.currentAngle,
        set: angle => { priv.currentAngle = calcScreenAngle(angle) },
      }),

      // (3.3) #orientationtype-enum
      currentType: writable({
        get: () => priv.currentType,
        set: type => {
          if (Object.keys(config.relationsOfTypeAndAngle).includes(type)) {
            priv.currentType = type
          }
        },
      }),

      // (3.2) #screenorientation-interface
      onchange: writable({
        get: () => (priv.onchange === noop) ? null : priv.onchange,
        set: fn => {
          if (priv.onchange !== noop) {
            config.$eventTarget.removeEventListener('change', priv.onchange)
          }
          priv.onchange = defaultValue(fn, noop)
          if (priv.onchange !== noop) {
            config.$eventTarget.addEventListener('change', priv.onchange)
          }
        },
      }),
    }
  }

  update () {
    updateOrientationInformation(this)
  }

  // (4.4) #handling-screen-orientation-changes
  handleRotation () {
    handleOrientationChanges(this)
  }

  // (4.4) #handling-screen-orientation-changes
  handleVisible () {
    handleDocumentVisible(this)
  }
}

/* istanbul ignore next */
function noop () {}

module.exports = ScreenOrientationConfig

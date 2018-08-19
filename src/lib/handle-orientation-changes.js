'use strict'

const updateOrientationInformation = require('./update-orientation-info')
const { dispatchChangeEvent, getWindow } = require('./jsdom')

// (4.4) #handling-screen-orientation-changes
function handleScreenOrientationChanges (config, byLock) {
  const { $screenConfig } = config
  $screenConfig.orientationConfigArray.forEach(cfg => {
    if (config === cfg) {
      if (updateOrientationInformation(cfg) || byLock) {
        fireChangeEvent(cfg)
      }
      return
    }

    if (updateOrientationInformation(cfg)) {
      fireChangeEvent(cfg)
    }
  })
}

handleScreenOrientationChanges.setup = config => {
  const { $screenConfig } = config
  if (Array.isArray($screenConfig.orientationConfigArray)) {
    const cfg0 = $screenConfig.orientationConfigArray[0]
    if (!isSameTopDocument(cfg0.$eventTarget, config.$eventTarget)) {
      throw Error('Don\'t specified a same ScreenConfig object to ' +
        'ScreenOrientationConfig objects which associated with a different ' +
        'top document')
    }
    $screenConfig.orientationConfigArray.push(config)
    return
  }

  Object.defineProperty($screenConfig, 'orientationConfigArray', {
    value: [config]
  })
}

function fireChangeEvent (config) {
  setImmediate(() => {
    config.$eventEmitter.emit('change', config)
    dispatchChangeEvent(config.$eventTarget)
  })
}

function isSameTopDocument (node1, node2) {
  const topDoc1 = getWindow(node1)._top._document
  const topDoc2 = getWindow(node2)._top._document
  return topDoc1 === topDoc2
}

module.exports = handleScreenOrientationChanges

'use strict'

const updateOrientationInformation = require('./update-orientation-info')
const { dispatchChangeEvent, getWindow } = require('./jsdom')

// (4.4) #handling-screen-orientation-changes
function handleScreenOrientationChanges (config, byLock) {
  const topWin = getWindow(config.$eventTarget)._top

  listDescendantWindows(topWin, []).forEach(win => {
    const cfg = config.$configManager.getConfig(win.screen.orientation)
    if (cfg === config) {
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

function listDescendantWindows (win, array) {
  array.push(win)
  for (let i = 0; i < win._length; i++) {
    listDescendantWindows(win[i], array)
  }
  return array
}

function fireChangeEvent (config) {
  setImmediate(() => {
    config.$eventEmitter.emit('change', config)
    dispatchChangeEvent(config.$eventTarget)
  })
}

module.exports = handleScreenOrientationChanges

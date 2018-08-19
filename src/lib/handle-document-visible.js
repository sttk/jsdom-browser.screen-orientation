'use strict'

const updateOrientationInformation = require('./update-orientation-info')
const { dispatchChangeEvent } = require('./jsdom')

// (4.4) #handling-screen-orientation-changes
function handleDocumentVisible (config) {
  if (updateOrientationInformation(config)) {
    setImmediate(() => {
      config.$eventEmitter.emit('change', config)
      dispatchChangeEvent(config.$eventTarget)
    })
  }
}

module.exports = handleDocumentVisible

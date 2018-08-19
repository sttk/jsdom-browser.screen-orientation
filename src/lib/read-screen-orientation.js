'use strict'

const { getWindow } = require('./jsdom')
const updateOrientationInformation = require('./update-orientation-info')

// (4.1) #reading-the-screen-orientation
function readScreenOrientation (config) {
  const win = getWindow(config.$eventTarget)
  if (win === win._top) {
    coordinateOrientation(config)
  }

  updateOrientationInformation(config)
}

function coordinateOrientation (config) {
  const { $screenConfig } = config
  const { width, height } = $screenConfig
  const heading = (width > height) ? 'landscape-' : 'portrait-'
  const relations = config.relationsOfTypeAndAngle
  const types = Object.keys(relations)

  let type = types.find(t => (relations[t] === $screenConfig.baseAngle))
  if (!type.startsWith(heading)) {
    type = types.find(t => t.startsWith(heading))
    $screenConfig.baseAngle = relations[type]
  }

  const proto = Object.getPrototypeOf($screenConfig)
  const desc = Object.getOwnPropertyDescriptor(proto, 'screenAngle')
  desc.get = () => config.currentAngle
  Object.defineProperty($screenConfig, 'screenAngle', desc)
}

module.exports = readScreenOrientation

'use strict'

const { ScreenConfig } = require('jsdom-browser.screen')
const { calcScreenAngle } = ScreenConfig
const { getWindow } = require('./jsdom')

// (4.1) #reading-the-screen-orientation
function updateOrientationInformation (config) {
  const priv = config.$private
  const oldType = config.currentType

  if (config.orientations.length === 1) {
    priv.currentType = config.orientations[0]
    priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
    return (config.currentType !== oldType)
  }

  const angle = correctCurrentAngle(config)
  const type = Object.keys(config.relationsOfTypeAndAngle)
    .find(t => config.relationsOfTypeAndAngle[t] === angle)

  if (config.orientations.includes(type)) {
    priv.currentType = type
    priv.currentAngle = angle
    return (config.currentType !== oldType)
  }

  const heading = type.startsWith('portrait-') ? 'portrait-' : 'landscape-'
  const similarType = config.orientations.find(t => t.startsWith(heading))
  if (similarType) {
    priv.currentType = similarType
    priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
    return (config.currentType !== oldType)
  }

  priv.currentType = config.orientations[0]
  priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
  return (config.currentType !== oldType)
}

function correctCurrentAngle (config) {
  const win = getWindow(config.$eventTarget)
  const screenConfig = config.$configManager.getConfig(win.screen)
  if (!screenConfig) {
    return config.currentAngle
  }

  if (win === win._top) {
    return calcScreenAngle(screenConfig.deviceAngle)
  }
  return screenConfig.screenAngle
}

module.exports = updateOrientationInformation

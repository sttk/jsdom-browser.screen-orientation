'use strict'

// (4.2) #locking-the-screen-orientation
function lockOrientation (config, orientations) {
  const priv = config.$private
  const oldType = config.currentType

  priv.orientations = orientations

  if (!config.isActiveOrientationLock) {
    return false
  }

  if (config.orientations.includes(oldType)) {
    priv.currentAngle = config.relationsOfTypeAndAngle[oldType]
    return false
  }

  if (config.orientations.length === 1) {
    priv.currentType = config.orientations[0]
    priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
    return true
  }

  const heading = oldType.startsWith('portrait-') ? 'portrait-' : 'landscape-'
  const similarType = config.orientations.find(t => t.startsWith(heading))
  if (similarType) {
    priv.currentType = similarType
    priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
    return true
  }

  priv.currentType = config.orientations[0]
  priv.currentAngle = config.relationsOfTypeAndAngle[priv.currentType]
  return true
}

module.exports = lockOrientation

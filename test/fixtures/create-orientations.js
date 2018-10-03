'use strict'

const { JSDOM } = require('jsdom')
const { Screen, ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../../src')
const Config = require('class-config-base')
const $configManager = new Config.Manager()

module.exports = function (log, id = '', initOrientationConfig, win) {
  if (id != '') {
    id += ' '
  }

  if (!initOrientationConfig) {
    initOrientationConfig = {}
  }
  if (!initOrientationConfig.$configManager) {
    initOrientationConfig.$configManager = $configManager
  }

  if (!win) {
    win = new JSDOM().window
  }

  let initScreenConfig
  if (win === win._top) {
    initScreenConfig = { $configManager }
  } else {
    initScreenConfig = $configManager.getConfig(win._top.screen)
  }

  const screenConfig = new ScreenConfig(initScreenConfig, {
    sharePrivate: (win !== win._top),
  })
  const screen = Screen.create([], {
    associatedDocument: win.document
  })
  screenConfig.configure(screen)
  Object.defineProperty(win, 'screen', {
    enumerable: true,
    value: screen,
  })

  const orientationConfig = new ScreenOrientationConfig(initOrientationConfig)
  const orientation = ScreenOrientation.create([], {
    associatedDocument: win.document
  })
  orientationConfig.configure(orientation)
  Object.defineProperty(screen, 'orientation', {
    enumerable: true,
    value: orientation,
  })

  orientation.addEventListener('change', () => {
    log.push(`${id}Orientation was changed: ${orientation.type}`);
  })
  orientation.onchange = () => {
    log.push(`${id}Orientation was changed (onchange): ${orientation.type}`)
  }
  orientationConfig.on('change', () => {
    log.push(`${id}Orientation was changed (config): ` +
      `${orientationConfig.currentType}`)
  })

  return { orientation, orientationConfig, screen, screenConfig }
}


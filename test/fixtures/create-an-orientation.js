'use strict'

const { JSDOM } = require('jsdom')
const { Screen, ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../../src')

const Config = require('class-config-base')
const $configManager = new Config.Manager()

module.exports = function (initScreenConfig, initOrientationConfig) {
  const window = new JSDOM().window

  if (!initScreenConfig) {
    initScreenConfig = {}
  }
  if (!initScreenConfig.$configManager) {
    initScreenConfig.$configManager = $configManager
  }

  const screenConfig = new ScreenConfig(initScreenConfig)
  const screen = Screen.create([], {
    associatedDocument: window.document,
  })
  screenConfig.configure(screen)
  Object.defineProperty(window, 'screen', {
    enumerable: true,
    value: screen,
  })

  if (!initOrientationConfig) {
    initOrientationConfig = {}
  }
  if (!initOrientationConfig.$configManager) {
    initOrientationConfig.$configManager = $configManager
  }

  const orientationConfig = new ScreenOrientationConfig(initOrientationConfig)
  const orientation = ScreenOrientation.create([], {
    associatedDocument: window.document,
  })
  orientationConfig.configure(orientation)
  Object.defineProperty(screen, 'orientation', {
    enumerable: true,
    value: orientation,
  })

  return { orientation, orientationConfig, screen, screenConfig }
}


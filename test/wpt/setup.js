'use strict'

const { ScreenConfig, Screen } = require('jsdom-browser.screen')
const { ScreenOrientationConfig, ScreenOrientation } = require('../../src')
const Config = require('class-config-base')

const $configManager = new Config.Manager()

const npw = require('jsdom/lib/jsdom/living/named-properties-window')
const origInitializeWindow = npw.initializeWindow
npw.initializeWindow = (window, windowProxy) => {
  origInitializeWindow(window, windowProxy)

  process.nextTick(() => {
    setupScreenAndOrientation(windowProxy)
  })
}

function setupScreenAndOrientation (win) {
  let screenConfig
  if (win === win._top) {
    screenConfig = new ScreenConfig({ $configManager })
  } else {
    const initConfig = $configManager.getConfig(win._top.screen)
    screenConfig = new ScreenConfig(initConfig, { sharePrivate: true })
  }

  const screen = Screen.create([], {
    associatedDocument: win.document,
  })
  screenConfig.configure(screen)
  Object.defineProperty(win, 'screen', {
    enumerable: true,
    value: screen,
  })

  let orientationConfig
  if (win === win._top) {
    orientationConfig = new ScreenOrientationConfig({ $configManager })
  } else {
    const initConfig = $configManager.getConfig(win._top.screen.orientation)
    orientationConfig = new ScreenOrientationConfig(initConfig)
  }
  const orientation = ScreenOrientation.create([], {
    associatedDocument: win.document,
  })
  orientationConfig.configure(orientation)
  Object.defineProperty(screen, 'orientation', {
    enumerable: true,
    value: orientation,
  })
}

module.exports = () => {}

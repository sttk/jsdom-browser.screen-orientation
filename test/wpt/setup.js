'use strict'

const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientationConfig, ScreenOrientation } = require('../../src')

const screenConfigMap = new WeakMap()

const npw = require('jsdom/lib/jsdom/living/named-properties-window')
const origInitializeWindow = npw.initializeWindow
npw.initializeWindow = (window, windowProxy) => {
  origInitializeWindow(window, windowProxy)

  process.nextTick(() => {
    setupScreenAndOrientation(windowProxy)
  })
}

function setupScreenAndOrientation (win) {
  let screenConfig = screenConfigMap.get(win._top)
  if (!screenConfig) {
    screenConfig = new ScreenConfig()
    screenConfigMap.set(win._top, screenConfig)
  }
  screenConfig.configure(win.screen)

  const config = new ScreenOrientationConfig(screenConfig)
  const screenOrientation = ScreenOrientation.create([], {
    associatedDocument: win.document
  })
  config.configure(screenOrientation)
  win.screen.orientation = screenOrientation
}

module.exports = () => {}

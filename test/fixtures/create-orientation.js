'use strict'

const { JSDOM } = require('jsdom')

const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../../src')

const screenConfigMap = new WeakMap()

module.exports = function (log, id = '', initConfig, win) {
  if (id !== '') {
    id += ' '
  }

  if (!win) {
    win = new JSDOM().window
  }

  let screenConfig = screenConfigMap.get(win._top)
  if (!screenConfig) {
    screenConfig = new ScreenConfig()
    screenConfigMap.set(win._top, screenConfig)
  }
  screenConfig.configure(win.screen)

  const config = new ScreenOrientationConfig(screenConfig, initConfig)
  const orientation = ScreenOrientation.create([], {
    associatedDocument: win.document
  })
  config.configure(orientation)

  orientation.addEventListener('change', () => {
    log.push(`${id}Orientation was changed: ${orientation.type}`)
  })
  orientation.onchange = () => {
    log.push(`${id}Orientation was changed (onchange): ${orientation.type}`)
  }
  config.on('change', () => {
    log.push(`${id}Orientation was changed (config): ${config.currentType}`)
  })

  return { orientation, config, screenConfig }
}

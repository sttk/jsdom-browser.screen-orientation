'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')

const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../src')

const initScreenConfig = { width: 1024, height: 768 }
const initConfig = {
  relationsOfTypeAndAngle: {
    'landscape-primary': 0,
    'portrait-primary': 90,
    'landscape-secondary': 180,
    'portrait-secondary': 270,
  },
}

describe('Configure a orientation by a config object', () => {

  it('Should change .currentAngle', () => {
    const screenConfig = new ScreenConfig(initScreenConfig)
    const window = new JSDOM().window
    const screen = window.screen
    screenConfig.configure(screen)

    const config = new ScreenOrientationConfig(screenConfig, initConfig)
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    config.configure(orientation)

    expect(config.currentType).to.equals('landscape-primary')
    expect(config.currentAngle).to.equals(0)
    expect(screenConfig.deviceAngle).to.equals(0)
    expect(screenConfig.screenAngle).to.equals(0)

    config.currentAngle = 80
    expect(config.currentType).to.equals('landscape-primary')
    expect(config.currentAngle).to.equals(90)
    expect(screenConfig.deviceAngle).to.equals(0)
    expect(screenConfig.screenAngle).to.equals(90)
  })

  it('Should change .currentType', () => {
    const screenConfig = new ScreenConfig(initScreenConfig)
    const window = new JSDOM().window
    const screen = window.screen
    screenConfig.configure(screen)

    const config = new ScreenOrientationConfig(screenConfig, initConfig)
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    config.configure(orientation)

    expect(config.currentType).to.equals('landscape-primary')
    expect(config.currentAngle).to.equals(0)
    expect(screenConfig.deviceAngle).to.equals(0)
    expect(screenConfig.screenAngle).to.equals(0)

    config.currentType = 'portrait-primary'
    expect(config.currentType).to.equals('portrait-primary')
    expect(config.currentAngle).to.equals(0)
    expect(screenConfig.deviceAngle).to.equals(0)
    expect(screenConfig.screenAngle).to.equals(0)

    config.currentType = 'bad-orientation-type'
    expect(config.currentType).to.equals('portrait-primary')
    expect(config.currentAngle).to.equals(0)
    expect(screenConfig.deviceAngle).to.equals(0)
    expect(screenConfig.screenAngle).to.equals(0)
  })

  it('Should change .onchange', () => {
    const screenConfig = new ScreenConfig(initScreenConfig)
    const window = new JSDOM().window
    const screen = window.screen
    screenConfig.configure(screen)

    const config = new ScreenOrientationConfig(screenConfig, initConfig)
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    config.configure(orientation)

    expect(orientation.onchange).to.equal(null)
    expect(config.onchange).to.equal(null)

    function fn () {}
    orientation.onchange = fn
    expect(orientation.onchange).to.equal(fn)
    expect(config.onchange).to.equal(fn)

    orientation.onchange = 123
    expect(orientation.onchange).to.equal(null)
    expect(config.onchange).to.equal(null)

    function fn2 () {}
    config.onchange = fn2
    expect(orientation.onchange).to.equal(fn2)
    expect(config.onchange).to.equal(fn2)

    config.onchange = 'abc'
    expect(orientation.onchange).to.equal(null)
    expect(config.onchange).to.equal(null)
  })

  it('Should update orientation by screenConfig.deviceAngle', () => {
    const window = new JSDOM().window
    const screenConfig = new ScreenConfig()
    const orientationConfig = new ScreenOrientationConfig(screenConfig)
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    orientationConfig.configure(orientation)

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = 80
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(screenConfig.deviceAngle).to.equal(80)
    expect(screenConfig.screenAngle).to.equal(90)

    screenConfig.deviceAngle = 200
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-secondary')
    expect(orientation.angle).to.equal(180)
    expect(orientationConfig.currentType).to.equal('landscape-secondary')
    expect(orientationConfig.currentAngle).to.equal(180)
    expect(screenConfig.deviceAngle).to.equal(200)
    expect(screenConfig.screenAngle).to.equal(180)

    screenConfig.deviceAngle = 260
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('portrait-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(260)
    expect(screenConfig.screenAngle).to.equal(270)
  })

  it('Should update locked orientation by screenConfig.deviceAngle', () => {
    const window = new JSDOM().window
    const screenConfig = new ScreenConfig(initScreenConfig)
    const config = new ScreenOrientationConfig(screenConfig, initConfig)
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    config.configure(orientation)

    config.orientations = [
      'landscape-primary',
      'portrait-secondary',
    ]

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(config.currentType).to.equal('landscape-primary')
    expect(config.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = 80
    config.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(config.currentType).to.equal('portrait-secondary')
    expect(config.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(80)
    expect(screenConfig.screenAngle).to.equal(270)

    screenConfig.deviceAngle = 200
    config.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(config.currentType).to.equal('landscape-primary')
    expect(config.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(200)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = 260
    config.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(config.currentType).to.equal('portrait-secondary')
    expect(config.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(260)
    expect(screenConfig.screenAngle).to.equal(270)
  })
})

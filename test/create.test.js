'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')

const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../src')

describe('Creates a ScreenOrientation instance', () => {
  describe('screen width > screen height', () => {
    it('landscape-primary, 0 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 1024,
        height: 768,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(0)
      expect(screenConfig.screenAngle).to.equal(0)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('landscape-primary')
      expect(config.currentAngle).to.equal(0)
    })

    it('portrait-primary, 90 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 1024,
        height: 768,
        deviceAngle: 90,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(90)
      expect(screenConfig.screenAngle).to.equal(90)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('portrait-primary')
      expect(config.currentAngle).to.equal(90)
    })

    it('landscape-secondary, 180 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 1024,
        height: 768,
        deviceAngle: 180,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(180)
      expect(screenConfig.screenAngle).to.equal(180)
      expect(screenConfig.baseAngle).to.equal(180)
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(180)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('landscape-secondary')
      expect(config.currentAngle).to.equal(180)
    })

    it('portrait-secondary, 270 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 1024,
        height: 768,
        deviceAngle: 270,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(270)
      expect(screenConfig.screenAngle).to.equal(270)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('portrait-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('portrait-secondary')
      expect(config.currentAngle).to.equal(270)
    })
  })

  describe('screen width < screen height', () => {
    it('landscape-primary, 0 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 768,
        height: 1028,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(0)
      expect(screenConfig.screenAngle).to.equal(0)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('landscape-primary')
      expect(config.currentAngle).to.equal(0)
    })

    it('portrait-primary, 90 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 768,
        height: 1028,
        deviceAngle: 90,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(90)
      expect(screenConfig.screenAngle).to.equal(90)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('portrait-primary')
      expect(config.currentAngle).to.equal(90)
    })

    it('landscape-secondary, 180 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 768,
        height: 1028,
        deviceAngle: 180,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(180)
      expect(screenConfig.screenAngle).to.equal(180)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(180)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('landscape-secondary')
      expect(config.currentAngle).to.equal(180)
    })

    it('portrait-secondary, 270 deg', () => {
      const screenConfig = new ScreenConfig({
        width: 768,
        height: 1028,
        deviceAngle: 270,
      })
      const config = new ScreenOrientationConfig(screenConfig, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })
      const window = new JSDOM().window
      const orientation = ScreenOrientation.create([], {
        associatedDocument: window.document
      })
      config.configure(orientation)

      expect(screenConfig.deviceAngle).to.equal(270)
      expect(screenConfig.screenAngle).to.equal(270)
      expect(screenConfig.baseAngle).to.equal(270)
      expect(orientation.type).to.equal('portrait-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientation.onchange).to.equal(null)
      expect(config.currentType).to.equal('portrait-secondary')
      expect(config.currentAngle).to.equal(270)
    })
  })
})

'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')
const { ScreenOrientation, ScreenOrientationConfig } = require('../src')

const create = require('./fixtures/create-an-orientation')

describe('Create a ScreenOrientation instance', () => {
  it('Create with no argument', () => {
    const window = new JSDOM().window
    const orientationConfig = new ScreenOrientationConfig()
    const orientation = ScreenOrientation.create([], {
      associatedDocument: window.document
    })
    orientationConfig.configure(orientation)

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientation.onchange).to.equal(null)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
  })

  it('Create with a Screen object', () => {
    const {
      orientation,
      orientationConfig,
      screenConfig,
    } = create({}, {})

    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)
    expect(screenConfig.baseAngle).to.equal(0)
    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientation.onchange).to.equal(null)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
  })

  describe('screen width > screen height', () => {
    it('landscape-primary, 0 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 1024,
        height: 768,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(0)
      expect(screenConfig.screenAngle).to.equal(0)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
    })

    it('portrait-primary, 90 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 1024,
        height: 768,
        deviceAngle: -90,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-90)
      expect(screenConfig.screenAngle).to.equal(90)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
    })

    it('landscape-secondary, 180 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 1024,
        height: 768,
        deviceAngle: -180,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-180)
      expect(screenConfig.screenAngle).to.equal(180)
      expect(screenConfig.baseAngle).to.equal(180)
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(180)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('landscape-secondary')
      expect(orientationConfig.currentAngle).to.equal(180)
    })

    it('portrait-secondary, 270 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 1024,
        height: 768,
        deviceAngle: -270,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-270)
      expect(screenConfig.screenAngle).to.equal(270)
      expect(screenConfig.baseAngle).to.equal(0)
      expect(orientation.type).to.equal('portrait-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('portrait-secondary')
      expect(orientationConfig.currentAngle).to.equal(270)
    })
  })

  describe('screen width < screen height', () => {
    it('landscape-primary, 0 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 768,
        height: 1028,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(0)
      expect(screenConfig.screenAngle).to.equal(0)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
    })

    it('portrait-primary, 90 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 768,
        height: 1028,
        deviceAngle: -90,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-90)
      expect(screenConfig.screenAngle).to.equal(90)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
    })

    it('landscape-secondary, 180 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 768,
        height: 1028,
        deviceAngle: -180,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-180)
      expect(screenConfig.screenAngle).to.equal(180)
      expect(screenConfig.baseAngle).to.equal(90)
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(180)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('landscape-secondary')
      expect(orientationConfig.currentAngle).to.equal(180)
    })

    it('portrait-secondary, 270 deg', () => {
      const {
        orientation,
        orientationConfig,
        screenConfig,
      } = create({
        width: 768,
        height: 1028,
        deviceAngle: -270,
      }, {
        relationsOfTypeAndAngle: {
          'landscape-primary': 0,
          'portrait-primary': 90,
          'landscape-secondary': 180,
          'portrait-secondary': 270,
        },
      })

      expect(screenConfig.deviceAngle).to.equal(-270)
      expect(screenConfig.screenAngle).to.equal(270)
      expect(screenConfig.baseAngle).to.equal(270)
      expect(orientation.type).to.equal('portrait-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientation.onchange).to.equal(null)
      expect(orientationConfig.currentType).to.equal('portrait-secondary')
      expect(orientationConfig.currentAngle).to.equal(270)
    })
  })
})


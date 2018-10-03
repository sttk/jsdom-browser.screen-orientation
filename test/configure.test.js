'use strict'

const { expect } = require('chai')
const create = require('./fixtures/create-an-orientation')

describe('Configure a orientation by a config object', () => {

  it('Should change .currentAngle', () => {
    const {
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

    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    orientationConfig.currentAngle = 80
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(90)
  })

  it('Should change .currentType', () => {
    const {
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

    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    orientationConfig.currentType = 'portrait-primary'
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    orientationConfig.currentType = 'bad-orientation-type'
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)
  })

  it('Should change .onchange', () => {
    const {
      orientationConfig,
      orientation,
    } = create({}, {})

    expect(orientation.onchange).to.equal(null)
    expect(orientationConfig.onchange).to.equal(null)

    function fn () {}
    orientation.onchange = fn
    expect(orientation.onchange).to.equal(fn)
    expect(orientationConfig.onchange).to.equal(fn)

    orientation.onchange = 123
    expect(orientation.onchange).to.equal(null)
    expect(orientationConfig.onchange).to.equal(null)

    function fn2 () {}
    orientation.onchange = fn2
    expect(orientation.onchange).to.equal(fn2)
    expect(orientationConfig.onchange).to.equal(fn2)

    orientation.onchange = 'abc'
    expect(orientation.onchange).to.equal(null)
    expect(orientationConfig.onchange).to.equal(null)
  })

  it('Should update orientation by screenConfig.deviceAngle', () => {
    const {
      orientationConfig,
      orientation,
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

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = -80
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(screenConfig.deviceAngle).to.equal(-80)
    expect(screenConfig.screenAngle).to.equal(90)

    screenConfig.deviceAngle = -200
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-secondary')
    expect(orientation.angle).to.equal(180)
    expect(orientationConfig.currentType).to.equal('landscape-secondary')
    expect(orientationConfig.currentAngle).to.equal(180)
    expect(screenConfig.deviceAngle).to.equal(-200)
    expect(screenConfig.screenAngle).to.equal(180)

    screenConfig.deviceAngle = -260
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('portrait-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(-260)
    expect(screenConfig.screenAngle).to.equal(270)
  })

  it('Should update locked orientation by screenConfig.deviceAngle', () => {
    const {
      orientationConfig,
      orientation,
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

    orientationConfig.orientations = [
      'landscape-primary',
      'portrait-secondary',
    ]

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(0)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = -80
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('portrait-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(-80)
    expect(screenConfig.screenAngle).to.equal(270)

    screenConfig.deviceAngle = -200
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(0)
    expect(screenConfig.deviceAngle).to.equal(-200)
    expect(screenConfig.screenAngle).to.equal(0)

    screenConfig.deviceAngle = -260
    orientationConfig.update()

    expect(orientation.type).to.equal('portrait-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('portrait-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)
    expect(screenConfig.deviceAngle).to.equal(-260)
    expect(screenConfig.screenAngle).to.equal(270)
  })
})

'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')

const create = require('./fixtures/create-orientations')

const initConfig = {
  relationsOfTypeAndAngle: {
    'portrait-primary': 0,
    'landscape-primary': 90,
    'portrait-secondary': 180,
    'landscape-secondary': 270,
  },
}

describe('Rotate', () => {
  it('Should change descendand orientations and fire change event', done => {
    const log = []

    const win1 = new JSDOM().window
    const win2 = new JSDOM().window
    win2._top = win1
    win1._length = 1
    win1[0] = win2

    const ret1 = create(log, '1', initConfig, win1)
    const orientation1 = ret1.orientation
    const orientationConfig1 = ret1.orientationConfig
    const screenConfig1 = ret1.screenConfig

    const ret2 = create(log, '2', initConfig, win2)
    const orientation2 = ret2.orientation
    const orientationConfig2 = ret2.orientationConfig
    const screenConfig2 = ret2.screenConfig

    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    screenConfig1.deviceAngle = -80
    expect(screenConfig2.deviceAngle).to.equal(-80)
    orientationConfig1.handleRotation()

    let counter = 0
    orientation2.addEventListener('change', () => {
      counter++
      switch (counter) {
        case 1: {
          expect(orientation1.type).to.equal('landscape-primary')
          expect(orientation1.angle).to.equal(90)
          expect(orientation2.type).to.equal('landscape-primary')
          expect(orientation2.angle).to.equal(90)
          expect(log).to.deep.equal([
            '1 Orientation was changed (config): landscape-primary',
            '1 Orientation was changed: landscape-primary',
            '1 Orientation was changed (onchange): landscape-primary',
            '2 Orientation was changed (config): landscape-primary',
            '2 Orientation was changed: landscape-primary',
            '2 Orientation was changed (onchange): landscape-primary',
          ])

          screenConfig2.deviceAngle = -280
          orientationConfig2.handleRotation()
          break
        }
        case 2: {
          expect(orientation1.type).to.equal('landscape-secondary')
          expect(orientation1.angle).to.equal(270)
          expect(orientation2.type).to.equal('landscape-secondary')
          expect(orientation2.angle).to.equal(270)
          expect(log).to.deep.equal([
            '1 Orientation was changed (config): landscape-primary',
            '1 Orientation was changed: landscape-primary',
            '1 Orientation was changed (onchange): landscape-primary',
            '2 Orientation was changed (config): landscape-primary',
            '2 Orientation was changed: landscape-primary',
            '2 Orientation was changed (onchange): landscape-primary',
            '1 Orientation was changed (config): landscape-secondary',
            '1 Orientation was changed: landscape-secondary',
            '1 Orientation was changed (onchange): landscape-secondary',
            '2 Orientation was changed (config): landscape-secondary',
            '2 Orientation was changed: landscape-secondary',
            '2 Orientation was changed (onchange): landscape-secondary',
          ])
          done()
          break
        }
      }
    })
  })

  it('Should not fire if orientation is not changed', done => {
    const log = []

    const win1 = new JSDOM().window
    const win2 = new JSDOM().window
    win2._top = win1
    win1._length = 1
    win1[0] = win2

    const ret1 = create(log, '1', initConfig, win1)
    const orientation1 = ret1.orientation
    const orientationConfig1 = ret1.orientationConfig
    const screenConfig1 = ret1.screenConfig

    const ret2 = create(log, '2', initConfig, win2)
    const orientation2 = ret2.orientation
    const orientationConfig2 = ret2.orientationConfig
    const screenConfig2 = ret2.screenConfig

    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    orientation2.addEventListener('change', () => {
      expect.fail()
    })
    orientation1.addEventListener('change', () => {
      expect.fail()
    })

    screenConfig1.deviceAngle = -350
    orientationConfig1.handleRotation()
    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    screenConfig2.deviceAngle = -10
    orientationConfig2.handleRotation()
    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])
    done()
  })
})

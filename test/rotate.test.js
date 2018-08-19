'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')

const create = require('./fixtures/create-orientation')

const { ScreenConfig } = require('jsdom-browser.screen')
const { ScreenOrientation, ScreenOrientationConfig } = require('../src')

const initConfig = {
  relationsOfTypeAndAngle: {
    'portrait-primary': 0,
    'landscape-primary': 90,
    'portrait-secondary': 180,
    'landscape-secondary': 270,
  },
}

describe('Rotate', () => {
  it('Should change descendand orientations and fire change event',
  done => {
    const log = []

    const win1 = new JSDOM().window
    const win2 = new JSDOM().window
    win2._top = win1

    const ret1 = create(log, '1', initConfig, win1)
    const orientation1 = ret1.orientation
    const config1 = ret1.config
    const screenConfig1 = ret1.screenConfig

    const ret2 = create(log, '2', initConfig, win2)
    const orientation2 = ret2.orientation
    const config2 = ret2.config
    const screenConfig2 = ret2.screenConfig
    expect(screenConfig1).to.equal(screenConfig2)

    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    screenConfig1.deviceAngle = 80
    config1.handleRotation()

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

          screenConfig2.deviceAngle = 280
          config2.handleRotation()
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

    const ret1 = create(log, '1', initConfig, win1)
    const orientation1 = ret1.orientation
    const config1 = ret1.config
    const screenConfig1 = ret1.screenConfig

    const ret2 = create(log, '2', initConfig, win2)
    const orientation2 = ret2.orientation
    const config2 = ret2.config
    const screenConfig2 = ret2.screenConfig
    expect(screenConfig1).to.equal(screenConfig2)

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

    screenConfig1.deviceAngle = 350
    config1.handleRotation()
    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    screenConfig2.deviceAngle = 10
    config2.handleRotation()
    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('portrait-primary')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])
    done()
  })

  it('Should not fire when other orientation is changed', done => {
    const log = []

    const win1 = new JSDOM().window
    const win2 = new JSDOM().window

    const screenConfig = new ScreenConfig({
      width: 1024,
      height: 768,
    })

    const config1 = new ScreenOrientationConfig(screenConfig, initConfig)
    const config2 = new ScreenOrientationConfig(screenConfig, initConfig)

    const orientation1 = ScreenOrientation.create([], {
      associatedDocument: win1.document
    })
    const orientation2 = ScreenOrientation.create([], {
      associatedDocument: win2.document
    })

    orientation1.addEventListener('change', () => {
      log.push(`1 Orientation was changed: ${orientation1.type}`)
    })
    orientation2.addEventListener('change', () => {
      log.push(`2 Orientation was changed: ${orientation2.type}`)
    })

    config1.configure(orientation1)
    expect(() => config2.configure(orientation2)).to.throw(Error)

    expect(orientation1.type).to.equal('portrait-primary')
    expect(orientation1.angle).to.equal(0)
    expect(orientation2.type).to.equal('')
    expect(orientation2.angle).to.equal(0)
    expect(log).to.deep.equal([])

    screenConfig.deviceAngle = 90
    config1.handleRotation()

    orientation1.addEventListener('change', () => {
      expect(log).to.deep.equal([
        '1 Orientation was changed: landscape-primary',
      ])
      done()
    })
    orientation2.addEventListener('change', () => {
      expect.fail()
    })
  })
})

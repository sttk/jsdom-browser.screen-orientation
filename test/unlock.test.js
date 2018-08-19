'use strict'

const { expect } = require('chai')

const create = require('./fixtures/create-orientation')

const initConfig = {
  relationsOfTypeAndAngle: {
    'portrait-primary': 0,
    'landscape-primary': 90,
    'portrait-secondary': 180,
    'landscape-secondary': 270,
  },
}

describe('Unlock', () => {
  it('Should unlock the orientation', done => {
    const log = []
    const { orientation, config } = create(log, '', initConfig)

    config.orientations = ['landscape-primary']
    config.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(config.currentType).to.equal('landscape-primary')
    expect(config.orientations).to.deep.equal(['landscape-primary'])
    expect(config.currentAngle).to.equal(90)
    expect(log).deep.equal([])

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.unlock()
    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(config.currentType).to.equal('landscape-primary')
    expect(config.currentAngle).to.equal(90)
    expect(config.orientations).to.deep.members([
      'portrait-primary',
      'landscape-primary',
      'portrait-secondary',
      'landscape-secondary',
    ])
    done()
  })

  it('Should unlock when default orientation does not have full types',
  done => {
    const log = []
    const { orientation, config, screenConfig } = create(log, '', initConfig)

    screenConfig.deviceAngle = 270

    config.defaultOrientation = ['landscape-primary', 'portrait-primary']
    config.orientations = ['landscape-secondary']
    config.update()

    expect(orientation.type).to.equal('landscape-secondary')
    expect(orientation.angle).to.equal(270)
    expect(config.currentType).to.equal('landscape-secondary')
    expect(config.orientations).to.deep.equal(['landscape-secondary'])
    expect(config.currentAngle).to.equal(270)
    expect(log).deep.equal([])

    orientation.addEventListener('change', () => {
      expect(log).deep.equal([
        'Orientation was changed (config): landscape-primary',
        'Orientation was changed: landscape-primary',
        'Orientation was changed (onchange): landscape-primary',
      ])
      done()
    })

    orientation.unlock()
    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(config.currentType).to.equal('landscape-primary')
    expect(config.currentAngle).to.equal(90)
    expect(config.orientations).to.deep.members([
      'portrait-primary',
      'landscape-primary',
    ])
  })
})

'use strict'

const { expect } = require('chai')
const create = require('./fixtures/create-orientations')

describe('Unlock', () => {

  it('Should unlock the orientation', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    orientationConfig.orientations = ['landscape-primary']
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(orientationConfig.orientations).to.deep.equal(
      ['landscape-primary'])
    expect(log).to.deep.equal([])

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.unlock()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(orientationConfig.orientations).to.deep.members([
      'portrait-primary',
      'portrait-secondary',
      'landscape-primary',
      'landscape-secondary',
    ])
    done()
  })

  it('Should unlock when default orientation does not have full types',
  done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    screenConfig.deviceAngle = -270

    orientationConfig.defaultOrientation =
      ['landscape-primary', 'portrait-primary']
    orientationConfig.orientations = ['landscape-secondary']
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('landscape-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)
    expect(log).to.deep.equal([])

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was changed (config): landscape-primary',
        'Orientation was changed: landscape-primary',
        'Orientation was changed (onchange): landscape-primary',
      ])
      done()
    })

    orientation.unlock()
    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)
    expect(orientationConfig.orientations).to.deep.members([
      'portrait-primary',
      'landscape-primary',
    ])
  })
})


'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')
const path = require('path')
const create = require('./fixtures/create-orientations')

describe('Lock', () => {

  it('When lock type is "landscape-primary"', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.lock('landscape-primary').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
      expect(orientationConfig.orientations).to.deep
        .equal(['landscape-primary'])
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): landscape-primary',
        'Orientation was changed: landscape-primary',
        'Orientation was changed (onchange): landscape-primary',
      ])
      done()
    })
  })

  it('When lock type is "landscape-secondary"', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.lock('landscape-secondary').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientationConfig.currentType).to.equal('landscape-secondary')
      expect(orientationConfig.currentAngle).to.equal(270)
      expect(orientationConfig.orientations).to.members(
        ['landscape-secondary'])
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): landscape-secondary',
        'Orientation was changed: landscape-secondary',
        'Orientation was changed (onchange): landscape-secondary',
      ])
      done()
    })
  })

  it('When lock type is "portrait-primary"', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('portrait-primary').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.members(
        ['portrait-primary'])
      expect(log).deep.equal([
        'Orientation was locked',
      ])
      done()
    }).catch(e => {
      done(e)
    })
  })

  it('When lock type is "portrait-secondary"', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.lock('portrait-secondary').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('portrait-secondary')
      expect(orientation.angle).to.equal(180)
      expect(orientationConfig.currentType).to.equal('portrait-secondary')
      expect(orientationConfig.currentAngle).to.equal(180)
      expect(orientationConfig.orientations).to.deep
        .equal(['portrait-secondary'])
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): portrait-secondary',
        'Orientation was changed: portrait-secondary',
        'Orientation was changed (onchange): portrait-secondary',
      ])
      done()
    })
  })

  it('When lock type is "portrait"', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    screenConfig.deviceAngle = -270
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-secondary')
    expect(orientation.angle).to.equal(270)
    expect(orientationConfig.currentType).to.equal('landscape-secondary')
    expect(orientationConfig.currentAngle).to.equal(270)

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): portrait-primary',
        'Orientation was changed: portrait-primary',
        'Orientation was changed (onchange): portrait-primary',
      ])
      done()
    })

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.members([
        'portrait-primary',
        'portrait-secondary',
      ])
    }).catch(e => {
      done(e)
    })
  })

  it('When lock type is "landscape"', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.lock('landscape').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
      expect(orientationConfig.orientations).to.members([
        'landscape-primary',
        'landscape-secondary',
      ])
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): landscape-primary',
        'Orientation was changed: landscape-primary',
        'Orientation was changed (onchange): landscape-primary',
      ])
      done()
    })
  })

  it('When lock type is "natural"', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    orientation.lock('natural').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.members([
        'portrait-primary',
      ])
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): portrait-primary',
        'Orientation was changed: portrait-primary',
        'Orientation was changed (onchange): portrait-primary',
      ])
      done()
    })
  })

  it('When lock type is "any"', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('any').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
      expect(orientationConfig.orientations).to.members([
        'portrait-primary',
        'portrait-secondary',
        'landscape-primary',
        'landscape-secondary',
      ])
      expect(log).deep.equal([
        'Orientation was locked',
      ])
      done()
    }).catch(e => {
      done(e)
    })
  })

  it('When lock type is invalid', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('xxx').then(() => {
      expect.fail()
    }).catch(e => {
      expect(e).to.be.instanceof(TypeError)
      expect(e.message).to.equal(
        'screen.orientation.lock() causes an error: invalid type.')
      done()
    })
  })

  it('Should lock by config without change event', done => {
    const log = []
    const { orientation, orientationConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    })

    expect(orientation.type).to.equal('portrait-primary')
    expect(orientation.angle).to.equal(0)
    expect(orientationConfig.currentType).to.equal('portrait-primary')
    expect(orientationConfig.currentAngle).to.equal(0)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.members([
        'portrait-primary',
        'portrait-secondary',
      ])
      expect(log).deep.equal([
        'Orientation was locked',
      ])
      done()
    }).catch(e => {
      done(e)
    })
  })

  it('Should be thrown change events by all descendant orientations',
  done => {
    const initConfig = {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      }
    }
    const fp = path.resolve(__dirname, 'fixtures/iframe-parent.html')
    JSDOM.fromFile(fp).then(dom => {
      const log = []

      const oriArr = [create(log, 'p', initConfig, dom.window)]
      const coll = dom.window.document.getElementsByTagName('iframe')
      for (let i = 0, n = coll.length; i < n; i++) {
        const iframe = coll[i]
        oriArr.push(create(log, (i + 1), initConfig, iframe.contentWindow))
      }

      expect(oriArr[0].orientation.type).to.equal('portrait-primary')
      expect(oriArr[0].orientation.angle).to.equal(0)
      expect(oriArr[1].orientation.type).to.equal('portrait-primary')
      expect(oriArr[1].orientation.angle).to.equal(0)
      expect(oriArr[2].orientation.type).to.equal('portrait-primary')
      expect(oriArr[2].orientation.angle).to.equal(0)
      expect(oriArr[3].orientation.type).to.equal('portrait-primary')
      expect(oriArr[3].orientation.angle).to.equal(0)
      expect(log).to.deep.equal([])

      oriArr[0].orientation.lock('landscape').then(() => {
        expect(oriArr[0].orientation.type).to.equal('landscape-primary')
        expect(oriArr[0].orientation.angle).to.equal(90)
        expect(oriArr[1].orientation.type).to.equal('landscape-primary')
        expect(oriArr[1].orientation.angle).to.equal(90)
        expect(oriArr[2].orientation.type).to.equal('landscape-primary')
        expect(oriArr[2].orientation.angle).to.equal(90)
        expect(oriArr[3].orientation.type).to.equal('landscape-primary')
        expect(oriArr[3].orientation.angle).to.equal(90)
      })

      oriArr[0].orientation.addEventListener('change', () => {
        setImmediate(() => {
          expect(log).to.deep.equal([
            'p Orientation was changed (config): landscape-primary',
            'p Orientation was changed: landscape-primary',
            'p Orientation was changed (onchange): landscape-primary',
            '1 Orientation was changed (config): landscape-primary',
            '1 Orientation was changed: landscape-primary',
            '1 Orientation was changed (onchange): landscape-primary',
            '2 Orientation was changed (config): landscape-primary',
            '2 Orientation was changed: landscape-primary',
            '2 Orientation was changed (onchange): landscape-primary',
            '3 Orientation was changed (config): landscape-primary',
            '3 Orientation was changed: landscape-primary',
            '3 Orientation was changed (onchange): landscape-primary',
          ])
          done()
        })
      })
    })
  })
})

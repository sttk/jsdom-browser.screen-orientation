'use strict'

const { expect } = require('chai')
const { JSDOM } = require('jsdom')
const create = require('./fixtures/create-orientations')
const path = require('path')

describe('Lock error', () => {
  it('Should simulate to throw NotSupportedError by flag', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    orientationConfig.isSupportedLocking = false

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked')
      expect.fail()
    }).catch(e => {
      expect(e.name).to.equal('NotSupportedError')
      expect(e.message).to.equal(
        orientationConfig.message.lockNotSupportedError)
      done()
    })
  })

  it('Should simulate to throw SecurityError by flag', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    orientationConfig.isSecurityError = true

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    orientation.addEventListener('change', () => {
      expect.fail()
    })

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked')
      expect.fail()
    }).catch(e => {
      expect(e.name).to.equal('SecurityError')
      expect(e.message).to.equal(orientationConfig.message.lockSecurityError)
      done()
    })
  })

  it('Should throw SecurityError when sandboxed orientation lock', done => {
    const initConfig = {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
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

      oriArr[1].orientation.addEventListener('change', () => {
        expect(log).to.deep.equal([
         '1 Orientation was changed (config): landscape-primary',
         '1 Orientation was changed: landscape-primary',
         '1 Orientation was changed (onchange): landscape-primary',
        ])
      })
      oriArr[2].orientation.addEventListener('change', () => {
        expect.fail()
      })
      oriArr[3].orientation.addEventListener('change', () => {
        expect(log).to.deep.equal([
          '1 Orientation was changed (config): landscape-primary',
          '1 Orientation was changed: landscape-primary',
          '1 Orientation was changed (onchange): landscape-primary',
          '3 Orientation was changed (config): landscape-primary',
          '3 Orientation was changed: landscape-primary',
          '3 Orientation was changed (onchange): landscape-primary',
        ])
        done()
      })

      oriArr[1].orientation.lock('landscape-primary').then(() => {
        expect(oriArr[0].orientation.type).to.equal('portrait-primary')
        expect(oriArr[0].orientation.angle).to.equal(0)
        expect(oriArr[1].orientation.type).to.equal('landscape-primary')
        expect(oriArr[1].orientation.angle).to.equal(90)
        expect(oriArr[2].orientation.type).to.equal('portrait-primary')
        expect(oriArr[2].orientation.angle).to.equal(0)
        expect(oriArr[3].orientation.type).to.equal('portrait-primary')
        expect(oriArr[3].orientation.angle).to.equal(0)

        oriArr[2].orientation.lock('landscape-primary').then(() => {
          expect.fail()
        }).catch(e2 => {
          expect(e2.name).to.equal('SecurityError')
          expect(e2.message).to.equal(
            'screen.orientation.lock() causes a security error.')

          oriArr[3].orientation.lock('landscape-primary').then(() => {
            expect(oriArr[0].orientation.type).to.equal('portrait-primary')
            expect(oriArr[0].orientation.angle).to.equal(0)
            expect(oriArr[1].orientation.type).to.equal('landscape-primary')
            expect(oriArr[1].orientation.angle).to.equal(90)
            expect(oriArr[2].orientation.type).to.equal('portrait-primary')
            expect(oriArr[2].orientation.angle).to.equal(0)
            expect(oriArr[3].orientation.type).to.equal('landscape-primary')
            expect(oriArr[3].orientation.angle).to.equal(90)
          }).catch(e3 => {
            done(e3)
          })
        })
      }).catch(e => {
        done(e)
      })
    })
  })

  it('Should throw AbortError when locking by next locking', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    let counter = 3
    function end () {
      counter--
      if (counter === 0) {
        done()
      }
    }

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked (1)')
      expect.fail()
    }).catch(e => {
      expect(e.name).to.equal('AbortError')
      expect(e.message).to.equal(orientationConfig.message.lockAbortError)
      end()
    })

    orientation.lock('landscape-secondary').then(() => {
      log.push('Orientation was locked (2)')
      expect(orientation.type).to.equal('landscape-secondary')
      expect(orientation.angle).to.equal(270)
      expect(orientationConfig.currentType).to.equal('landscape-secondary')
      expect(orientationConfig.currentAngle).to.equal(270)
      expect(orientationConfig.orientations).to.deep.equal(
        ['landscape-secondary'])
      end()
    }).catch(e => {
      done(e)
    })

    orientation.addEventListener('change', () => {
      expect(log).to.deep.equal([
        'Orientation was locked (2)',
        'Orientation was changed (config): landscape-secondary',
        'Orientation was changed: landscape-secondary',
        'Orientation was changed (onchange): landscape-secondary',
      ])
      end()
    })
  })

  it('Should simulate to abort locking for not being active orientation ' +
  '\n\tlock by flag', done => {
    const log = []
    const { orientation, orientationConfig, screenConfig } = create(log, '', {
      relationsOfTypeAndAngle: {
        'portrait-primary': 0,
        'landscape-primary': 90,
        'portrait-secondary': 180,
        'landscape-secondary': 270,
      },
    })

    screenConfig.deviceAngle = -90
    orientationConfig.update()

    expect(orientation.type).to.equal('landscape-primary')
    expect(orientation.angle).to.equal(90)
    expect(orientationConfig.currentType).to.equal('landscape-primary')
    expect(orientationConfig.currentAngle).to.equal(90)

    orientationConfig.isActiveOrientationLock = false

    orientation.lock('portrait').then(() => {
      log.push('Orientation was locked')
      expect(orientation.type).to.equal('landscape-primary')
      expect(orientation.angle).to.equal(90)
      expect(orientationConfig.currentType).to.equal('landscape-primary')
      expect(orientationConfig.currentAngle).to.equal(90)
      expect(orientationConfig.orientations).to.deep.equal([
        'portrait-primary',
        'portrait-secondary',
      ])
      expect(log).deep.equal([
        'Orientation was locked',
      ])

      orientationConfig.isActiveOrientationLock = true
      orientationConfig.handleVisible()

      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.deep.equal([
        'portrait-primary',
        'portrait-secondary',
      ])

      orientationConfig.handleVisible()
      expect(orientation.type).to.equal('portrait-primary')
      expect(orientation.angle).to.equal(0)
      expect(orientationConfig.currentType).to.equal('portrait-primary')
      expect(orientationConfig.currentAngle).to.equal(0)
      expect(orientationConfig.orientations).to.deep.equal([
        'portrait-primary',
        'portrait-secondary',
      ])
    }).catch(e => {
      done(e)
    })

    let counter = 0
    orientation.addEventListener('change', () => {
      counter++
      expect(counter).to.equal(1)
      expect(log).deep.equal([
        'Orientation was locked',
        'Orientation was changed (config): portrait-primary',
        'Orientation was changed: portrait-primary',
        'Orientation was changed (onchange): portrait-primary',
      ])
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
      },
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
      expect(orientationConfig.orientations).to.deep.equal([
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

})

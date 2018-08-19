'use strict'

const path = require('path')

const setup = require('./setup')

const testcases = require('./testcases')
const testsDir = path.resolve(__dirname, 'tests/screen-orientation')
const filter = testPath => (testcases[testPath] === true)

module.exports = { setup, filter, testsDir }

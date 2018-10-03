'use strict'

const setup = require('./setup')

const testcases = require('./testcases')
const filter = testPath => (testcases[testPath] === true)

const path = require('path')
const testsDir = path.resolve(__dirname, 'tests/screen-orientation')

module.exports = { setup, filter, testsDir }

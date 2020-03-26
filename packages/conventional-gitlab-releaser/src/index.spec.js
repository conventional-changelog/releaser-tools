'use strict'

const chai = require('chai')
const mocha = require(`mocha`)
const conventionalGitlabReleaser = require('./index')

const expect = chai.expect

const beforeEach = mocha.beforeEach
const describe = mocha.describe
const it = mocha.it

describe.only('index', function () {
  beforeEach(function () {
    this.chunk = {
      committerDate: 'June 8, 2012',
      gitTags: ''
    }
  })

  it('should throw an error if no argument is passed', function () {
    expect(conventionalGitlabReleaser).to.throw()
  })

  it('should throw an error if no user callback is passed', function () {
    expect(function () {
      conventionalGitlabReleaser({}, {}, {}, {}, {})
    }).to.throw()
  })

  it('should not throw if userCb is a callback function', function () {
    const userCb = function () {}
    expect(function () {
      conventionalGitlabReleaser({}, {}, {}, {}, {}, userCb)
    }).not.to.throw()
  })
})

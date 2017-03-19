'use strict';

// jshint expr: true

var chai = require('chai');
var transform = require('./transform');

var expect = chai.expect;

describe('transform', function() {
  beforeEach(function() {
    this.chunk = {
      committerDate: 'June 8, 2012',
      gitTags: '',
    };
  });

  it('should skip semantic version matching when gitTags isn\'t a string', function(done) {
    this.chunk.gitTags = undefined;

    transform(this.chunk, function(err, chunk) {
      expect(chunk.version).to.be.undefined;
      done();
    });
  });

  it('should have no version when there are no tags', function(done) {
    transform(this.chunk, function(err, chunk) {
      expect(chunk.version).to.be.undefined;
      done();
    });
  });

  it('should not match invalid semantic version tag', function(done) {
    this.chunk.gitTags = ' tag: release-18';

    transform(this.chunk, function(err, chunk) {
      expect(chunk.version).to.be.undefined;
      done();
    });
  });

  it('should match valid semantic version tag', function(done) {
    this.chunk.gitTags = ' tag: release-18, tag: 1.1.20';

    transform(this.chunk, function(err, chunk) {
      expect(chunk.version).to.equal('1.1.20');
      done();
    });
  });

  it('should format date', function(done) {
    transform(this.chunk, function(err, chunk) {
      expect(chunk.committerDate).to.equal('2012-06-08');
      done();
    });
  });
});

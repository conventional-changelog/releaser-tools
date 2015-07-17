'use strict';
var conventionalGithubReleaser = require('../');
var expect = require('chai').expect;
var githubRemoveAllReleases = require('github-remove-all-releases');

var AUTH = {
  type: 'oauth',
  token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
};

describe('conventional-github-releaser', function() {
  before(function(done) {
    githubRemoveAllReleases(AUTH, 'stevemaotest', 'conventional-github-releaser-test', function() {
      done();
    });
  });

  it('should throw if no auth is passed', function() {
    expect(conventionalGithubReleaser).to.throw('Expected an auth object');
  });

  it('should throw if no cb is passed', function() {
    expect(function() {
      conventionalGithubReleaser({});
    }).to.throw('Expected an callback');
  });

  it('should create a release', function(done) {
    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
    }, function(err, responses) {
      expect(responses[0].state).to.equal('fulfilled');

      done(err);
    });
  });

  it('should fail if a release exists', function(done) {
    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
    }, function(err, responses) {
      expect(responses[0].state).to.equal('rejected');

      done(err);
    });
  });
});

'use strict';
var conventionalGithubReleaser = require('../');
var expect = require('chai').expect;
var fs = require('fs');
var Github = require('github');
var githubRemoveAllReleases = require('github-remove-all-releases');
var shell = require('shelljs');

var AUTH = {
  type: 'oauth',
  token: process.env.TEST_CONVENTIONAL_GITHUB_RELEASER_TOKEN
};
var GITHUB_USER = process.env.TEST_CONVENTIONAL_GITHUB_USER || 'stevemaotest';

var github = new Github({
  version: '3.0.0'
});

github.authenticate(AUTH);

describe('conventional-github-releaser', function() {
  before(function(done) {
    shell.cd('test');
    shell.exec('git init');
    fs.writeFileSync('test1', '');
    shell.exec('git add --all && git commit -m"First commit"');

    githubRemoveAllReleases(AUTH, GITHUB_USER, 'conventional-github-releaser-test', function() {
      done();
    });
  });

  after(function() {
    shell.cd('../');
  });

  it('should throw if no auth is passed', function() {
    expect(conventionalGithubReleaser).to.throw('Expected an auth object');
  });

  it('should throw if no cb is passed', function() {
    expect(function() {
      conventionalGithubReleaser({});
    }).to.throw('Expected an callback');
  });

  it('should error if git-raw-commits opts is wrong', function(done) {
    conventionalGithubReleaser(AUTH, {}, {}, {
      version: '0.0.1'
    }, function(err) {
      expect(err).to.be.ok; // jshint ignore:line

      done();
    });
  });

  it('should error if no version can be found', function(done) {
    conventionalGithubReleaser(AUTH, function(err) {
      expect(err).to.be.ok; // jshint ignore:line

      done();
    });
  });

  it('should create a release', function(done) {
    shell.exec('git tag v1.0.0');

    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
    }, function(err, responses) {
      expect(responses.length).to.equal(1);
      expect(responses[0].state).to.equal('fulfilled');
      github.releases.getRelease({
        // jscs:disable
        owner: GITHUB_USER,
        repo: 'conventional-github-releaser-test',
        id: responses[0].value.id
        // jscs:enable
      }, function(err, data) {
        expect(data.body).to.match(/First commit/);
        done();
      });
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

  it('should create a prerelease', function(done) {
    fs.writeFileSync('test2', '');
    shell.exec('git add --all && git commit -m"feat(awesome): second commit"');
    shell.exec('git tag v2.0.0-beta');

    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
    }, function(err, responses) {
      expect(responses.length).to.equal(1);
      expect(responses[0].state).to.equal('fulfilled');
      github.releases.getRelease({
        // jscs:disable
        owner: GITHUB_USER,
        repo: 'conventional-github-releaser-test',
        id: responses[0].value.id
        // jscs:enable
      }, function(err, data) {
        expect(data.prerelease).to.equal(true);
        done();
      });
    });
  });

  it('should ignore the header template if using a preset', function(done) {
    fs.writeFileSync('test3', '');
    shell.exec('git add --all && git commit -m"feat(awesome): third commit"');
    shell.exec('git tag v2.0.0');

    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
      preset: 'angular'
    }, function(err, responses) {
      expect(responses.length).to.equal(1);
      github.releases.getRelease({
        // jscs:disable
        owner: GITHUB_USER,
        repo: 'conventional-github-releaser-test',
        id: responses[0].value.id
        // jscs:enable
      }, function(err, data) {
        expect(data.body).to.not.match(/<\/a>/);
        done();
      });
    });
  });

  it('should generate multiple releases', function(done) {
    fs.writeFileSync('test4', '');
    shell.exec('git add --all && git commit -m"feat(awesome): forth commit"');
    shell.exec('git tag v3.0.0');
    fs.writeFileSync('test5', '');
    shell.exec('git add --all && git commit -m"feat(awesome): fifth commit"');
    shell.exec('git tag v4.0.0');

    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
      releaseCount: 2
    }, function(err, responses) {
      expect(responses.length).to.equal(2);
      done(err);
    });
  });

  it('should attempt to generate all releases', function(done) {
    conventionalGithubReleaser(AUTH, {
      pkg: {
        path: __dirname + '/fixtures/_package.json'
      },
      releaseCount: 0
    }, function(err, responses) {
      expect(responses.length).to.equal(5);
      done(err);
    });
  });
});

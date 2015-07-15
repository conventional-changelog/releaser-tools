'use strict';
var expect = require('chai').expect;
var githubRemoveAllReleases = require('github-remove-all-releases');
var spawn = require('child_process').spawn;

var cliPath = __dirname + '/../cli.js';

var AUTH = {
  type: 'oauth',
  token: process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
};

describe('cli', function() {
  before(function(done) {
    githubRemoveAllReleases(AUTH, 'stevemaotest', 'conventional-github-releaser-test', function() {
      done();
    });
  });

  it('should work', function(done) {
    var cp = spawn(cliPath, ['--pkg',  __dirname + '/fixtures/_package.json'], {
      stdio: [process.stdin, null, null]
    });

    cp.on('close', function(code) {
      expect(code).to.equal(0);

      done();
    });
  });
});

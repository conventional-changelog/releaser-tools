var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var expect = require('chai').expect;

var auth = {token: ' any token', type: 'oauth'};

describe('Github Enterprise', function() {
  describe('cli', function() {
    var release = sinon.spy();
    // run the cli with stub
    // conventionalGithubReleaser
    var run = function(args) {
      process.argv = ['node', 'cli'].concat(args);
      proxyquire('../cli', {'./': release});
    };

    afterEach(function() {
      release.reset();
    });

    it('should accept http releated params', function() {
      run([
        '-t' +  auth.token,
        '--port', '80',
        '--protocol', 'https',
        '--host', 'github.com',
        '--path-prefix', '/api/v3'
      ]);

      expect(release.getCall(0).args[0]).to.eql({
        token: auth.token,
        type: auth.type,
      });

      expect(release.getCall(0).args[1]).to.include({
        host: 'github.com',
        pathPrefix: '/api/v3',
        port: '80',
        protocol: 'https'
      });
    });

    it('should github-* empty', function() {
      run(['-t', auth.token]);

      expect(release.getCall(0).args[0]).to.eql({
        token: auth.token,
        type: auth.type,
      });
    });
  });

  describe('library', function() {
    var GitHub = sinon.spy();
    var release = proxyquire('../index', {'github': GitHub});

    afterEach(function() {
      GitHub.reset();
    });

    it('should accept ghe params', function() {
      var changelogOpts = {};
      var context = {};
      var gitRawCommitsOpts = {};
      var parserOpts = {};
      var writerOpts = {};
      var cb = sinon.spy();

      var githubOpts = Object.assign({
        host: 'github.com',
        pathPrefix: '/api/v3',
        port: '80',
        protocol: 'https'
      }, auth);

      release(
        githubOpts,
        changelogOpts,
        context,
        gitRawCommitsOpts,
        parserOpts,
        writerOpts,
        cb
      );

      expect(GitHub.getCall(0).args[0]).to.eql(Object.assign(githubOpts, {
        version: '3.0.0'
      }));

    });
  });
});

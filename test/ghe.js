var proxyquire = require('proxyquire').noPreserveCache();
var sinon = require('sinon');
var expect = require('chai').expect;

var repo = require('./fixtures').ghe;
var auth = require('./fixtures').auth;

var merge = Object.assign.bind(Object);

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

  describe('programmatically', function() {
    var Github = require('github');
    var github = new Github({version: '3.0.0'});
    var FakeGithub = sinon.stub().returns(github);
    var release = proxyquire('../index', {'github': FakeGithub});

    var changelogOpts = {pkg: repo.pkg};
    var githubOpts = {
      host: 'github.com',
      pathPrefix: '/api/v3',
      port: '80',
      protocol: 'https'
    };
    var options = merge(githubOpts, changelogOpts);

    before(function() {
      sinon.spy(github.releases, 'createRelease');
    });

    afterEach(function() {
      FakeGithub.reset();
      github.releases.createRelease.reset();
    });

    it('should accept ghe params', function() {
      var params = merge(githubOpts, {
        version: '3.0.0'
      });
      release(auth, options, sinon.spy());
      expect(FakeGithub.getCall(0).args[0]).to.include(params);
    });

    it('should parse ghe repository', function(done) {
      release(auth, options, function() {
        var githubRelease = github.releases.createRelease.getCall(0).args[0];
        expect(githubRelease).to.include({
          'owner': 'programmer',
          'repo': 'ghe-repo'
        });
        done();
      });
    });
  });
});

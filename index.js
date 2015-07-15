'use strict';
var assign = require('object-assign');
var conventionalChangelog = require('conventional-changelog');
var fs = require('fs');
var getPkgRepo = require('get-pkg-repo');
var Github = require('github');
var Q = require('q');
var through = require('through2');
var url = require('url');

var github = new Github({
  version: '3.0.0'
});

function conventionalGithubReleaser(auth, options, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!auth) {
    throw new Error('Expected an auth object');
  }

  var pkgPromise;
  var promises = [];

  var changelogArgs = [options, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts].map(function(arg) {
    if (typeof arg === 'function') {
      userCb = arg;
      return {};
    } else {
      return arg || {};
    }
  });

  if (!userCb) {
    throw new Error('Expected an callback');
  }

  options = changelogArgs[0];
  changelogOpts = changelogArgs[1];
  context = changelogArgs[2];
  gitRawCommitsOpts = changelogArgs[3];
  parserOpts = changelogArgs[4];
  writerOpts = changelogArgs[5];

  options = assign({
    prefixV: true
  }, options);

  changelogOpts = assign({
    pkg: 'package.json'
  }, changelogOpts);

  writerOpts.includeDetails = true;

  var loadPkg = (!context.host || !context.repository || !context.version) && changelogOpts.pkg;
  if (loadPkg) {
    pkgPromise = Q.nfcall(fs.readFile, changelogOpts.pkg, 'utf8');
  }

  Q.allSettled([pkgPromise])
    .spread(function(pkgObj) {
      var pkg;

      if (loadPkg) {
        if (pkgObj.state === 'fulfilled') {
          pkg = pkgObj.value;
          try {
            pkg = JSON.parse(pkg);

            var repositoryUrl = url.parse(getPkgRepo(pkg));
            context.host = context.host || repositoryUrl.protocol + (repositoryUrl.slashes ? '//' : '') + repositoryUrl.host;
            context.version = context.version || pkg.version;
            var ownerRepo = repositoryUrl.pathname.replace('/', '').split('/');
            context.owner = context.owner || ownerRepo.shift();
            context.repository = context.repository || ownerRepo.join('/');
          } catch (err) {}
        }
      }

      github.authenticate(auth);

      conventionalChangelog(changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts)
        .on('error', function(err) {
          setImmediate(userCb, err);
        })
        .pipe(through.obj(function(chunk, enc, cb) {
          var version = (chunk.keyCommit && chunk.keyCommit.version) || context.version;

          if (!version) {
            setImmediate(userCb, new Error('Cannot find a version used for the release tag'));
            return;
          }

          if (options.prefixV && version[0].toLowerCase() !== 'v') {
            version = 'v' + version;
          }

          var promise = Q.nfcall(github.releases.createRelease, {
            // jscs:disable
            owner: context.owner,
            repo: context.repository,
            tag_name: version,
            body: chunk.log
            // jscs:enable
          });

          promises.push(promise);

          cb();
        }, function() {
          Q.allSettled(promises)
            .then(function(responses) {
              setImmediate(userCb, null, responses);
            });
        }));
    });
}

module.exports = conventionalGithubReleaser;

'use strict';
var assign = require('object-assign');
var conventionalChangelog = require('conventional-changelog');
var dateFormat = require('dateformat');
var Github = require('github');
var gitSemverTags = require('git-semver-tags');
var merge = require('lodash.merge');
var Q = require('q');
var semver = require('semver');
var through = require('through2');
var parse = require('@bahmutov/parse-github-repo-url');

function conventionalGithubReleaser(githubOpts, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!githubOpts || !githubOpts.token) {
    throw new Error('Expected an auth object');
  }

  var github = new Github(Object.assign({
    version: '3.0.0'
  }, githubOpts));

  var promises = [];

  var changelogArgs = [changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts].map(function(arg) {
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

  changelogOpts = changelogArgs[0];
  context = changelogArgs[1];
  gitRawCommitsOpts = changelogArgs[2];
  parserOpts = changelogArgs[3];
  writerOpts = changelogArgs[4];

  changelogOpts = merge({
    transform: function(chunk, cb) {
      if (typeof chunk.gitTags === 'string') {
        var match = /tag:\s*(.+?)[,\)]/gi.exec(chunk.gitTags);
        if (match) {
          chunk.version = match[1];
        }
      }

      if (chunk.committerDate) {
        chunk.committerDate = dateFormat(chunk.committerDate, 'yyyy-mm-dd', true);
      }

      cb(null, chunk);
    },
    releaseCount: 1
  }, changelogOpts);

  writerOpts.includeDetails = true;

  // ignore the default header partial
  writerOpts.headerPartial = writerOpts.headerPartial || '';

  github.authenticate(githubOpts);

  Q.nfcall(gitSemverTags)
    .then(function(tags) {
      if (!tags || !tags.length) {
        setImmediate(userCb, new Error('No semver tags found'));
        return;
      }

      var releaseCount = changelogOpts.releaseCount;
      if (releaseCount !== 0) {
        gitRawCommitsOpts = assign({
          from: tags[releaseCount]
        });
      }

      gitRawCommitsOpts.to = gitRawCommitsOpts.to || tags[0];

      conventionalChangelog(changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts)
        .on('error', function(err) {
          userCb(err);
        })
        .pipe(through.obj(function(chunk, enc, cb) {
          if (!chunk.keyCommit || !chunk.keyCommit.version) {
            cb();
            return;
          }

          var version =  chunk.keyCommit.version;

          var prerelease = semver.parse(version).prerelease.length > 0;

          // conventional changelog don't parse
          // owner of ghe reposity yet
          var owner = parse(context.repository)[1];

          var promise = Q.nfcall(github.releases.createRelease, {
            // jscs:disable
            owner: context.owner || owner,
            repo: context.repository,
            tag_name: version,
            body: chunk.log,
            prerelease: prerelease
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
    })
    .catch(function(err) {
      userCb(err);
    });
}

module.exports = conventionalGithubReleaser;

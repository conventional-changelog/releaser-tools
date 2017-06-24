'use strict';
var assign = require('object-assign');
var conventionalChangelog = require('conventional-changelog');
var escape = require('querystring').escape;
var gitSemverTags = require('git-semver-tags');
var glGot = require('gl-got');
var merge = require('lodash.merge');
var Q = require('q');
var through = require('through2');
var transform = require('./transform');

function conventionalGitlabReleaser(auth, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!auth) {
    throw new Error('Expected an auth object');
  }

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
    transform: transform,
    releaseCount: 1
  }, changelogOpts);

  writerOpts.includeDetails = true;

  // ignore the default header partial
  writerOpts.headerPartial = writerOpts.headerPartial || '';

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
        }, gitRawCommitsOpts);
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

          var promise = glGot('projects/' + escape(context.owner + '/' + context.repository) + '/repository/tags', {
            token: auth.token,
            endpoint: auth.url + '/api/v3/',
            body: {
              'tag_name': chunk.keyCommit.version,
              ref: chunk.keyCommit.hash,
              message: 'Release ' + chunk.keyCommit.version,
              'release_description': chunk.log
            }
          });

          promises.push(promise);

          cb();
        }, function() {
          Q.all(promises)
            .then(function(responses) {
              userCb(null, responses);
            })
            .catch(function(err) {
              userCb(err);
            });
        }));
    })
    .catch(function(err) {
      userCb(err);
    });
}

module.exports = conventionalGitlabReleaser;

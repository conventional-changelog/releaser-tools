'use strict';
var assign = require('object-assign');
var conventionalChangelog = require('conventional-changelog');
var dateFormat = require('dateformat');
var gitSemverTags = require('git-semver-tags');
var merge = require('lodash.merge');
var Q = require('q');
var through = require('through2');

function conventionalGitlabReleaser(auth, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!auth) {
    throw new Error('Expected an auth object');
  }

  var gitlab = require('gitlab')(auth);

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

          var version =  chunk.keyCommit.version;

          var deferred = Q.defer();
          gitlab.projects.repository.addTag({
            id: context.owner + '/' + context.repository,
            'tag_name': version,
            ref: chunk.keyCommit.hash,
            message: 'Release ' + version,
            'release_description': chunk.log
          }, function(response) {
            if (response === true) {
              return deferred.reject(response);
            }

            deferred.resolve(response);
          });

          promises.push(deferred.promise);

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

module.exports = conventionalGitlabReleaser;

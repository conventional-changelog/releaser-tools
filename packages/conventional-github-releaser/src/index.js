'use strict'

const assign = require('object-assign')
const conventionalChangelog = require('conventional-changelog')
const debug = require(`debug`)(`conventional-github-releaser`)
const gitSemverTags = require('git-semver-tags')
const ghGot = require('gh-got')
const merge = require('lodash.merge')
const Q = require('q')
const semver = require('semver')
const through = require('through2')
const transform = require('./transform')

/* eslint max-params: ["error", 7] */
function conventionalGithubReleaser (auth, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!auth) {
    throw new Error('Expected an auth object')
  }

  const promises = []

  const changelogArgs = [changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts].map(function (arg) {
    if (typeof arg === 'function') {
      userCb = arg
      return {}
    }
    return arg || {}
  })

  if (!userCb) {
    throw new Error('Expected an callback')
  }

  changelogOpts = changelogArgs[0]
  context = changelogArgs[1]
  gitRawCommitsOpts = changelogArgs[2]
  parserOpts = changelogArgs[3]
  writerOpts = changelogArgs[4]

  changelogOpts = merge({
    transform: transform,
    releaseCount: 1
  }, changelogOpts)

  writerOpts.includeDetails = true

  // ignore the default header partial
  writerOpts.headerPartial = writerOpts.headerPartial || ''

  Q.nfcall(gitSemverTags)
    .then(function (tags) {
      if (!tags || !tags.length) {
        setImmediate(userCb, new Error('No semver tags found'))
        return
      }

      const releaseCount = changelogOpts.releaseCount
      if (releaseCount !== 0) {
        gitRawCommitsOpts = assign({
          from: tags[releaseCount]
        }, gitRawCommitsOpts)
      }

      gitRawCommitsOpts.to = gitRawCommitsOpts.to || tags[0]

      conventionalChangelog(changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts)
        .on('error', function (err) {
          userCb(err)
        })
        .pipe(through.obj(function (chunk, enc, cb) {
          if (!chunk.keyCommit || !chunk.keyCommit.version) {
            cb()
            return
          }

          const url = `repos/${context.owner}/${context.repository}/releases`
          const options = {
            endpoint: auth.url,
            body: {
              body: chunk.log,
              draft: changelogOpts.draft || false,
              name: changelogOpts.name || chunk.keyCommit.version,
              prerelease: semver.parse(chunk.keyCommit.version).prerelease.length > 0,
              tag_name: chunk.keyCommit.version,
              target_commitish: changelogOpts.targetCommitish
            }
          }
          if (changelogOpts.discussion) {
            options.body.discussion_category_name = changelogOpts.discussion
          }
          debug(`posting %o to the following URL - ${url}`, options)

          // Set auth after debug output so that we don't print auth token to console.
          options.token = auth.token

          promises.push(ghGot(url, options))

          cb()
        }, function () {
          Q.all(promises)
            .then(function (responses) {
              userCb(null, responses)
            })
            .catch(function (err) {
              userCb(err)
            })
        }))
    })
    .catch(function (err) {
      userCb(err)
    })
}

module.exports = conventionalGithubReleaser

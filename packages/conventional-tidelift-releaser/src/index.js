'use strict'

const assign = require('object-assign')
const conventionalChangelog = require('conventional-changelog')
const debug = require(`debug`)(`conventional-tidelift-releaser`)
const escape = require('querystring').escape
const got = require(`got`)
const gitSemverTags = require('git-semver-tags')
const merge = require('lodash.merge')
const Q = require('q')
const through = require('through2')
const transform = require('./transform')

/* eslint max-params: ["error", 7] */
function conventionalTideliftReleaser (auth, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, userCb) {
  if (!auth) {
    throw new Error('Expected an auth object')
  }

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
        .pipe(through.obj(async function (chunk, enc, cb) {
          if (!chunk.keyCommit || !chunk.keyCommit.version) {
            cb()
            return
          }

          const url = `https://api.tidelift.com/external-api/lifting/${escape(auth.platform)}/${escape(auth.package)}/release-notes/${chunk.keyCommit.version}`

          debug(`using the url - ${url}`)
          debug(`publishing release notes for version - ${chunk.keyCommit.version}`)
          debug(`version associated with commit hash ${chunk.keyCommit.hash}`)

          const options = {
            json: true,
            headers: {
              authorization: `Bearer ${auth.token}`
            },
            body: {
              body: chunk.log
            }
          }

          try {
            try {
              await got.post(url, options)
            } catch (error) {
              if (error.statusCode === 409) {
                debug(`release already exists so updating content with a PUT`)
                await got.put(url, options)
              } else {
                debug(`POST failed with the following error - ${error}`)
                cb(error)
              }
            }
          } catch (error) {
            debug(`PUT failed with the following error - ${error}`)
            cb(error)
          }

          cb()
        }))
        .on('error', function (err) {
          userCb(err)
        })
        .on(`end`, () => userCb())
    })
    .catch(function (err) {
      userCb(err)
    })
}

module.exports = conventionalTideliftReleaser

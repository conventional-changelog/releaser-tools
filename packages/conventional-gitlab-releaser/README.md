#  conventional-gitlab-releaser

[![build status](https://gitlab.com/hutson/conventional-gitlab-releaser/badges/master/build.svg)](https://gitlab.com/hutson/conventional-gitlab-releaser/commits/master)
[![codecov.io](https://codecov.io/gitlab/hutson/conventional-gitlab-releaser/coverage.svg?branch=master)](https://codecov.io/gitlab/hutson/conventional-gitlab-releaser?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.gitlab.io/cz-cli/)

> Make a new GitLab release from git metadata

**Note** You don't have to use the angular commit convention. For the best result of the tool to tokenize you commit and produce flexible output, it's recommended to use a commit convention.

## Quick start

[Set up a token first](#setup-token-for-cli).

```sh
$ npm install -g conventional-gitlab-releaser
$ cd my-project
$ conventional-gitlab-releaser -p angular
```

The above generates a GitLab Release based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

If you first time use this tool and want to generate all previous releases, you could do

```sh
$ conventional-gitlab-releaser -p angular -r 0
```

This will *not* overwrite the releases you have already made. Read ["Regenerate all the releases"](#regenerate-all-the-releases) section if you want to.

All available command line parameters can be listed using [CLI](#cli) : `conventional-gitlab-releaser --help`.

**Hint:** You can alias your command or add it to your package.json. EG: `"gitlab-release": "conventional-gitlab-releaser -p angular -r 0"`.

## Example output

- https://github.com/conventional-changelog/conventional-github-releaser/releases
- https://github.com/conventional-changelog/conventional-changelog/releases

### Recommended workflow

1. Make changes
2. Commit those changes
3. Make sure GitLab CI turns green
4. Bump version in `package.json`
5. Commit `package.json` files
6. Tag
7. Push
8. `conventionalGitlabReleaser`

You have to have a tag on GitLab to make a release. hence `gitRawCommitsOpts.to` defaults to the latest semver tag.

Please use this [gist](https://gist.github.com/stevemao/280ef22ee861323993a0) to make a release or change it to your needs.

## Why

- Based on [conventional-changelog](https://github.com/ajoslin/conventional-changelog) but GitLab releases are more elegant.
- Easy fully automate changelog generation. You could still add more points on top of it.
- Detecting prerelease based on semver, ignoring reverted commits, templating with [handlebars.js](https://github.com/wycats/handlebars.js) and links to references, etc. Open an [issue](../../issues/new) if you want more reasonable features.
- Intelligently setup defaults but yet fully configurable with presets of [popular projects](https://github.com/ajoslin/conventional-changelog#preset).
- Everything internally or externally is pluggable.
- A lot of tests and actively maintained.

## Programmatic Usage

```sh
$ npm install --save conventional-gitlab-releaser
```

```js
var conventionalGitlabReleaser = require('conventional-gitlab-releaser');

var AUTH = {
  url: 'https://gitlab.com',,
  token: '0126af95c0e2d9b0a7c78738c4c00a860b04acc8'// change this to your own GitLab token or use an environment variable
};

conventionalGitlabReleaser(AUTH, {
  preset: 'angular'
}, callback);
```

## API

### conventionalGitlabReleaser(auth, [changelogOpts, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]], callback)

#### auth

An auth object passed to [node-gitlab](https://github.com/node-gitlab/node-gitlab).

#### callback

##### callback(err, responses)

###### responses

Type: `array`

An array of responses returned by `gitlab.projects.repository.addTag` calls.

Please check [conventional-changelog](https://github.com/ajoslin/conventional-changelog#api) for other arguments.

There are some changes:

#### changelogOpts

##### transform

Default: grab the whole tag for the version (including a leading v) and format date.

##### releaseCount

Default: `1`

How many releases of changelog you want to generate. It counts from the latest semver tag. Useful when you forgot to generate any previous releases. Set to `0` to regenerate all.

#### gitRawCommitsOpts

##### from

Default: based on `options.releaseCount`.

##### to

Default: latest semver tag

#### writerOpts

##### includeDetails

It is always `true`.

##### headerPartial

Default: `''`

Default header contains the version and date which are already in the release.

## CLI

```sh
$ npm install --global conventional-gitlab-releaser
$ conventional-gitlab-releaser --help # for more details
```

You can supply your auth token by a flag `-t` or `--token`. You can also set up an environment variable `CONVENTIONAL_GITLAB_RELEASER_TOKEN` to avoid typing your token every time.

Note: If all results error, it will print the error messages to stderr and exit with code `1`.

## Setup token for cli

[Get your token](https://gitlab.com/profile/account) and set your environment variable `CONVENTIONAL_GITLAB_RELEASER_TOKEN` to the token you just created. You can google [How to set environment variable](https://www.google.com.au/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=how%20to%20set%20environment%20variable).

## Related

- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog-cli) - Generate a changelog from git metadata
- [conventional-recommended-bump](https://github.com/conventional-changelog/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [conventional-commits-detector](https://github.com/conventional-changelog/conventional-commits-detector) - Detect what commit message convention your repository is using

## License

MIT © [Steve Mao](https://github.com/stevemao)

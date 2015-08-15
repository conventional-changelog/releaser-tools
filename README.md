#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Make a new GitHub release from git metadata

[Synopsis of Conventions](https://github.com/ajoslin/conventional-changelog/tree/master/conventions)


## Quick start

[Set up a token first](#setup-token-for-cli).

```sh
$ npm install -g conventional-github-releaser
$ cd my-project
$ conventional-github-releaser -p angular
```

The above generates a GitHub Release based on commits since the last semver tag that match the pattern of a "Feature", "Fix", "Performance Improvement" or "Breaking Changes".

**Hint:** You can alias your command or add it to your package.json. EG: `"github-release": "conventional-github-releaser -p angular -r 0"`.

Or use one of the plugins if you are already using the tool:  [grunt](https://github.com/stevemao/grunt-conventional-github-releaser)/[atom](https://github.com/stevemao/atom-conventional-changelog)


### Recommended workflow

1. Make changes
2. Commit those changes
3. Make sure Travis turns green
4. Bump version in `package.json`
5. Commit `package.json` files
6. Tag
7. Push
8. `conventionalGithubReleaser`

You have to have a tag on GitHub to make a release. hence `gitRawCommitsOpts.to` defaults to the latest semver tag.

Please use this [gist](https://gist.github.com/stevemao/280ef22ee861323993a0) to make a release or change it to your needs.


## Example output

- https://github.com/stevemao/conventional-github-releaser/releases
- https://github.com/ajoslin/conventional-changelog/releases


## Why

- Based on [conventional-changelog](https://github.com/ajoslin/conventional-changelog) but GitHub releases are more elegant.
- Detecting prerelease based on semver, ignoring reverted commits, templating with [handlebars.js](https://github.com/wycats/handlebars.js) and links to references, etc. Open an [issue](../../issues/new) if you want more reasonable features.
- Intelligently setup defaults but you can still modify them to your needs.
- Fully configurable. There are [many presets](https://github.com/ajoslin/conventional-changelog/tree/master/presets) that you can use if you just want to use the same conventions. But it is also possible to configure if you want to go down to the nth degree.
- Everything internally or externally is pluggable.
- High performant. It doesn't spawn any extra child process to fetch data.
- A lot of tests and actively maintained.


## Programmatic Usage

```sh
$ npm install --save conventional-github-releaser
```

```js
var conventionalGithubReleaser = require('conventional-github-releaser');

var AUTH = {
  type: "oauth",
  token: '0126af95c0e2d9b0a7c78738c4c00a860b04acc8'// change this to your own GitHub token or use an environment variable
};

conventionalGithubReleaser(AUTH, {
  preset: 'angular'
}, callback);
```


## API

### conventionalGithubReleaser(auth, [changelogOpts, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]], callback)

#### auth

An auth object passed to [node-github](https://github.com/mikedeboer/node-github#authentication).

#### callback

##### callback(err, responses)

###### responses

Type: `array`

An array of responses returned by `github.releases.createRelease` calls.

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

If there is any preset, this defaults to `''` because header in presets usually contains the version and date which are already in the release.


## CLI

```sh
$ npm install --global conventional-github-releaser
$ conventional-github-releaser --help # for more details
```

You can supply your auth token by a flag `-t` or `--token`. You can also set up an environment variable `CONVENTIONAL_GITHUB_RELEASER_TOKEN` to avoid typing your token every time.


## Regenerate all the releases

Use [github-remove-all-releases](https://github.com/stevemao/github-remove-all-releases) to remove all releases and set `changelogOpts.allBlocks` to `true` to regenerate.


## Setup token for cli

[Create a new token](https://github.com/settings/tokens/new) and set your environment variable `CONVENTIONAL_GITHUB_RELEASER_TOKEN` to the token you just created. You can google [How to set environment variable](https://www.google.com.au/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=how%20to%20set%20environment%20variable). The scopes for the token you need is `public_repo` or `repo` (if you need to access private repos). [More details](https://developer.github.com/v3/oauth/#scopes).


## Related

- [conventional-changelog](https://github.com/ajoslin/conventional-changelog) - Generate a changelog from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [github-remove-all-releases](https://github.com/stevemao/github-remove-all-releases) - Remove all releases of your GitHub repo
- [conventional-commits-detector](https://github.com/stevemao/conventional-commits-detector) - Detect what commit message convention your repository is using


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/conventional-github-releaser.svg
[npm-url]: https://npmjs.org/package/conventional-github-releaser
[travis-image]: https://travis-ci.org/stevemao/conventional-github-releaser.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-github-releaser
[daviddm-image]: https://david-dm.org/stevemao/conventional-github-releaser.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stevemao/conventional-github-releaser
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-github-releaser/badge.svg
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-github-releaser

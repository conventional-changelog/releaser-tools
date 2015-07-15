#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Make a new GitHub release from git metadata


## Install

```sh
$ npm install --save conventional-github-releaser
```


## Usage

```js
var conventionalGithubReleaser = require('conventional-github-releaser');

var AUTH = {
  type: "oauth",
  token: '0126af95c0e2d9b0a7c78738c4c00a860b04acc8'
};

conventionalGithubReleaser(AUTH, options, changelogOpts, context, gitRawCommitsOpts, parserOpts, writerOpts, callback);
```

```sh
$ npm install --global conventional-github-releaser
$ conventional-github-releaser --help

  Make a new GitHub release from git metadata

  Usage
    conventional-github-releaser

  Example
    conventional-github-releaser -p angular

  Options
    -t, --token               Your auth token
    -n, --no-prefix-v         Prefix versions with a "v" if not already prefixed
    -p, --preset              Name of the preset you want to use
    -k, --pkg                 A filepath of where your package.json is located
    -b, --all-blocks          Generate all blocks
    -v, --verbose             Verbose output
    -c, --context             A filepath of a javascript that is used to define template variables
    --git-raw-commits-opts    A filepath of a javascript that is used to define git-raw-commits options
    --parser-opts             A filepath of a javascript that is used to define conventional-commits-parser options
    --writer-opts             A filepath of a javascript that is used to define conventional-changelog-writer options
```


## API

### conventionalGithubReleaser(auth, [options, [context, [gitRawCommitsOpts, [parserOpts, [writerOpts]]]]], callback)

#### auth

An auth object passed to [node-github](https://github.com/mikedeboer/node-github#authentication).

#### options

##### prefixV

Type: `string` Default: `true`

Prefix versions with a `'v'` if not already prefixed.

#### callback

##### callback(err, responses)

###### responses

Type: `array`

An array of responses returned by `github.releases.createRelease` calls.

Please check [conventional-changelog](https://github.com/ajoslin/conventional-changelog) for other arguments.

There are some changes:

#### writerOpts

##### includeDetails

It is always `true`.


## CLI

You can supply your auth token by a flag `-t` or `--token`. You can also set up an environment variable `CONVENTIONAL_GITHUB_RELEASER_TOKEN` to avoid typing your token every time.


## FAQ

### How can I regenerate all the releases?

Use [github-remove-all-releases](https://github.com/stevemao/github-remove-all-releases) to remove all releases and set `changelogOpts.allBlocks` to `true` to regenerate.

### How do I setup my token for cli?

[Create a new token](https://github.com/settings/tokens/new) and set your environment variable `CONVENTIONAL_GITHUB_RELEASER_TOKEN` to the token you just created. You can google [How to set environment variable](https://www.google.com.au/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=how%20to%20set%20environment%20variable)


## Related

- [conventional-changelog](https://github.com/ajoslin/conventional-changelog) - Generate a changelog from git metadata
- [conventional-recommended-bump](https://github.com/stevemao/conventional-recommended-bump) - Get a recommended version bump based on conventional commits
- [github-remove-all-releases](https://github.com/stevemao/github-remove-all-releases) - Remove all releases of your GitHub repo


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

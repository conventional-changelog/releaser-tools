#!/usr/bin/env node
'use strict';
var meow = require('meow');
var conventionalGithubReleaser = require('./');

var cli = meow({
  help: [
    'Usage',
    '  conventional-github-releaser',
    '',
    'Example',
    '  conventional-github-releaser -p angular',
    '',
    'Options',
    '  -t, --token               Your auth token',
    '  -p, --preset              Name of the preset you want to use',
    '  -k, --pkg                 A filepath of where your package.json is located',
    '  -r, --release-count       How many releases to be generated from the latest',
    '  -v, --verbose             Verbose output',
    '  -c, --context             A filepath of a javascript that is used to define template variables',
    '  --git-raw-commits-opts    A filepath of a javascript that is used to define git-raw-commits options',
    '  --parser-opts             A filepath of a javascript that is used to define conventional-commits-parser options',
    '  --writer-opts             A filepath of a javascript that is used to define conventional-changelog-writer options'
  ]
}, {
  alias: {
    t: 'token',
    p: 'preset',
    k: 'pkg',
    r: 'releaseCount',
    v: 'verbose',
    c: 'context'
  }
});

var flags = cli.flags;

var warn;
var templateContext;
var gitRawCommitsOpts;
var parserOpts;
var writerOpts;

try {
  if (flags.context) {
    templateContext = require(flags.context);
  }

  if (flags.gitRawCommitsOpts) {
    gitRawCommitsOpts = require(flags.gitRawCommitsOpts);
  }

  if (flags.parserOpts) {
    parserOpts = require(flags.parserOpts);
  }

  if (flags.writerOpts) {
    writerOpts = require(flags.writerOpts);
  }
} catch (err) {
  console.error('Failed to get file. ' + err);
  process.exit(1);
}

if (flags.verbose) {
  warn = console.warn.bind(console);
}

conventionalGithubReleaser({
  type: 'oauth',
  token: flags.token || process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
}, {
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  releaseCount: flags.releaseCount,
  warn: warn
}, templateContext, gitRawCommitsOpts, parserOpts, writerOpts, function(err, data) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  if (flags.verbose) {
    console.log(data);
  }
});

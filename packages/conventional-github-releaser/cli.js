#!/usr/bin/env node
'use strict';
var meow = require('meow');
var conventionalGithubReleaser = require('./');
var resolve = require('path').resolve;

var cli = meow({
  help: [
    'Usage',
    '  conventional-github-releaser',
    '',
    'Example',
    '  conventional-github-releaser -p angular',
    '',
    'Options',
    '  -t, --token               Your GitHub auth token',
    '',
    '  -p, --preset              Name of the preset you want to use. Must be one of the following:',
    '                            angular, atom, codemirror, ember, eslint, express, jquery, jscs or jshint',
    '',
    '  -k, --pkg                 A filepath of where your package.json is located',
    '                            Default is the closest package.json from cwd',
    '',
    '  -r, --release-count       How many releases to be generated from the latest',
    '                            If 0, the whole changelog will be regenerated and the outfile will be overwritten',
    '                            Default: 1',
    '',
    '  -v, --verbose             Verbose output. Use this for debugging',
    '                            Default: false',
    '',
    '  -n, --config              A filepath of your config script',
    '                            Example of a config script: https://github.com/conventional-changelog/conventional-changelog-angular/blob/master/index.js',
    '',
    '  -c, --context             A filepath of a javascript that is used to define template variables'
  ]
}, {
  alias: {
    t: 'token',
    p: 'preset',
    k: 'pkg',
    r: 'releaseCount',
    v: 'verbose',
    n: 'config',
    c: 'context'
  }
});

var config;
var flags = cli.flags;

var templateContext;
var gitRawCommitsOpts;
var parserOpts;
var writerOpts;

try {
  if (flags.context) {
    templateContext = require(resolve(process.cwd(), flags.context));
  }

  if (flags.config) {
    config = require(resolve(process.cwd(), flags.config));
  } else {
    config = {};
  }

  if (config.gitRawCommitsOpts) {
    gitRawCommitsOpts = config.gitRawCommitsOpts;
  }

  if (config.parserOpts) {
    parserOpts = config.parserOpts;
  }

  if (config.writerOpts) {
    writerOpts = config.writerOpts;
  }
} catch (err) {
  console.error('Failed to get file. ' + err);
  process.exit(1);
}

var changelogOpts = {
  preset: flags.preset,
  pkg: {
    path: flags.pkg
  },
  releaseCount: flags.releaseCount
};

if (flags.verbose) {
  changelogOpts.debug = console.info.bind(console);
  changelogOpts.warn = console.warn.bind(console);
}

conventionalGithubReleaser({
  type: 'oauth',
  token: flags.token || process.env.CONVENTIONAL_GITHUB_RELEASER_TOKEN
}, changelogOpts, templateContext, gitRawCommitsOpts, parserOpts, writerOpts, function(err, data) {
  if (err) {
    console.error(err.toString());
    process.exit(1);
  }

  var allRejected = true;

  for (var i = data.length - 1; i >= 0 ; i--) {
    if (data[i].state === 'fulfilled') {
      allRejected = false;
      break;
    }
  }

  if (allRejected) {
    console.error(data);
    process.exit(1);
  } else if (flags.verbose) {
    console.log(data);
  }
});

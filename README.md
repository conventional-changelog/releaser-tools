# releaser-tools

[![CircleCI](https://circleci.com/gh/conventional-changelog/releaser-tools.svg?style=svg)](https://circleci.com/gh/conventional-changelog/releaser-tools)
[![codecov.io](https://codecov.io/gh/conventional-changelog/releaser-tools/coverage.svg?branch=master)](https://codecov.io/gh/conventional-changelog/releaser-tools?branch=master)
[![Join the chat at https://gitter.im/conventional-changelog/conventional-github-releaser](https://badges.gitter.im/conventional-changelog/conventional-github-releaser.svg)](https://gitter.im/conventional-changelog/conventional-github-releaser)

> Create a GitHub/GitLab/etc. release using your project's Git metadata.

## GitHub Release Tool

* [npm package](https://www.npmjs.com/package/conventional-github-releaser)
* [GitHub repository](https://github.com/conventional-changelog/releaser-tools/tree/master/packages/conventional-github-releaser)

## GitLab Release Tool

* [npm package](https://www.npmjs.com/package/conventional-gitlab-releaser)
* [GitHub repository](https://github.com/conventional-changelog/releaser-tools/tree/master/packages/conventional-gitlab-releaser)

## Node Support Policy

We only support [Long-Term Support](https://github.com/nodejs/Release) versions of Node.

We specifically limit our support to LTS versions of Node, not because this package won't work on other versions, but because we have a limited amount of time, and supporting LTS offers the greatest return on that investment.

It's possible this package will work correctly on newer versions of Node. It may even be possible to use this package on older versions of Node, though that's more unlikely as we'll make every effort to take advantage of features available in the oldest LTS version we support.

As each Node LTS version reaches its end-of-life we will remove that version from the `node` `engines` property of our package's `package.json` file. Removing a Node version is considered a breaking change and will entail the publishing of a new major version of this package. We will not accept any requests to support an end-of-life version of Node. Any merge requests or issues supporting an end-of-life version of Node will be closed.

We will accept code that allows this package to run on newer, non-LTS, versions of Node. Furthermore, we will attempt to ensure our own changes work on the latest version of Node. To help in that commitment, our continuous integration setup runs against all LTS versions of Node in addition the most recent Node release; called _current_.

JavaScript package managers should allow you to install this package with any version of Node, with, at most, a warning if your version of Node does not fall within the range specified by our `node` `engines` property. If you encounter issues installing this package, please report the issue to your package manager.

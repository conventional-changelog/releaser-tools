# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

      <a name="4.0.0"></a>
# [4.0.0](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@3.2.0...conventional-gitlab-releaser@4.0.0) (2018-09-23)


### Bug Fixes

* **gitlab:** use correct package name for debug ([9199bdc](https://github.com/conventional-changelog/releaser-tools/commit/9199bdc))


### Code Refactoring

* require the full API URL to be provided ([37cc686](https://github.com/conventional-changelog/releaser-tools/commit/37cc686))


### BREAKING CHANGES

* If passing an AUTH object directly, as shown below, please make sure to
pass the full API URL:

```
var conventionalGitlabReleaser = require('conventional-gitlab-releaser');

var AUTH = {
url: 'https://gitlab.com/api/v4',
token: '0126af95c0e2d9b0a7c78738c4c00a860b04acc8'
};

conventionalGitlabReleaser(AUTH, {
preset: 'angular'
}, callback);
```




      <a name="3.2.0"></a>
# [3.2.0](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@3.1.1...conventional-gitlab-releaser@3.2.0) (2018-06-08)


### Bug Fixes

* use correct API endpoints ([1571452](https://github.com/conventional-changelog/releaser-tools/commit/1571452))


### Features

* **gitlab:** output debug info ([a541468](https://github.com/conventional-changelog/releaser-tools/commit/a541468))




<a name="3.1.1"></a>
## [3.1.1](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@3.1.0...conventional-gitlab-releaser@3.1.1) (2018-06-06)


### Bug Fixes

* **cli:** add default values to flags ([c4bb0db](https://github.com/conventional-changelog/releaser-tools/commit/c4bb0db))
* **cli:** add type values to flags ([de16925](https://github.com/conventional-changelog/releaser-tools/commit/de16925))
* **cli:** use correct default url for Gitlab ([e88d98d](https://github.com/conventional-changelog/releaser-tools/commit/e88d98d))
* **cli:** use flags property grouped by flag name ([c0ee6df](https://github.com/conventional-changelog/releaser-tools/commit/c0ee6df))
* use environment variables as defaults ([ec5157f](https://github.com/conventional-changelog/releaser-tools/commit/ec5157f))




<a name="3.1.0"></a>
# [3.1.0](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@3.0.0...conventional-gitlab-releaser@3.1.0) (2018-05-31)


### Features

* **github:** output debug info ([a1ab945](https://github.com/conventional-changelog/releaser-tools/commit/a1ab945)), closes [#67](https://github.com/conventional-changelog/releaser-tools/issues/67)




<a name="3.0.0"></a>
# [3.0.0](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@2.1.30...conventional-gitlab-releaser@3.0.0) (2018-05-29)


*  chore(package): set Node requirement to oldest supported LTS (#329) ([3259357](https://github.com/conventional-changelog/releaser-tools/commit/3259357)), closes [#329](https://github.com/conventional-changelog/releaser-tools/issues/329)


### BREAKING CHANGES

* Set the package's minimum required Node version to be the oldest LTS
currently supported by the Node Release working group. At this time,
that is Node 6 (which is in its Maintenance LTS phase).




<a name="2.1.30"></a>
## [2.1.30](https://github.com/conventional-changelog/releaser-tools/compare/conventional-gitlab-releaser@2.1.29...conventional-gitlab-releaser@2.1.30) (2018-03-19)




**Note:** Version bump only for package conventional-gitlab-releaser

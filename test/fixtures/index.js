module.exports.repo = {
  owner: 'stevemaotest',
  name: 'conventional-github-releaser-test',
  pkg: {path: __dirname + '/_package.json'}
};

module.exports.auth = {
  type: 'oauth',
  token: process.env.TEST_CONVENTIONAL_GITHUB_RELEASER_TOKEN
};

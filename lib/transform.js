'use strict';

var dateFormat = require('dateformat');
var findVersions = require('find-versions');

function transform(chunk, cb) {
  if (typeof chunk.gitTags === 'string') {
    chunk.version = findVersions(chunk.gitTags)[0];
  }

  if (chunk.committerDate) {
    chunk.committerDate = dateFormat(chunk.committerDate, 'yyyy-mm-dd', true);
  }

  cb(null, chunk);
}

module.exports = transform;

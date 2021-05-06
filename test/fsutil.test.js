const assert = require('assert');
const path = require('path');

const { fsutil } = require('../util/fsutil');

fsutil.setOutputDir('/path/to/output');

describe('getContentSlug', function () {
  const doc = { id: 99, title: 'Hello world' };
  assert.strictEqual(fsutil.getContentSlug(doc), 'hello-world-99');
});

describe('getDataPath', function () {
  assert.strictEqual(
    fsutil.getDataPath('nav'),
    path.join('/path/to/output/data', 'nav.yaml'),
  );
});

describe('getContentPath', function () {
  const doc = {
    id: 99,
    title: 'Hello world',
    category: { path: 'introduction' },
  };
  assert.strictEqual(
    fsutil.getContentPath('document', doc),
    path.join(
      '/path/to/output/content/document/introduction',
      'hello-world-99.md',
    ),
  );
});

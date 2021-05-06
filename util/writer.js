const path = require('path');
const fs = require('fs');

const objectScan = require('object-scan');
const slugify = require('slugify');
const yaml = require('yaml');

const { fsutil } = require('./fsutil');

const _field = {
  id: '',
  sites: '', // not support now
  category: '',
  created_by: '',
  updated_by: '',

  // Media
  alternativeText: '',
  caption: '',
  ext: '',
  formats: '',
  hash: '',
  height: '',
  mime: '',
  previewUrl: '',
  provider: '',
  provider_metadata: '',
  size: '',
  width: '',

  // '\w+.date': '',
  // '\w+.created_at': '',

  created_at: 'date',
  updated_at: 'lastmod',
  published_at: 'publishdate',
};

function Writer() {
  this._outputDir = process.env.OUTPUT_DIR;
}

Writer.prototype.normalize = function (result) {
  const doc = JSON.parse(JSON.stringify(result)); // deep copy
  for ([k, v] of Object.entries(_field)) {
    objectScan([`**.${k}`], {
      filterFn: function ({ parent, property }) {
        if (v != '') {
          parent[v] = parent[property];
        }

        delete parent[property];
      },
    })(doc);
  }

  // Tags
  if (doc.tags) {
    doc.tags = doc.tags.map((e) => e.title);
  }

  // Contributors
  if (doc.contributors) {
    doc.contributors = doc.contributors.map((e) => e.title);
  }

  return doc;
};

Writer.prototype.writeCategory = function (result) {
  const frontmatter = {
    title: result.title,
    menu: {
      document: {
        parent: result.parent ?? '',
      },
    },
    data: result.created_at,
    lastmod: result.lastmod,
  };

  buf = [];
  buf.push('---\n');
  buf.push(yaml.stringify(frontmatter, { sortMapEntries: true }));
  buf.push('---\n\n');

  if (result.content) {
    buf.push(result.content);
  }

  fsutil.writeCategory(result, buf.join(''));
};

Writer.prototype.writeData = function (name, result) {
  const doc = this.normalize(result);
  fsutil.writeData(name, yaml.stringify(doc, { sortMapEntries: true }));
};

Writer.prototype.writeContent = function (section, result) {
  const doc = this.normalize(result);
  const frontmatter = {};
  for ([k, v] of Object.entries(doc)) {
    if (k !== 'content') {
      frontmatter[k] = v;
    }
  }

  buf = [];
  buf.push('---\n');
  buf.push(yaml.stringify(frontmatter, { sortMapEntries: true }));
  buf.push('---\n\n');

  if (doc.content) {
    buf.push(doc.content);
  }

  fsutil.writeContent(section, result, buf.join(''));
};

module.exports = {
  writer: new Writer(),
};

const objectScan = require('object-scan');
const yaml = require('yaml');

const { fsutil } = require('./fsutil');

const _field = {
  id: '',
  webs: '', // not support now
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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
Writer.prototype.deepClone = function (result) {
  return JSON.parse(JSON.stringify(result));
};

Writer.prototype.normalize = function (result) {
  const doc = JSON.parse(JSON.stringify(result)); // deep copy

  // Tags
  if (doc.tags) {
    doc.tags = doc.tags.map((e) => e.title);
  }

  // // Creator
  // if (doc.created_by) {
  //   const { firstname, lastname, email } = doc.created_by;
  //   doc.createdby = { firstname, lastname, email };
  //   delete doc.created_by;
  // }

  // // Updater
  // if (doc.updated_by) {
  //   const { firstname, lastname, email } = doc.updated_by;
  //   doc.updatedby = { firstname, lastname, email };
  //   delete doc.updated_by;
  // }

  // Authors
  doc.authors = [];
  if (doc.created_by) {
    const { id, firstname } = doc.created_by;
    doc.authors.push(`${firstname}-${id}`);
  }
  if (doc.updated_by) {
    const { id, firstname } = doc.updated_by;
    doc.authors.push(`${firstname}-${id}`);
  }

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

  return doc;
};

Writer.prototype.getMarkdown = function (result) {
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

  return buf.join('');
};

Writer.prototype.writeCategory = function (section, result) {
  const buf = this.getMarkdown(result);
  fsutil.writeCategory(section, result, buf);
};

Writer.prototype.writeData = function (name, result) {
  const doc = this.normalize(result);
  fsutil.writeData(name, yaml.stringify(doc, { sortMapEntries: true }));
};

Writer.prototype.writeContent = function (section, result) {
  const buf = this.getMarkdown(result);
  fsutil.writeContent(section, result, buf);
};

module.exports = {
  writer: new Writer(),
};

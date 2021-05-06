const path = require('path');
const fs = require('fs');

const slugify = require('slugify');

const { builder } = require('./builder');

function FSUtil() {
  this._outputDir = process.env.OUTPUT_DIR;
}

FSUtil.prototype.setOutputDir = function (value) {
  this._outputDir = value;
};

FSUtil.prototype.getContentSlug = function (doc) {
  return `${slugify(doc.title, { lower: true })}-${doc.id}`;
};

FSUtil.prototype.getCategoryPath = function (doc) {
  const parent = doc.parent?.path ?? '';
  return path.join(this._outputDir, 'content', 'document', parent, doc.path);
};

FSUtil.prototype.getDataPath = function (name) {
  return path.join(this._outputDir, 'data', `${name}.yaml`);
};

FSUtil.prototype.getContentDir = function (section, doc) {
  const parent = doc?.category?.path ?? '';
  return path.join(this._outputDir, 'content', section, parent);
};

FSUtil.prototype.getContentPath = function (section, doc) {
  return path.join(
    this.getContentDir(section, doc),
    `${this.getContentSlug(doc)}.md`,
  );
};

FSUtil.prototype.rmData = function (name) {
  const p = this.getDataPath(name);
  if (fs.existsSync(p)) {
    fs.rmSync(p);
  }

  builder.queueBuild();
};

FSUtil.prototype.rmContent = function (section, doc) {
  if (doc) {
    const p = this.getContentPath(section, doc);
    if (fs.existsSync(p)) {
      fs.rmSync(p);
    }
  }

  builder.queueBuild();
};

FSUtil.prototype.renameCategory = function (old, doc) {
  if (old) {
    const p = this.getCategoryPath(old);
    if (fs.existsSync(p)) {
      fs.renameSync(p, this.getCategoryPath(doc));
    }
  }

  builder.queueBuild();
};

FSUtil.prototype.writeCategory = function (doc, data) {
  const dir = this.getCategoryPath(doc);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(path.join(dir, '_index.md'), data);
  builder.queueBuild();
};

FSUtil.prototype.writeData = function (name, data) {
  fs.writeFileSync(this.getDataPath(name), data);
  builder.queueBuild();
};

FSUtil.prototype.writeContent = function (section, doc, data) {
  const dir = this.getContentDir(section, doc);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(this.getContentPath(section, doc), data);
  builder.queueBuild();
};

module.exports = {
  fsutil: new FSUtil(),
};

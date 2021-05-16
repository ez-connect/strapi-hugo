const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil } = require('./fsutil');
const { writer } = require('./writer');

const ContentType = {
  category: 1,
  collection: 2,
  single: 3,
};

ModelLifeCycle.createLifeCycles = (content, type, section, updaterFn = null) => {
  const _lifecycle = new ModelLifeCycle(content, type, section, updaterFn);
  return {
    afterCreate: async (result, data) => {
      _lifecycle.afterCreate(result, data);
    },
    beforeUpdate: async (params, data) => {
      _lifecycle.beforeUpdate(params, data);
    },
    afterUpdate: async (result, params, data) => {
      _lifecycle.afterUpdate(result, params, data);
    },
    afterDelete: (result, params) => {
      _lifecycle.afterDelete(result, params);
    },
  };
};

function ModelLifeCycle(content, type, section, updaterFn = null) {
  this._content = content;
  this._type = type;
  this._section = section;
  this._updaterFn = updaterFn; // update model & result callback

  this._before = null;
}

ModelLifeCycle.prototype._save = function (result) {
  if (isDraft(result, strapi.models[this._content])) return;
  switch (this._type) {
    case ContentType.collection:
      return writer.writeContent(this._section, result);
    case ContentType.single:
      return writer.writeData(this._section, result);
    case ContentType.category:
      return writer.writeCategory(this._section, result);
    default:
      throw new Error('Not implemented yet');
  }
};

ModelLifeCycle.prototype.getBefore = function () {
  return this._before;
};

ModelLifeCycle.prototype.afterCreate = function (result, _data) {
  const data = this._updaterFn ? this._updaterFn(result) :  result;
  this._save(data);
};

ModelLifeCycle.prototype.beforeUpdate = async function (params, _data) {
  let ctx = { params };
  if (this._type != ContentType.single) {
    this._before = await strapi.controllers[this._content].findOne(ctx); // previous version, `data` params is the new one
  }
  fsutil.rmContent(this._section, this._before);
};

ModelLifeCycle.prototype.afterUpdate = function (result, _params, _data) {
  const data = this._updaterFn ? this._updaterFn(result) :  result;
  this._save(data);
};

ModelLifeCycle.prototype.afterDelete = function (result, _params) {
  fsutil.rmContent(this._section, result);
};

module.exports = {
  ContentType,
  ModelLifeCycle,
};

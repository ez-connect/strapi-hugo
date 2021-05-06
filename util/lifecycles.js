const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil } = require('./fsutil');
const { writer } = require('./writer');

ModelLifeCycle.create = function(content, section) {
  const _lifecycle = new ModelLifeCycle(content, section);
  return {
    afterCreate: async (result, data) => {
      _lifecycle.afterUpdate(result, data);
    },
    beforeUpdate: async (params, data) => {
      _lifecycle.beforeUpdate(params, data);
    },
    afterUpdate: async (result, params, data) => {
      _lifecycle.afterCreate(params, data);
    },
  };
};

function ModelLifeCycle(content, section) {
  this._content = content;
  this._section = section;

  this._before = null;
}

ModelLifeCycle.prototype._save = function (result, data) {
  if (isDraft(result, strapi.models[this._content])) return;
  writer.writeContent(this._section, result);
};

ModelLifeCycle.prototype.afterCreate = function (result, data) {
  this._save(result);
};

ModelLifeCycle.prototype.beforeUpdate = async function (params, data) {
  let ctx = { params };
  this._before = await strapi.controllers[this._content].findOne(ctx); // previous version, `data` params is the new one
  fsutil.rmContent(this._section, this._before);
};

ModelLifeCycle.prototype.afterUpdate = function (result, params, data) {
  this._save(result);
};

module.exports = {
  ModelLifeCycle,
};

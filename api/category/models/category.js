'use strict';

const {
  ContentType,
  ModelLifeCycle,
  fsutil,
  writer,
} = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const _lifecycle = new ModelLifeCycle(
  'category',
  ContentType.category,
  'document',
);

function _addMenu(result) {
  result.menu = {
    document: {
      parent: result.category?.title ?? '',
    },
  };
}

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      _addMenu(result);
      _lifecycle.afterCreate(result, data);
    },
    beforeUpdate: async (params, data) => {
      _lifecycle.beforeUpdate(params, data); // can't bind this
    },
    afterUpdate: async (result, params, data) => {
      const before = _lifecycle.getBefore();
      if (before && before.path != result.path) {
        console.log('Update category path:', before.path, result.path);
        fsutil.renameCategory('document', before, result);

        // Update
        if (before && before.path != result.path) {
          const ctx = { params: { category: result.id } };
          let docs = await strapi.controllers.document.find(ctx);

          for (const doc of docs) {
            writer.writeContent('document', doc);
          }
        }
      }

      _addMenu(result);
      _lifecycle.afterUpdate(result, params, data);
    },
  },
};

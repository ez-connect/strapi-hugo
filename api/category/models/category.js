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

const _lifecycle = new ModelLifeCycle({
  content: 'category',
  type: ContentType.category,
  section: 'document',
});

function _addMenu(result) {
  result.menu = {
    document: {
      parent: result.parent?.title ?? '',
    },
  };
}

function _addDocumentMenu(result) {
  const category = result.category;
  result.menu = {
    document: {
      parent: category?.title ?? '',
      identifier: result.id,
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
      if (!before) return;

      const isParentChanged = before.parent != result.parent;
      const isPathChanged = before.path != result.path;
      if (isParentChanged) {
        console.log('Update category parent:', before.parent, result.parent);
      }

      if (isParentChanged || isPathChanged) {
        console.log('Update document paths');
        fsutil.rmCategory('document', before, result);

        // Update
        const ctx = { params: { category: result.id } };
        let docs = await strapi.controllers.document.find(ctx);

        for (const doc of docs) {
          _addDocumentMenu(doc);
          writer.writeContent('document', doc);
        }
      }

      _addMenu(result);
      _lifecycle.afterUpdate(result, params, data);
    },
  },
};

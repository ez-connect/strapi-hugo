'use strict';

const { ContentType, ModelLifeCycle } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const _lifecycle = new ModelLifeCycle(
  'document',
  ContentType.collection,
  'document',
);

function _addMenu(result) {
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
    beforeUpdate: _lifecycle.beforeUpdate,

    afterUpdate: async (result, _params, data) => {
      _addMenu(result);
      _lifecycle.afterUpdate(result, data);
    },
  },
};

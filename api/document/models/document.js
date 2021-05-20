'use strict';

const { ContentType, ModelLifeCycle, writer } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// Add the menu prop
async function _update(result) {
  const data = writer.deepClone(result);
  const category = result.category;
  // It doesn't has `menu`, no need to copy
  data.menu = {
    document: {
      parent: category?.title ?? '',
      identifier: result.id,
    },
  };


  return data;
}

module.exports = {
  lifecycles: ModelLifeCycle.createLifeCycles({
    content: 'document',
    type: ContentType.collection,
    section: 'document',
    updaterFn: _update,
  }),
};

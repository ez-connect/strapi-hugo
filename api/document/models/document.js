'use strict';

const { ContentType, ModelLifeCycle } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

// Add the menu prop
function _update(result) {
  const category = result.category;
  // It doesn't has `menu`, no need to copy
  result.menu = {
    document: {
      parent: category?.title ?? '',
      identifier: result.id,
    },
  };

  return result;
}

module.exports = {
  lifecycles: ModelLifeCycle.createLifeCycles(
    'document',
    ContentType.collection,
    'document',
    _update,
  ),
};

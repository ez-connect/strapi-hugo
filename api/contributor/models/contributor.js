'use strict';

const { ContentType, ModelLifeCycle } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function _update(result) {
  const data = JSON.parse(JSON.stringify(result));
  data.title = result.user.firstname
  return data;
}

module.exports = {
  lifecycles: ModelLifeCycle.createLifeCycles(
    'contributor',
    ContentType.collection,
    'contributor',
    _update,
  ),
};

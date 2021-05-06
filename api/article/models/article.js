'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil, writer } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function _save(result) {
  if (isDraft(result, strapi.models.article)) return;
  writer.writeContent('blog', result);
}

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      _save(result);
    },
    beforeUpdate: async (params, data) => {
      let ctx = { params };
      const result = await strapi.controllers.article.findOne(ctx);
      fsutil.rmContent('blog', result);
    },
    afterUpdate: async (result, params, data) => {
      _save(result);
    },
  },
};

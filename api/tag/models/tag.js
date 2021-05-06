'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil, writer } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

var _before = null;

module.exports = {
  lifecycles: {
    beforeUpdate: async (params, data) => {
      let ctx = { params };
      _before = await strapi.controllers.tag.findOne(ctx);
    },
    afterUpdate: async (result, params, data) => {
      // Update
      if (_before && _before.title != result.title) {
        const ctx = { params: { tags_contains: result.id } };
        let docs = await strapi.controllers.article.find(ctx);

        for (const doc of docs) {
          writer.writeContent('blog', doc);
        }
      }
    },
  },
};

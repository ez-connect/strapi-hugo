'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil, writer } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

var _before = null;

function _save(result) {
  if (isDraft(result, strapi.models.contributor)) return;
  writer.writeContent('contributor', result);
}

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      _save(result);
    },
    beforeUpdate: async (params, data) => {
      let ctx = { params };
      const result = await strapi.controllers.contributor.findOne(ctx);
      fsutil.rmContent('contributor', result);
      _before = result;
    },
    afterUpdate: async (result, params, data) => {
      _save(result);

      // Update
      if (_before && _before.title != result.title) {
        const ctx = { params: { contributors_contains: result.id } };
        let docs = await strapi.controllers.document.find(ctx);

        for (const doc of docs) {
          writer.writeContent('document', doc);
        }

        docs = await strapi.controllers.article.find(ctx);

        for (const doc of docs) {
          writer.writeContent('blog', doc);
        }
      }
    },
  },
};

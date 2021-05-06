'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil } = require('../../../util/fsutil');
const { writer } = require('../../../util/writer');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

let _before; // the old document

function _save(result) {
  if (isDraft(result, strapi.models.category)) return;
  writer.writeCategory(result);
}

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      _save(result);
    },
    beforeUpdate: async (params, data) => {
      let ctx = { params };
      _before = await strapi.controllers.category.findOne(ctx);
    },

    afterUpdate: async (result, params, data) => {
      if (_before && _before.path != result.path) {
        console.log('Update category path:', _before.path, result.path);
        fsutil.renameCategory(_before, result);

        // Update
        if (_before && _before.path != result.path) {
          const ctx = { params: { category: result.id } };
          let docs = await strapi.controllers.document.find(ctx);

          for (const doc of docs) {
            writer.writeContent('document', doc);
          }
        }
      }

      _save(result);
    },
  },
};

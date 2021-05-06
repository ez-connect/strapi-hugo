'use strict';

const { isDraft } = require('strapi-utils').contentTypes;

const { fsutil, writer } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function _save(result) {
  if (isDraft(result, strapi.models.resume)) return;
  writer.writeContent('resume', result);
}

module.exports = {
  lifecycles: {
    afterCreate: async (result, data) => {
      _save(result);
    },
    beforeUpdate: async (params, data) => {
      let ctx = { params };
      const result = await strapi.controllers.resume.findOne(ctx);
      fsutil.rmContent('resume', result);
    },
    afterUpdate: async (result, params, data) => {
      _save(result);
    },
  },
};

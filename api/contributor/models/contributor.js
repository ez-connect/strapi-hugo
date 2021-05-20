'use strict';

const { ContentType, ModelLifeCycle } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

async function _update(result) {
  const data = JSON.parse(JSON.stringify(result));
  const { firstname, lastname, email } = data.user;
  data.title = firstname;
  data.id = result.user.id; // use user id
  data.user = { firstname, lastname, email };
  return data;
}

module.exports = {
  lifecycles: ModelLifeCycle.createLifeCycles({
    content: 'contributor',
    type: ContentType.collection,
    section: 'contributor',
    updaterFn: _update,
  }),
};

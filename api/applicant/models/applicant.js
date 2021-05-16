'use strict';

const { ContentType, ModelLifeCycle } = require('../../../util');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

function _update(result) {
  const data = JSON.parse(JSON.stringify(result)); // copy
  if (data.job) {
    data.job = data.job.title;
  }

  data.content = `## Applicant\n\n> - ${data.title}\n> - ${data.tel}\n> - ${data.email}\n\n${data.content}`;
  return data;
}

module.exports = {
  lifecycles: ModelLifeCycle.createLifeCycles(
    'applicant',
    ContentType.collection,
    'applicant',
    _update,
  ),
};

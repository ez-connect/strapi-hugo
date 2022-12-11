'use strict';

/**
 * index controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::index.index');

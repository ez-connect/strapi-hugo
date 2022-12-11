'use strict';

/**
 * index service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::index.index');

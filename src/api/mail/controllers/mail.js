'use strict';

/**
 * A set of functions called "actions" for `mail`
 */

module.exports = {
  // Webhook data
  send: async (ctx, next) => {
    const topic = ctx.request.body.model;
    const entry = ctx.request.body.entry;

    // Email template
    const template = await strapi.service('api::mail.mail').findOneTemplate(topic);
    if (!template) {
      throw new Error('template not found');
    }

    // console.log(template);

    const subscriptions = await strapi.service('api::mail.mail').findSubscriptions(topic);
    subscriptions.map((e) => {
      console.log('Send email to: ', e.email);
      // https://docs.strapi.io/developer-docs/latest/plugins/email.html#programmatic-usage
      strapi.plugins['email'].services.email.sendTemplatedEmail(
        {
          to: e.email,
          // from: is not specified, so it's the defaultFrom that will be used instead
        },
        template,
        {
          topic,
          entry,
        }
      );
    });

    ctx.body = subscriptions;
  }
};

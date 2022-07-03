'use strict';

/**
 * A set of functions called "actions" for `mail`
 */

module.exports = {
  // Webhook data
  send: async (ctx, next) => {
    const { event, model, entry } = ctx.request.body;
    // Should be trigger on publish, and create on some types only
    if (event === 'entry.create') {
      if (model != 'contact' && model !== 'applicant') {
        return next();
      }
    }
    // else if (event !== 'entry.publish') {
    //   return next();
    // }

    // Email template
    const template = await strapi.service('api::mail.mail').findOneTemplate(model);
    if (!template) {
      throw new Error('template not found');
    }

    // console.log(template);

    const subscriptions = await strapi.service('api::mail.mail').findSubscriptions(model);
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
          topic: model,
          entry,
        }
      );
    });

    ctx.body = subscriptions;
  }
};

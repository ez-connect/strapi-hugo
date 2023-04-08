import * as _ from 'lodash';

/**
 * A set of functions called "actions" for `mail`
 */

export default {
  // Webhook data
  send: async (ctx, next) => {
    const { event, model, entry } = ctx.request.body;
    // Email template
    const template = await strapi
      .service('api::mail.mail')
      .findOneTemplate(model);
    if (!template) {
      return next();
    }

    // console.log(template);

    // Should be trigger on publish, and create on some types only
    if (event !== template.event) {
      return next();
    }

    // Email data
    const { title, path } = entry.title;
    const slug = `${require('slug')(entry.title || entry.name)}-${entry.id}`;
    const url = path ? `${path}/${slug}` : `${model}/${slug}`;

    const subscriptions = await strapi
      .service('api::mail.mail')
      .findSubscriptions(model);
    subscriptions.map((e) => {
      console.log('Send email to: ', e.email);
      // https://docs.strapi.io/developer-docs/latest/plugins/email.html#programmatic-usage
      strapi
        .plugin('email-designer')
        .service('email')
        .sendTemplatedEmail(
          {
            to: e.email,
            // from: is not specified, so it's the defaultFrom that will be used instead
          },
          {
            templateReferenceId: template.templateId,
            subject: _.template(template.subject)({ title }),
          },
          {
            model,
            url,
            entry,
          },
        );
    });

    ctx.body = subscriptions;
  },
};

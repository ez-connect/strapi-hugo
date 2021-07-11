module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'dc65fe13361436bbf2f1980d384942ee'),
      // https://github.com/strapi/strapi/blob/86e0cf0f55d58e714a67cf4daee2e59e39974dd9/packages/strapi-admin/services/token.js#L9
      options: {
        expiresIn: '1d',
      },
    },
  },
});

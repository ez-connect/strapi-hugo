module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '76165570794fa353ff41d4b48f26da4b'),
  },
});

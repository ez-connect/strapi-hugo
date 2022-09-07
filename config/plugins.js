module.exports = ({ env }) => ({
  // ...
  email: {
    config: {
      provider: 'sendgrid',
      providerOptions: {
        apiKey: env('EMAIL_API_KEY'),
      },
      settings: {
        defaultFrom: env('EMAIL_DEFAULT_FROM'),
        defaultReplyTo: env('EMAIL_DEFAULT_REPLY_TO'),
      },
    },
  },
  'config-sync': {
    enabled: true,
    config: {
      syncDir: "config/sync/",
      minify: false,
      importOnBootstrap: false,
      customTypes: [],
      excludedTypes: [],
      excludedConfig: [
        "core-store.plugin_users-permissions_grant"
      ],
    },
  },
  // ...
});

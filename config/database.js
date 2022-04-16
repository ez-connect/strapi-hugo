const path = require('path');

module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE', 'sqlite'),
    connection: {
      // sqlite
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
      // postgres
      host: env('DATABASE_HOST', 'postgres.default.svc.cluster.local'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'hugo-cms'),
      user: env('DATABASE_USERNAME', 'root'),
      password: env('DATABASE_PASSWORD', 'password'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    // sqlite does not support inserting default values
    useNullAsDefault: true,
  },
});

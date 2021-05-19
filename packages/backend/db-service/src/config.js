import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'localhost',
      env: 'MONGO_HOSTNAME',
    },
    port: {
      doc: 'The port to bind for MongoDB.',
      format: 'port',
      default: 27017,
      env: 'MONGO_PORT',
      arg: 'mongo_port',
    },
    mongo_db: {
      doc: 'The database to in MongoDB.',
      format: '*',
      default: 'studentLoanDB',
      env: 'MONGO_DB',
      arg: 'mongo_db',
    },
  },
  server: {
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 3000,
      env: 'PORT',
      arg: 'port',
    },
  },
});

export default config;

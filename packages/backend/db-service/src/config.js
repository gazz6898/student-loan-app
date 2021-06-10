import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    host: {
      doc: 'The server host.',
      format: '*',
      default: 'localhost',
      env: 'HOST',
      arg: 'host',
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 4002,
      env: 'PORT',
      arg: 'port',
    },
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
      doc: 'The database to use in MongoDB.',
      format: '*',
      default: 'studentLoanDB',
      env: 'MONGO_DB',
      arg: 'mongo_db',
    },
  },
  rabbit: {
    host: {
      doc: 'RabbitMQ host name/IP',
      format: '*',
      default: null,
      env: 'AMQP_HOST',
      arg: 'amqp_host',
    },
    queue_name: {
      doc: 'The queue this service listens to.',
      format: '*',
      default: 'default_queue',
      env: 'QUEUE_NAME',
      arg: 'queue_name',
    },
  },
});

export default config;

import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
  },
  jwt: {
    secret: {
      doc: 'JWT secret key.',
      default: null,
      env: 'JWT_SECRET',
      arg: 'jwt_secret',
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
      default: 4001,
      env: 'PORT',
      arg: 'port',
    },
  },
});

export default config;

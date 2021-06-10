import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV',
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
      default: 4000,
      env: 'PORT',
      arg: 'port',
    },
  },
  services: {
    auth: {
      port: {
        doc: 'The port to bind for the auth service.',
        format: 'port',
        default: 4001,
        env: 'AUTH_PORT',
        arg: 'auth_port',
      },
      queues: {
        main: {
          doc: 'The name of the main auth queue.',
          format: '*',
          default: 'auth_queue',
          env: 'AUTH_MAIN_QUEUE',
          arg: 'auth_main_queue',
        }
      },
    },
    db: {
      port: {
        doc: 'The port to bind for the DB service.',
        format: 'port',
        default: 4002,
        env: 'DB_PORT',
        arg: 'db_port',
      },
    },
  },
});

export default config;

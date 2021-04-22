import convict from 'convict';

const config = convict({
  db: {
    port: 27017,
  },
  server: {
    port: 3000,
  },
});

export default config;
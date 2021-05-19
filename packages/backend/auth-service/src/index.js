import cors from 'cors';
import express from 'express';

import config from './config';
import connectMQ from './rabbitmq';

connectMQ()
  .then(channel => {
    const app = express();

    app.use(cors());

    app.get('/', async (req, res) => {
      res.json('Hello, world!');
    });

    app.get('/test', (req, res) => {
      res.json({ message: 'This is the auth service' });
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

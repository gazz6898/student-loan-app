import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';

import config from './config';
import connectServices from './services';

import { messagePromise } from '../../../libs/rabbit-utils/src';


const start = async (retries = 0) =>
connectServices()
  .then(async ({ rabbit: { connection, channel, queues } }) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.post('/', async (req, res, next) => {
      const { body } = req;

      next();
    });

    app.post('/login', async (req, res, next) => {
      const { body } = req;
      if (!body?.email || !body?.password) {
        res.sendStatus(400);
      } else {
        const { email, password } = body;

        console.log(`Authorizing ${email}:${password}`);

        const { token = null, error } = await messagePromise({
          channel,
          data: { email, password },
          exchange: 'login',
          routingKey: 'login',
        });

        if (token) {
          console.log(`Authentication successful (${token}).`);
          res.send({ token });
        } else {
          res.send({ token: null, error });
        }
      }
      next();
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(async err => {
    console.log(err);
    if (retries > 3) {
      process.exit(1);
    } else {
      console.log('Retrying...');
      await new Promise(resolve => setTimeout(resolve, 2 ** retries * 1000));
      await start(retries + 1);
    }
  });

start();
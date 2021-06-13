import cors from 'cors';
import express from 'express';
import NodeRSA from 'node-rsa';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from './config';
import connectServices from './services';

import { messagePromise } from '../../../libs/rabbit-utils/src';

const key = new NodeRSA({ b: 512 });

const keypair = {
  public: key.exportKey('public'),
  private: key.exportKey('private'),
};

const start = async (retries = 0) =>
  connectServices()
    .then(async ({ rabbit }) => {
      const { connection, channel, queues } = rabbit;

      const app = express();

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cors());

      app.get('/', async (req, res) => {
        res.json('Hello, world!');
      });

      app.post('/login', async (req, res, next) => {
        console.log('Logging in...');
        try {
          const { email, password } = req.body;

          if (!email || !password) {
            throw new Error('Both email and password are required.');
          }

          const [user] = await messagePromise({
            channel,
            data: { model: 'User', where: { email, password } },
            exchange: 'db',
            routingKey: 'query.user',
          });

          if (user) {
            const token = jwt.sign({ email }, config.get('jwt.secret'), {
              expiresIn: '1800s',
            });
            
            const authTokens = await messagePromise({
              channel,
              data: { model: 'AuthToken', data: [{ user_id: user._id, token }] },
              exchange: 'db',
              routingKey: 'insert.authToken',
            });

            res.send({ token });
          } else {
            res.sendStatus(401);
          }
        } catch (error) {
          res.json({ token: null, error: 'An error occurred while logging in.', info: { error } });
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

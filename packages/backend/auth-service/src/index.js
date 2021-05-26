import cors from 'cors';
import express from 'express';
import NodeRSA from 'node-rsa';
import jwt from 'jsonwebtoken';

import config from './config';
import connectServices from './services';

const QUEUE = process.env.QUEUE_NAME ?? 'default_queue';
const EXCHANGE = 'topic_test';

const key = new NodeRSA({ b: 512 });

const keypair = {
  public: key.exportKey('public'),
  private: key.exportKey('private'),
};

connectServices()
  .then(({ rabbit }) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.get('/', async (req, res) => {
      res.json('Hello, world!');
    });

    app.post('/login', async (req, res, next) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          throw 'Both email and password are required.';
        }

        
      } catch (err) {
        res.json({ token: null, error: 'An error occurred while logging in.', info: { ...err } });
      }
      next();
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

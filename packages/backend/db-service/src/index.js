import cors from 'cors';
import express from 'express';

import connectMQ from './rabbitmq';
import config from './config';
import connectDB from './models/db';

connectDB()
  .then(async result => ({ ...result, channel: await connectMQ() }))
  .then(({ client, channel }) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.get('/', async (req, res) => {
      res.json('Hello, world!');
    });

    app.post('/echo', async (req, res, next) => {
      console.log('POST to /echo');
      console.log(req.body);
      res.json(req.body);
      next();
    });

    app.get('/collections', async (req, res) => {
      res.json({
        message: await client
          .model('User')
          .find({})
          .exec()
          .then(x => JSON.stringify(x)),
      });
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

import cors from 'cors';
import express from 'express';

import config from './config';
import connectServices from './services';

const start = async (retries = 0) =>
  connectServices()
    .then(({ db, rabbit: { channel, connection, queues } }) => {
      const app = express();

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cors());

      // REST API
      app.get('/', async (req, res) => {
        res.json({ message: 'Hello, world!' });
      });

      app.post('/query/:model', async (req, res, next) => {
        const reqModel = req.params.model;

        try {
          if (req.body) {
            const { where } = req.body;
            const results = await db.model(reqModel).find(where).exec();
            res.json(results);
            next();
          } else {
            res.json([]);
            next();
          }
        } catch (error) {
          console.log(JSON.stringify(error, null, 2));
          res.json({ error });
        }
      });

      app.post('/insert/:model', async (req, res, next) => {
        const reqModel = req.params.model;

        try {
          if (req.body) {
            const { data } = req.body;

            if (!data) {
              res.sendStatus(400);
            }
            const model = db.model(reqModel);
            await model
              .create(data)
              .then(doc => doc.save())
              .catch(error => res.send({ error }));

            next();
          } else {
            res.json({ error: new Error('Request has no body.') });
            next();
          }
        } catch (error) {
          console.log(JSON.stringify(error, null, 2));
          res.json({ error });
        }
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

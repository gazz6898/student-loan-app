import cors from 'cors';
import express from 'express';

import config from './config';
import connectServices from './services';

connectServices()
  .then(({ db, rabbit }) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    // REST API
    app.get('/', async (req, res) => {
      res.json('Hello, world!');
    });

    app.post('/query/:model', async (req, res, next) => {
      const reqModel = req.params.model;
      if (req.body) {
        const { where } = req.body;
        const results = await db.model(reqModel).find(where).exec();
        res.json(results);
        next();
      } else {
        res.json([]);
        next();
      }
    });

    app.listen(config.get('server.port'), () => {
      console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

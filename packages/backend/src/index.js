import config from './config';
import connectDB from './models/db';
import cors from 'cors';
connectDB();

import express from 'express';
const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/test', (req, res) => {
  res.send({ message: 'This is the test route' });
});

app.listen(config.get('server.port'), () => {
  console.log(`Server listening at http://localhost:${config.get('server.port')}/`);
});

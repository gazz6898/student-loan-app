import db from './db';
import rabbit from './rabbit';

export default async () => ({
  db: await db(),
  rabbit: await rabbit(),
});

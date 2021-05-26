import rabbit from './rabbit';

export default async () => ({
  rabbit: await rabbit(),
});

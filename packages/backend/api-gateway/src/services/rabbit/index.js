import config from '../../config';
import queues from './queues';

import { connectMQ } from '../../../../../libs/rabbit-utils/src';

export default () =>
  connectMQ({ url: `amqp://${config.get('rabbit.host')}`, queues })
    .then(rabbit => {
      console.log('[rabbitmq] Awaiting Requests...');
      return rabbit;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });

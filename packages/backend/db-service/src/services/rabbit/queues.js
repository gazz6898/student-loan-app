import amqp from 'amqplib';
import axios from 'axios';

import { createConsumer } from '../../../../../libs/rabbit-utils/src';

import config from '../../config';

/**
 * @typedef {{
 *   channel: amqp.Channel,
 *   queue: amqp.Replies.AssertQueue
 * }} ConsumerContext
 */

/**
 * @typedef {{
 *   name: string,
 *   pattern: string,
 *   options: amqp.Options.AssertExchange?
 * }} ExchangeDefinition
 */

/**
 * @typedef {{
 *   name: string,
 *   options: amqp.Options.AssertQueue?,
 *   boundExchanges: ExchangeDefinition[],
 *   consumer: ((msg: amqp.ConsumeMessage, context: ConsumerContext) => void)?,
 *   consumeOptions: amqp.Options.Consume?,
 * }} QueueDefinition
 */

/** @type {{ [key: string]: ExchangeDefinition } */
const exchanges = {
  db: {
    name: 'db',
  },
};

/**
 * @type {QueueDefinition[]}
 */
const queues = [
  {
    name: config.get('rabbit.queue_name'),
    options: { durable: false },
    boundExchanges: [{ ...exchanges.db, pattern: 'query.*' }],
    consumer: createConsumer(async (payload, { routingKey }) => {
      if (/^query\..+/.test(routingKey)) {
        const { model, where } = payload;
        return axios
          .post(`http://db-service:4002/query/${model}`, { where })
          .then(response => response.data)
          .catch(error => console.log(`[rabbitmq - ERROR] ${error.message}`) ?? { error });
      }
      else if (/^insert\..+/.test(routingKey)) {
        const { model, data } = payload;
        return axios
          .post(`http://db-service:4002/insert/${model}`, { data })
          .then(response => response.data)
          .catch(error => console.log(`[rabbitmq - ERROR] ${error.message}`) ?? { error });
      }
    }),
  },
];

export default queues;

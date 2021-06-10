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
  login: {
    name: 'login',
  },
};

/**
 * @type {QueueDefinition[]}
 */
const queues = [
  {
    name: config.get('rabbit.queue_name'),
    options: { durable: false },
    boundExchanges: [{ ...exchanges.login, pattern: '*' }],
    consumer: createConsumer(async obj =>
      axios
        .post(`http://auth-service:4001/login`, obj)
        .then(response => response.data)
        .catch(error => console.log(`[rabbitmq - ERROR] ${error.message}`) ?? { error })
    ),
  },
];

export default queues;

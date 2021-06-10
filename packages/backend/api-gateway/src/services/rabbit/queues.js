import amqp from 'amqplib';
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
    boundExchanges: [],
    consumer: (msg, { channel }) => {
      const s = msg.content.toString();

      console.log(`Reply: ${s}`);

      channel.ack(msg);
    },
  },
  {
    name: config.get('services.auth.queues.main'),
    options: { durable: false },
  },
];

export default queues;

const amqp = require('amqplib');
const uuid = require('uuid');

const { v4: uuidv4 } = uuid;

/** @typedef {(msg: amqp.ConsumeMessage, context: ConsumerContext) => void} ConsumerFunc */

/**
 * @typedef {{
 *   channel: amqp.Channel,
 *   queue: amqp.Replies.AssertQueue,
 *   routingKey: string,
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
 *   consumer: ConsumerFunc?,
 *   consumeOptions: amqp.Options.Consume?,
 * }} QueueDefinition
 */

/**
 * @typedef {{
 *   connection: amqp.Connection,
 *   channel: amqp.Channel,
 *   queues: { [queue_name: string]: amqp.Replies.AssertQueue }
 * }} RabbitMQContext
 */

/**
 *
 * @param {{ channel: amqp.Channel, data: *, exchange: string, queue: string?, routingKey: string? }} param0
 * @returns {Promise<object>}
 */
module.exports.messagePromise = ({ channel, data, exchange, routingKey = '', timeout = 10000 }) =>
  new Promise((resolve, reject) => {
    try {
      const correlationId = uuidv4();
      channel.assertQueue('', { exclusive: true }).then(replyQueue => {
        const timeoutError = setTimeout(() => {
          channel.deleteQueue(replyQueue.queue);
          reject(new Error(`Timed out after ${timeout} ms.`));
        }, timeout);

        channel.consume(
          replyQueue.queue,
          async msg => {
            if (msg && msg.properties.correlationId === correlationId) {
              clearTimeout(timeoutError);
              await channel.deleteQueue(replyQueue.queue);
              resolve(JSON.parse(msg.content.toString()));
            }
          },
          { noAck: true }
        );

        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)), {
          correlationId,
          replyTo: replyQueue.queue,
        });
      });
    } catch (error) {
      reject(error);
    }
  });

/**
 * @param {(obj: { [string]: * }, context: ConsumerContext) => { [string]: * }} func
 * @returns {ConsumerFunc}
 */
module.exports.createConsumer = func => async (msg, context) => {
  const { channel, queue } = context;
  const { routingKey } = msg.fields;
  const { correlationId, replyTo } = msg.properties;
  const obj = JSON.parse(msg.content.toString());

  console.log(`[rabbitmq - ${queue.queue}:${routingKey}] "${msg.content.toString()}"`);

  const response = await func(obj, context);

  if (replyTo && correlationId) {
    channel.sendToQueue(replyTo, Buffer.from(JSON.stringify(response)), { correlationId });
  }

  channel.ack(msg);
};

/** @type {(param0: { url: string, queues: QueueDefinition[]? }) => Promise<RabbitMQContext>} */
module.exports.connectMQ = async ({ url, queues = [] }) =>
  amqp.connect(url).then(async connection => {
    process.on('exit', connection.close);

    const channel = await connection.createChannel();
    const queueMap = {};

    await Promise.all(
      queues.map(
        async ({ name, options = {}, boundExchanges = [], consumer, consumeOptions = {} }) => {
          console.log(`Setup Starting for Queue: ${name}`);

          const queue = await channel.assertQueue(name, options);

          if (consumer) {
            const consumeResponse = await channel.consume(
              queue.queue,
              msg => consumer(msg, { channel, queue, routingKey: msg.fields.routingKey }),
              consumeOptions
            );
            process.on('exit', () => {
              channel.cancel(consumeResponse.consumerTag);
            });
          }

          for await (const exchange of boundExchanges) {
            await channel.assertExchange(exchange.name, 'topic', exchange.options);
            await channel.bindQueue(queue.queue, exchange.name, exchange.pattern);
            console.log(`Bound queue '${queue.queue}' to exchange '${exchange.name}'`);
          }

          console.log(`Setup Complete for Queue: ${name}`);
          queueMap[name] = queue;
        }
      )
    );

    channel.prefetch(1);

    return { connection, channel, queues: queueMap };
  });

module.exports.QUEUES = {};

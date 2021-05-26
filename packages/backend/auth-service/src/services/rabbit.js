import amqp from 'amqplib/callback_api';
import { v4 as uuidv4 } from 'uuid';

const URL = `amqp://${process.env.AMQP_HOST}`;
const QUEUE = process.env.QUEUE_NAME ?? 'default_queue';
const EXCHANGE = 'topic_test';
/**
 *
 * @returns {Promise<{channel: amqp.Channel}>}
 */
const connectMQ = () =>
  new Promise((resolve, reject) =>
    amqp.connect(URL, (err, connection) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      process.on('exit', () => {
        connection.close(err => console.log(`ERROR: ${err}`));
      });
      connection.createChannel((err, channel) => {
        if (err) {
          reject(err);
        }
        channel.assertQueue('', { exclusive: true }, (err, q) => {
          if (err) {
            console.error(err);
            throw err;
          }
          const correlationId = uuidv4();

          channel.consume(
            q.queue,
            msg => {
              if (msg.properties.correlationId === correlationId) {
                console.log(`${msg.content.toString()}`);
              }
            },
            { noAck: true }
          );

          channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify({ foo: 'bar' })), {
            correlationId,
            replyTo: q.queue,
          });
        });
        resolve({ channel });
      });
    })
  );

export default connectMQ;

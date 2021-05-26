import amqp from 'amqplib/callback_api';

const URL = `amqp://${process.env.AMQP_HOST}`;
const QUEUE = process.env.QUEUE_NAME ?? 'default_queue';
const EXCHANGE = 'messages';

/**
 *
 * @returns {Promise<amqp.Connection>}
 */
const connectMQ = async () =>
  new Promise((resolve, reject) => {
    amqp.connect(URL, (err, con) => {
      if (err) {
        console.error(err);
        reject(err);
      }

      con.createChannel((err, ch) => {
        if (err) {
          console.error(err);
          reject(err);
        }

        ch.assertQueue(QUEUE, { durable: false });

        ch.prefetch(1);
        console.log('[rabbitmq] Awaiting Requests...');
        ch.consume(QUEUE, msg => {
          const s = msg.content.toString();

          ch.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(JSON.stringify({ foo: 'bar', s })),
            { correlationId: msg.properties.correlationId }
          );

          ch.ack(msg);
        });

        process.on('exit', () => {
          con.close();
        });

        resolve(ch);
      });
    });
  });

export default connectMQ;

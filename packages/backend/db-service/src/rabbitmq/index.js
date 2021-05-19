import amqp from 'amqplib/callback_api';

const URL = `amqp://${process.env.AMQP_HOST}`;
const QUEUE = process.env.QUEUE_NAME;

/**
 *
 * @returns {Promise<amqp.Channel>}
 */
const connectMQ = async () =>
  new Promise((resolve, reject) => {
    amqp.connect(URL, (err, con) => {
      if (err) {
        console.log(err);
        reject(err);
      }

      con.createChannel((err, ch) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        ch.assertQueue(QUEUE, { durable: true });

        process.on('exit', () => {
          ch.close();
        });

        resolve(ch);
      });
    });
  });

export default connectMQ;

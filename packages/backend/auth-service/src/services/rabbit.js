import amqp from 'amqplib/callback_api';
import { v4 as uuidv4 } from 'uuid';

const URL = `amqp://${process.env.AMQP_HOST}`;
const QUEUE = process.env.QUEUE_NAME ?? 'default_queue';
const EXCHANGE = 'topic_test';
/**
 *
 * @returns {Promise<amqp.Connection>}
 */
const connectMQ = async () =>
  new Promise((resolve, reject) =>
    amqp.connect(URL, (err, connection) => {
      if (err) {
        reject(err);
      }

      if (connection) {
        process.on('exit', () => {
          connection.close(err => console.log(`ERROR: ${err}`));
        });


        resolve(connection);
      }
    })
  );

export default connectMQ;

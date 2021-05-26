import amqp from 'amqplib/callback_api';

/**
 * @returns {Promise<amqp.Connection>}
 */
export const connect = () =>
  new Promise((resolve, reject) =>
    amqp.connect((err, connection) => {
      if (err) {
        reject(err);
      }
      resolve(connection);
    })
  );

/**
 * @param {amqp.Connection} con
 * @returns {Promise<amqp.Channel>}
 */
export const createChannel = con =>
  new Promise((resolve, reject) =>
    con.createChannel((err, channel) => {
      if (err) {
        reject(err);
      }
      resolve(channel);
    })
  );

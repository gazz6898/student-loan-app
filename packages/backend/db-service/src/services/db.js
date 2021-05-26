import mongoose from 'mongoose';

import config from '../config';
import schemaMap from '../models/schema';
import { seedModel } from '../models/util';

/**
 *
 * @returns {Promise<mongoose.Mongoose>}
 */
const connectDB = async () => {
  await mongoose
    .connect(
      // `mongodb://user:ketteringb@18.191.29.153/loans`,
      `mongodb://${config.get('db.host')}:${config.get('db.port')}/${config.get('db.mongo_db')}`,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
      }
    )
    .then(client => {
      console.log(`MongoDB connected at: ${client.connection.host}`);
    })
    .catch(err => {
      console.error(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
    });

  for await (const { collectionName, modelName, schema, seed = [] } of Object.values(schemaMap)) {
    const model = mongoose.model(modelName, schema, collectionName);
    await model.init();
    console.log(`Model Loaded: ${modelName}`);

    if (seed.length) {
      await seedModel(model, seed);
      console.log(`Model Seeded: ${modelName}`);
    }
  }

  return mongoose;
};

export default connectDB;

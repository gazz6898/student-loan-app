import mongoose from 'mongoose';

import config from '../config';
import schemaMap from './schema';
import { seedModel } from './util';

/**
 *
 * @returns {Promise<{ client: mongoose.Mongoose, modelMap: { [model: string]: mongoose.Model<mongoose.Document<any, any>, {}, {}> } }>}
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

  const modelMap = {};
  for await (const { collectionName, modelName, schema, seed = [] } of Object.values(schemaMap)) {
    const model = mongoose.model(modelName, schema, collectionName);
    modelMap[modelName] = model;
    console.log(`Model Loaded: ${modelName}`);
    
    if (seed.length) {
      await seedModel(model, seed);
      console.log(`Model Seeded: ${modelName}`);
    }
  }

  return { client: mongoose, modelMap };
};

export default connectDB;

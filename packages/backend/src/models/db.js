import config from '../config';
import modelSchema from './schema';

import mongoose from 'mongoose';

const connectDB = async () => {
  await mongoose
    .connect(`mongodb://localhost:${config.get('db.port')}/studentLoanDB`, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(con => {
      console.log(`MongoDB connected at: ${con.connection.host}`);
    })
    .catch(err => {
      console.error(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
    });

  for (const { modelName, schema } of modelSchema) {
    mongoose.model(modelName, schema);
  }
};

export default connectDB;

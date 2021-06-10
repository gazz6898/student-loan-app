import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

export default {
  collectionName: 'authToken',
  modelName: 'AuthToken',
  schema,
  seed: [],
};

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default {
  collectionName: 'user',
  modelName: 'User',
  schema,
  seed: [
    {
      email: 'user@example.com',
      password: 'Test123',
    },
  ],
};

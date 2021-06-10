import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessControlPolicies: {
    type: [String],
    default: () => [],
    required: true
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

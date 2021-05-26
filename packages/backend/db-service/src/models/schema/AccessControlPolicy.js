import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  rule: {
    type: String,
    validate: {
      validator: /([a-z*]+)(:[a-z]*)*/i.test,
    },
  },
});

export default {
  collectionName: 'accessControlPolicies',
  modelName: 'AccessControlPolicy',
  schema,
  seed: [
    {
      email: 'user@example.com',
      password: 'Test123',
    },
  ],
};

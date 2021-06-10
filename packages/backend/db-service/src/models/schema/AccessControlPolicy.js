import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  rules: {
    type: [String],
    required: true,
    validate: {
      validator: strs => strs.every(str => /^([a-z*]+)(:([a-z]+|\*))*$/i.test(str)),
    },
  },
});

export default {
  collectionName: 'accessControlPolicies',
  modelName: 'AccessControlPolicy',
  schema,
  seed: [
    {
      name: 'admin',
      rules: ['*']
    },
    {
      name: 'student',
      rules: ['query:loans']
    },
  ],
};

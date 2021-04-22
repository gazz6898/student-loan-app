import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: {
    type: String,
  },
});

export default {
  modelName: 'User',
  schema,
};

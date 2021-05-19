import mongoose from 'mongoose';

/**
 *
 * @param {mongoose.Model<mongoose.Document<any, any>, {}, {}>} model
 * @param {any[]} seed
 * @returns {Promise<void>}
 */
export const seedModel = async (model, seed) => {
  await Promise.all(
    seed.map(async doc =>
      model
        .find(doc)
        .exec()
        .then(matches => (matches.length ? null : model.create(doc)))
    )
  );
};

const sequelize = require('../config/connection');
const seedSentence = require('./sentenceData');
const seedUser = require('./userData')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await seedUser();
  await seedSentence();

  process.exit(0);
};

seedDatabase();
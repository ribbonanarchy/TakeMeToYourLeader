const User = require('../models/User');

const userData = require('./userData.json');

const seedUser = () => User.bulkCreate(userData);

module.exports = seedUser;
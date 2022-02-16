const Sentence = require('../models/Sentence');

const sentenceData = require('./sentenceData.json');

const seedSentence = () => Sentence.bulkCreate(sentenceData);

module.exports = seedSentence;
const User = require('./User');
const Sentence = require('./Sentence');

User.hasMany(Sentence, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
});

Sentence.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Sentence };
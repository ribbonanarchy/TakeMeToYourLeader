const router = require('express').Router();
const userRoutes = require('./userRoutes');
const sentenceRoutes = require('./sentenceRoutes');

router.use('/user', userRoutes);
router.use('/sentence', sentenceRoutes);

module.exports = router;
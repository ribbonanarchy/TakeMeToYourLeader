const router = require("express").Router();
const { User, Sentence } = require("../../models");
const withAuth = require("../../utils/auth");

// GET

// POST
router.post("/", withAuth, async (req, res) => {
  try {
    const newSentence = await Sentence.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newSentence);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT

// DELETE
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const sentenceData = await Sentence.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!sentenceData) {
      res.status(404).json({ message: "No project found with this id!" });
      return;
    }

    res.status(200).json(sentenceData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

const router = require("express").Router();
const Sentence = require("../../models/Sentence");
const withAuth = require("../../utils/auth");

// GET

// POST
router.post("/", async (req, res) => {
  try {
    console.log(req.body.sentence);

    const newSentence = await Sentence.create({
      text: req.body.sentence,
      user_id: req.session.user_id,
    });

    res.status(200).json(newSentence);
  } catch (err) {
    console.log(err);
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
      res.status(404).json({ message: "No sentence found with this id!" });
      return;
    }

    res.status(200).json(sentenceData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

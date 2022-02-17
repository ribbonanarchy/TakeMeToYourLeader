const router = require("express").Router();
const { User, Sentence } = require("../../models");
const withAuth = require("../../utils/auth");

// GET
router.get("/user", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Sentence }],
    });

    const user = userData.get({ plain: true });

    res.render("user", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST

// create a user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { name: req.body.name } });
    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect name or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect name or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// PUT

// Update alien color
router.put("/color", async (req, res) => {
  try {
    const newColor = await User.update(req.body, {
        where: {
          id: req.session.user_id,
        },
      });

    res.status(200).json(newColor);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Update alien mood
router.put("/mood", async (req, res) => {
  try {
    const newMood = await User.update(req.body, {
      where: {
        id: req.session.user_id,
      },
    });

    res.status(200).json(newMood);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// DELETE

module.exports = router;
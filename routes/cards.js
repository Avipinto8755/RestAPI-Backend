const router = require("express").Router();
const auth = require("../middleware/auth");
const { validateCard, Card, generateBizNumber } = require("../models/card");

router.post("/", auth, async (req, res) => {
  // validate user's input
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  // validate system

  // process
  const card = new Card({
    ...req.body,
    bizImage:
      req.body.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBizNumber(),
    user_id: req.user._id,
  });

  await card.save();

  // response
  res.json(card);
});

router.delete("/:id", auth, async (req, res) => {
  const card = await Card.findOneAndDelete({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  res.json(card);
});

router.put("/:id", auth, async (req, res) => {
  // validate user's input
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  // process
  const card = await Card.findOneAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body,
    {
      new: true,
    }
  );
  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  // response
  res.json(card);
});

router.get("/:id", auth, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  if (!card) {
    res.status(404).send("The card with the given ID was not found");
    return;
  }

  res.json(card);
});
// Get all Cards
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
// Get My Cards
router.get("/my-cards", auth, async (req, res) => {
  try {
    const cards = await Card.find({ user_id: req.user._id });
    res.send(cards);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
//Edit Card
router.patch("/:id", auth, async (req, res) => {
  try {
    const foundCard = await Card.findOne({
      _id: req.params.id,
      "likes.user_id": req.user._id,
    });
    if (foundCard) {
      res.statusMessage = "You already liked this card.";
      res.status(400).send("You already liked this card.");
      return;
    }
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: { user_id: req.user._id } } },
      { new: true }
    );
    res.json(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
//Change BizNumber
router.patch("/:id", auth, async (req, res) => {
  try {
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { bizNumber: await generateBizNumber() } }
    );
    res.send(card);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;

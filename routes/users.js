const router = require("express").Router();

const bcrypt = require("bcrypt");
const _ = require("lodash");

const { User, validateUser, validateCards } = require("../models/users");
const auth = require("../middleware/auth");
const { Card } = require("../models/card");

router.patch("/cards", auth, async (req, res) => {
  // validate user's input
  const { error } = validateCards(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  const cards = await Card.find({ bizNumber: { $in: req.body.cards } });
  if (cards.length !== req.body.cards.length) {
    res.status(400).send("at least some of the numbers were not found");
    return;
  }

  const user = await User.findById(req.user._id);
  user.cards = [...new Set([...user.cards, ...req.body.cards])];
  await user.save();

  res.json(user);
});

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  res.json(user);
});

//Get user by id
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select(
      "-password -__v"
    );
    res.json(user);
  } catch (err) {
    res.statusMessage = "User was not found.";
    res.status(401).send("User was not found.");
    return;
  }
});

router.post("/", async (req, res) => {
  // validate user's input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  // validate system
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already registered");
    return;
  }

  // process
  user = new User(req.body);
  user.password = await bcrypt.hash(user.password, 12);

  await user.save();

  // results
  res.json(_.pick(user, ["_id", "name", "email", "biz"]));
});

// login
router.post("/login", async (req, res) => {
  //validate input
  const { error } = validate(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  //validate system
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }
  const passCheck = await bcrypt.compare(req.body.password, user.password);
  if (!passCheck) {
    res.status(400).send("Invalid email or password");
    return;
  }

  //process
  const token = user.generateAuthToken();
  res.send({ token });
});

//Edit user
router.put("/:id", auth, async (req, res) => {
  //validate user input
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }
  //validate system
  let user = await User.findOne({
    email: req.body.email,
    _id: { $ne: req.user._id },
  });

  if (user) {
    res.status(401).send("There is a user with this email.");
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id });
    if (!user) {
      res.status(401).send("The user does not exist.");
      return;
    }
    res.send(user);
  } catch (err) {
    res.status(401).send(err.message);
  }
});

module.exports = router;

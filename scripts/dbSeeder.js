const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const { Card, generateBizNumber } = require("../models/card");
const { faker } = require("@faker-js/faker");

const config = require("../config");
mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("connected to db successfully"))
  .then(seed)
  .then(() => mongoose.connection.close())
  .catch((err) => console.log("could not connect to db ", err));

async function seed() {
  await Promise.all(new Array(10).fill(null).map(() => seedUser()));

  const user = await seedUser();

  console.log("connect with", user.email);

  await createCard({
    bizName: "lemon",
    bizDescription: "lemons for all",
    bizAddress: "lemon av.",
    bizPhone: "034343434",
    bizImage: "http://cdn.pixabay.com/dafjdsklf",
    user_id: user._id,
  });
}

async function createCard(card) {
  const savedCard = await new Card({
    ...card,
    bizImage:
      card.bizImage ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    bizNumber: await generateBizNumber(),
  }).save();

  console.log("new Card", savedCard._id);

  return savedCard;
}

async function seedUser({
  name = faker.internet.userName(),
  password = faker.internet.password(),
  biz = false,
} = {}) {
  const user = await new User({
    name,
    password: await bcrypt.hash(password, 12),
    email: `${name}@gmail.com`,
    biz,
  }).save();

  console.log("new User", user.email, " ", password);

  return user;
}

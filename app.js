const config = require("./config");

const mongoose = require("mongoose");

const express = require("express");

const morgan = require("morgan");

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const cardsRouter = require("./routes/cards");

mongoose
  .connect(config.MONGO_URI)
  .then(() => console.log("connected to db successfully"))
  .catch((err) => console.log("could not connect to db ", err));

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/cards", cardsRouter);

const PORT = config.PORT;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));

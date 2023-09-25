require("dotenv/config");

function error(err) {
  throw new Error(err);
}

const config = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1/my-rest-api",
  PORT: Number(process.env.PORT) || 3000,
  JWT_SECRET:
    process.env.JWT_SECRET || error("JWT_SECRET environment variable is empty"),
};

module.exports = config;

const mongoose = require("mongoose");

const OAuth2Credentials = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  discordId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OAuth2Credentials", OAuth2Credentials);

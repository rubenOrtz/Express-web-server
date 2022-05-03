const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
  playingTime: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  cleverbotMessages: {
    type: String,
    required: true,
  },
  commands: {
    type: String,
    required: true,
  },
  logs: {
    type: String,
    required: true,
  },
  guildCount: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("stats", statSchema);

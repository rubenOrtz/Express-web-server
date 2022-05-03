const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  prefix: {
    type: String,
    required: true,
  },
  cleverbotchannelid: {
    type: String,
    required: true,
  },
  logschannelid: {
    type: String,
    required: true,
  },
  welcomechannelid: {
    type: String,
    required: true,
  },
  discordurl: {
    type: String,
    required: true,
  },
  muteroleid: {
    type: String,
    required: true,
  },
  staffroleid: {
    type: String,
    required: true,
  },
  swearfilter: {
    type: Boolean,
    required: true,
  },
  upvotes: {
    type: String,
    required: true,
  },
  antidiscordlink: {
    type: Boolean,
    required: true,
  },
  antilink: {
    type: Boolean,
    required: true,
  },
  antispam: {
    type: Boolean,
    required: true,
  },
  presenceadvertisementfound: {
    type: Boolean,
    required: true,
  },
  presencestatuschanged: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Guild", guildSchema);

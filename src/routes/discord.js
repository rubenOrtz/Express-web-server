const router = require("express").Router();
const { getBotGuilds, getUserGuilds, getChannels, getUser } = require("../utils/api");
const User = require("../database/schemas/user");
const { getMutualsGuilds } = require("../utils/utils");
const Guild = require("../database/schemas/guild");
const jwt = require("jsonwebtoken");
const { decrypt } = require("../utils/utils");

router.get("/guilds", async (req, res) => {
  const authorization = req.get("Authorization");
  //default token for testing...
  let token = "eyJhbGciOiJIUzI1NiJ9.bklhd3lZaktpbHAzRWtadjhnTWx1WUNsRkNVM1dl.GD2h6WD-7liECG2hE3V1M9R_3eanMfO17OZH9Ol1byg"
  if(authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7)
  }
    return await getUserGuilds(token).then(async(userGuilds) => {
      const mutualGuilds = getMutualsGuilds(userGuilds);
      res.send(await mutualGuilds);
   })
});
router.get("/@me", async (req, res) => {
  // const user = await User.findOne({ discordId: req.user.discordId })
  const authorization = req.get("Authorization");
  //default token for testing...
  let token = "eyJhbGciOiJIUzI1NiJ9.bklhd3lZaktpbHAzRWtadjhnTWx1WUNsRkNVM1dl.GD2h6WD-7liECG2hE3V1M9R_3eanMfO17OZH9Ol1byg"
  if(authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7)
  }
   if (token) {
    await getUser(token).then(async(me) => {
      res.send(await me);
   })
  } else {
    return res.status(401).send({ msg: "Unauthorized" });
  }
});
router.put("/guilds/:guildId/prefix", async (req, res) => {
  const { prefix } = req.body.prefix;
  const { guildId } = req.params;
  console.log(req.body);
  if (!prefix) return res.status(400).send({ msg: "Prefix Required" });
  const update = await Guild.findOneAndUpdate(
    { guildId },
    { prefix },
    { new: false }
  );
  if (update) {
    return res.send(update);
  } else return res.status(400).send({ msg: "Could not find that Guild" });
});

router.get("/guilds/:guildId/config", async (req, res) => {
  const { guildId } = req.params;
  const config = await Guild.findOne({ id: guildId });
  return config ? res.send(config) : res.status(400).send({ msg: "Not Found" });
});
router.get("/guilds/:guildId/config/welcome/channels", async (req, res) => {
  const { guildId } = req.params;
  const channels = await getChannels(guildId);
  console.log(channels);
  return channels
    ? res.send(channels)
    : res.status(400).send({ msg: "Not Found" });
});

module.exports = router;

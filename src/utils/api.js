const fetch = require("node-fetch");
const OAuth2Credentials = require("../database/schemas/Oauth2Credentials");
const CryptoJS = require("crypto-js");
const { decrypt } = require("./utils");
const jwt = require("jsonwebtoken")

const TOKEN = process.env.BOT_TOKEN;
async function getBotGuilds() {
  const response = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}
async function getUserGuilds(accessToken) {
  if(accessToken.lenght >= 1) return {status: "msg: Unathorized"}
  //default token for testing...
  let token = accessToken
  if(accessToken && accessToken.toLowerCase().startsWith("bearer")) {
    token = accessToken.substring(7)
  }
  const decodedToken = await jwt.verify(token, "1234")
  if(!token || !decodedToken) {
    res.status(401).send("msg: Unathorized")
  }
   if (decodedToken) {
  const response = await fetch("https://discord.com/api/v9/users/@me/guilds", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${decodedToken}`,
    },
  });
  return response.json();
}
}
async function getUser(accessToken) {
  if(accessToken.lenght >= 1) return {status: "msg: Unathorized"}
  //default token for testing...
  let token = accessToken
  if(accessToken && accessToken.toLowerCase().startsWith("bearer")) {
    token = accessToken.substring(7)
  }
  const decodedToken = await jwt.verify(token, "1234")
  if(!token || !decodedToken) {
    res.status(401).send("msg: Unathorized")
  }
   if (decodedToken) {
  const response = await fetch("https://discord.com/api/v9/users/@me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${decodedToken}`,
    },
  });
  return response.json();
}
}

async function getGuildRoles(guildId) {
  const response = await fetch(
    `http://discord.com/api/v8/guilds/${guildId}/roles`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    }
  );
  return response.json();
}
async function getGuildId(guildId) {
  const response = await fetch(`http://discord.com/api/v9/guilds/${guildId}`, {
    method: "GET",
    headers: {
      Authorization: `Bot ${TOKEN}`,
    },
  });
  return response.json();
}

async function getChannels(guildId) {
  const response = await fetch(
    `http://discord.com/api/v9/guilds/${guildId}/channels`,
    {
      method: "GET",
      headers: {
        Authorization: `Bot ${TOKEN}`,
      },
    }
  );
  return response.json();
}
getChannels("818892387098034247");

module.exports = {
  getBotGuilds,
  getUserGuilds,
  getGuildRoles,
  getGuildId,
  getChannels,
  getUser
};

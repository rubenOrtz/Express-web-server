const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLBoolean,
  GraphQLFloat,
} = require("graphql");
const {
  getUserGuilds,
  getBotGuilds,
  getGuildRoles,
  getChannels,
  getUser
} = require("../utils/api");
const jwt = require("jsonwebtoken");
const { getMutualsGuilds } = require("../utils/utils");
const GuildConfig = require("../database/schemas/guild");
const StatsSchema = require("../database/schemas/stats");

const GuildType = new GraphQLObjectType({
  name: "GuildType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    icon: { type: GraphQLString },
    splash: { type: GraphQLString },
    icon_hash: { type: GraphQLString },
    owner: { type: GraphQLBoolean },
    permissions: { type: GraphQLString },
    features: { type: new GraphQLList(GraphQLString) },
  }),
});

const ChannelType = new GraphQLObjectType({
  name: "ChannelType",
  fields: () => ({
    type: { type: GraphQLString },
    name: { type: GraphQLString },
    position: { type: GraphQLString },
    topic: { type: GraphQLString },
    nsfw: { type: GraphQLBoolean },
    rate_limit_per_user: { type: GraphQLString },
    bitrate: { type: GraphQLString },
    id: { type: GraphQLString },
    user_limit: { type: GraphQLString },
  }),
});

const UserType = new GraphQLObjectType({
  name: "UserType",
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    discriminator: { type: GraphQLString },
    avatar_decoration: { type: GraphQLString },
    public_flags: { type: GraphQLString },
    flags: { type: GraphQLString },
    banner_color: { type: GraphQLString },
    banner: { type: GraphQLString },
    accent_color: { type: GraphQLString },
    locale: { type: GraphQLString },
    mfa_enabled: { type: GraphQLString },
    avatar: { type: GraphQLString },
    guilds: {
      type: new GraphQLList(MutualGuildType),
    },
  }),
});

const MutualGuildType = new GraphQLObjectType({
  name: "MutualGuildType",
  fields: () => ({
    excluded: { type: new GraphQLList(GuildType) },
    included: { type: new GraphQLList(GuildType) },
  }),
});

const GuildConfigType = new GraphQLObjectType({
  name: "GuildConfigType",
  fields: () => ({
    id: { type: GraphQLString },
    prefix: { type: GraphQLString },
    logschannelid: { type: GraphQLString },
    welcomechannelid: { type: GraphQLString },
    discordurl: { type: GraphQLString },
    muteroleid: { type: GraphQLString },
    staffroleid: { type: GraphQLString },
    swearfilter: { type: GraphQLBoolean },
    upvotes: { type: GraphQLString },
    antilink: { type: GraphQLString },
    antidiscordlink: { type: GraphQLString },
    antispam: { type: GraphQLBoolean },
    presenceadvertisementfound: { type: GraphQLBoolean },
    presencestatuschanged: { type: GraphQLString },
    memberLogChannel: { type: GraphQLString },
  }),
});
const GuildRoleType = new GraphQLObjectType({
  name: "GuildRoleType",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    color: { type: GraphQLInt },
    hoist: { type: GraphQLBoolean },
    position: { type: GraphQLInt },
    permissions: { type: GraphQLFloat },
    managed: { type: GraphQLString },
    mentionable: { type: GraphQLString },
  }),
});
const StatsType = new GraphQLObjectType({
  name: "StatsType",
  fields: () => ({
    playingTime: { type: GraphQLString },
    id: { type: GraphQLString },
    version: { type: GraphQLInt },
    weeklylbcd: { type: GraphQLBoolean },
    commands: { type: GraphQLInt },
    cleverbotMessages: { type: GraphQLFloat },
    logs: { type: GraphQLString },
    guildCount: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    getUser: {
      type: UserType,
      args: {
        token: { type: GraphQLString },
      },
      resolve(parent, args, req) {
        async function test(parent, args, req) {
          const authorization = args.token
          if(authorization.lenght >= 1) return {status: "msg: Unathorized"}
          //default token for testing...
          let token = "eyJhbGciOiJIUzI1NiJ9.bklhd3lZaktpbHAzRWtadjhnTWx1WUNsRkNVM1dl.GD2h6WD-7liECG2hE3V1M9R_3eanMfO17OZH9Ol1byg"
          if(authorization && authorization.toLowerCase().startsWith("bearer")) {
            token = authorization.substring(7)
          }
           if (token) {
            const user = await getUser(token)
            if(req.body.query.includes("guilds")) {
              user.guilds = await getUserGuilds(token).then(async(userGuilds) => {
                return await getMutualsGuilds(userGuilds).then((result) => {
                  return result
                })
             })
             console.log(await user.guilds.excluded)
             return await user
            } else {
              return await user
            }
          } else {
            return res.status(401).send({ msg: "Unauthorized" });
          }
        }
        return test(parent, args, req)
      },
    },
    getStats: {
      type: StatsType,
      resolve(parent, args, request) {
        const stats = StatsSchema.findOne({ id: "Abuse" });
        return stats ? stats : null;
      },
    },
    getMutualGuilds: {
      type: MutualGuildType,
      async resolve(parent, args, request) {
        if (request.user) {
          const botGuilds = await getBotGuilds();
          const userGuilds = await getUserGuilds(request.user.discordId);
          return getMutualsGuilds(userGuilds, botGuilds);
        }
        return null;
      },
    },
    getChannels: {
      type: new GraphQLList(ChannelType),
      args: {
        guildId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId } = args;
        if (!guildId || !request.user) return null;
        const channel = await getChannels(guildId);
        console.log(channel);
        return channel ? channel : channel;
      },
    },
    getGuildConfig: {
      type: GuildConfigType,
      args: {
        guildId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId } = args;
        if (!guildId || !request.user) return null;
        const config = await GuildConfig.findOne({ id: guildId });
        console.log(config);
        return config ? config : null;
      },
    },
    getGuildRoles: {
      type: new GraphQLList(GuildRoleType),
      args: {
        guildId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId } = args;
        if (!guildId || !request.user) return null;
        const a = await getGuildRoles(guildId);
        console.log(a);
        return a;
      },
    },
  },
});
const MutationQuery = new GraphQLObjectType({
  name: "RootMutationQuery",
  fields: {
    updateGuildPrefix: {
      type: GuildConfigType,
      args: {
        guildId: { type: GraphQLString },
        prefix: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId, prefix } = args;
        if (!guildId || !prefix || !request.user) return null;
        const config = await GuildConfig.findOneAndUpdate(
          { id: guildId },
          { prefix }
        );
        return config ? config : null;
      },
    },
    updateWelcomeChannel: {
      type: GuildConfigType,
      args: {
        guildId: { type: GraphQLString },
        channelId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {
        const { guildId, channelId } = args;
        if (!guildId || !channelId || !request.user) return null;
        const config = await GuildConfig.findOneAndUpdate(
          { id: guildId },
          { welcomechannelid: channelId }
        );
        console.log(config);
        return config ? config : null;
      },
    },
    updateModLogChannel: {
      type: GuildConfigType,
      args: {
        guildId: { type: GraphQLString },
        channelId: { type: GraphQLString },
      },
      async resolve(parent, args, request) {},
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: MutationQuery,
});

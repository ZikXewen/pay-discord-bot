import { toEmbed } from "../utils.js";
import { Command } from "../types.js";
import { GuildTextBasedChannel } from "discord.js";

export default {
  name: "Play",
  cmds: ["play", "p"],
  run: (distube, message, args) => {
    if (args.length === 0) {
      message.channel.send(toEmbed("Please Enter URL or Search Terms.", "RED"));
    }
    distube
      .play(message.member.voice?.channel, args.join(" "), {
        member: message.member,
        textChannel: message.channel as GuildTextBasedChannel,
        message,
      })
      .catch(({ errorCode }) => {
        if (errorCode == "NOT_IN_VOICE")
          message.channel.send(
            toEmbed("Please join a voice channel first. :slight_smile:", "RED")
          );
      });
  },
} as Command;

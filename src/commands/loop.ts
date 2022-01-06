import { Command } from "../types.js";
import { toEmbed } from "../utils.js";

export default {
  name: "Loop",
  cmds: ["loop", "repeat", "l"],
  run: (distube, message) => {
    if (!distube.getQueue(message)) {
      return message.channel.send(toEmbed("No songs... :slight_smile:", "RED"));
    }
    const mode = distube.setRepeatMode(message);
    message.channel.send(
      toEmbed(
        "Repeat mode set to **" + ["None", "Single", "Queue"][mode] + "**"
      )
    );
  },
} as Command;

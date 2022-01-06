import { MessageEmbed } from "discord.js";
import { Command } from "../types.js";
import { toEmbed } from "../utils.js";

export default {
  name: "Queue",
  cmds: ["queue", "q"],
  run: (distube, message) => {
    const queue = distube.getQueue(message);
    if (!queue)
      return message.channel.send(toEmbed("No songs... :slight_smile:", "RED"));
    message.channel.send({
      embeds: [
        new MessageEmbed({
          title: "Current Queue",
          description: queue.songs
            .map(
              (song, id) =>
                `${id + 1}: [${song.name}](${song.url}) (${
                  song.formattedDuration
                })`
            )
            .join("\n")
            .slice(0, 4000),
        }),
      ],
    });
  },
} as Command;

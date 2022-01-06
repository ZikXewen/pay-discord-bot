import { MessageEmbed } from "discord.js";
import { Command } from "../types.js";
import { toEmbed } from "../utils.js";

export default {
  name: "Filter",
  cmds: ["filter", "f"],
  run: (distube, message, args) => {
    const queue = distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        toEmbed("Play some songs to apply filters.", "RED")
      );
    if (args[0] === "off" && queue.filters.length > 0) {
      queue.setFilter(false);
    } else if (Object.keys(distube.filters).includes(args[0])) {
      queue.setFilter(args[0]);
    } else if (args[0]) {
      message.channel.send(toEmbed("Invalid Filter.", "RED"));
    } else {
      message.channel.send({
        embeds: [
          new MessageEmbed({
            title: "Active Filters",
            description:
              queue.filters.length > 0 ? queue.filters.join("\n") : "None.",
          }),
        ],
      });
      message.channel.send({
        embeds: [
          new MessageEmbed({
            title: "Available Filters",
            description: Object.keys(distube.filters)
              .map((fil) => `- ${fil}`)
              .join("\n"),
          }),
        ],
      });
    }
  },
} as Command;

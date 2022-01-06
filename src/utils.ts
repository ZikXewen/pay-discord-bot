import axios from "axios";
import { ColorResolvable, MessageEmbed, MessageOptions } from "discord.js";

export const toEmbed = (desc: string, color?: ColorResolvable) =>
  ({
    embeds: [new MessageEmbed({ description: desc, color: color })],
  } as MessageOptions);

export const logger = (type: string, message: string) => {
  axios
    .get(
      process.env.LOG_ENDPOINT +
        type.toUpperCase() +
        ":%20" +
        encodeURIComponent(message)
    )
    .catch(console.error);
  if (type === "error") console.error(message);
};

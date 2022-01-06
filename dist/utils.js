import axios from "axios";
import { MessageEmbed } from "discord.js";
export const toEmbed = (desc, color) => ({
    embeds: [new MessageEmbed({ description: desc, color: color })],
});
export const logger = (type, message) => {
    axios
        .get(process.env.LOG_ENDPOINT +
        type.toUpperCase() +
        ":%20" +
        encodeURIComponent(message))
        .catch(console.error);
    if (type === "error")
        console.error(message);
};

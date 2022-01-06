import { toEmbed } from "../utils.js";
export default {
    name: "Stop",
    cmds: ["stop", "disconnect", "dc", "st"],
    run: (distube, message) => {
        const queue = distube.getQueue(message);
        if (!queue)
            return message.channel.send(toEmbed("No songs... :slight_smile:", "RED"));
        distube.stop(message);
    },
};

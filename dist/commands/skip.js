import { toEmbed } from "../utils.js";
export default {
    name: "Skip",
    cmds: ["skip", "s"],
    run: (distube, message) => {
        const queue = distube.getQueue(message);
        if (!queue)
            return message.channel.send(toEmbed("No songs... :slight_smile:", "RED"));
        if (queue.songs.length > 1)
            distube.skip(message);
        else
            distube.stop(message);
    },
};

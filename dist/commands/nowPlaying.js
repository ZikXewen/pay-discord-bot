import { toEmbed } from "../utils.js";
export default {
    name: "Now Playing",
    cmds: ["nowplaying", "np", "now"],
    run: (distube, message) => {
        const queue = distube.getQueue(message);
        if (!queue)
            return message.channel.send(toEmbed("No song is playing... :slight_smile:", "RED"));
        const song = queue.songs[0];
        message.channel.send(toEmbed(`Now Playing: [**${song.name}**](${song.url}) (${song.formattedDuration}) - Requested by ${song.user.tag}`));
    },
};

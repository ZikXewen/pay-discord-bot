import { toEmbed } from "../utils.js";
export default {
    name: "Play",
    cmds: ["play", "p"],
    run: (distube, message, args) => {
        if (args.length === 0) {
            message.channel.send(toEmbed("Please Enter URL or Search Terms.", "RED"));
        }
        distube.play(message, args.join(" ")).catch(({ errorCode }) => {
            if (errorCode == "NOT_IN_VOICE")
                message.channel.send(toEmbed("Please join a voice channel first. :slight_smile:", "RED"));
        });
    },
};

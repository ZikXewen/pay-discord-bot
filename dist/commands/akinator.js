import akinator from "discord.js-akinator";
import { logger } from "../utils.js";
export default {
    name: "Akinator",
    cmds: ["akinator", "aki"],
    run: (distube, message) => {
        logger("info", `${message.member.user.tag} used Akinator in ${message.guild}.`);
        akinator(message, { useButtons: true, embedColor: "GREY" });
    },
};

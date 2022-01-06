import axios from "axios";
import { logger, toEmbed } from "../utils.js";
export default {
    name: "Salim",
    cmds: ["salim", "sl"],
    run: (distube, message, args) => {
        logger("info", `${message.member.user.tag} used Salim in ${message.guild}.`);
        if (args[0]) {
            axios
                .post("https://api-inference.huggingface.co/models/tupleblog/salim-classifier", {
                inputs: args.join(" ") + (args.join(" ").length < 50 ? "<pad>" : ""),
            }, {
                headers: {
                    Authorization: "Bearer " + process.env.HF_KEY,
                },
            })
                .then(({ data }) => {
                const score = data[0][1].score * 100;
                message.channel.send(`This quote is ${score.toFixed(2)}% Salim.` +
                    (score > 80 ? " :cold_face::cold_face:" : ""));
            })
                .catch((err) => {
                logger("error", err);
                message.channel.send(toEmbed("Error Salim classification request :frowning:", "RED"));
            });
        }
        else {
            axios
                .get("https://watasalim.vercel.app/api/quotes/random")
                .then(({ data }) => message.channel.send(data.quote.body))
                .catch(() => message.channel.send(toEmbed("Error fetching Salim quotes :frowning:", "RED")));
        }
    },
};

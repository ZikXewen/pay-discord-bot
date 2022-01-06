import Discord from "discord.js";
import { DisTube } from "distube";
import { SpotifyPlugin } from "@distube/spotify";
import dotenv from "dotenv";
import { readdirSync } from "fs";
import { logger, toEmbed } from "./utils.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();
const commands = await Promise.all(readdirSync(__dirname + "/commands/").map(async (file) => (await import(`./commands/${file.slice(0, -3)}.js`)).default));
const prefix = "??";
const client = new Discord.Client({
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
});
const distube = new DisTube(client, {
    searchSongs: 10,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    nsfw: true,
    plugins: [new SpotifyPlugin()],
    youtubeCookie: process.env.COOKIE,
});
client
    .on("ready", () => {
    console.log(`${client.user.tag} logged in. Ready to run!`);
    client.user.setActivity({ type: "COMPETING", name: "??help" });
})
    .on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith(prefix))
        return;
    const args = message.content.slice(prefix.length).trim().split(/\s+/g);
    const command = args.shift();
    commands.forEach(({ cmds, run }) => {
        if (cmds.includes(command))
            run(distube, message, args);
    });
    if (["help", "h", "commands", "cmds"].includes(command)) {
        message.channel.send({
            embeds: [
                new Discord.MessageEmbed({
                    title: "Commands",
                    description: commands
                        .map(({ name, cmds }) => `**${name}**: ${cmds.join(", ")}`)
                        .join("\n"),
                }),
            ],
        });
    }
});
distube
    .on("addSong", (queue, song) => {
    logger("info", `${song.member.user.tag} added ${song.name} to ${song.member.guild}.`);
    queue.textChannel.send(toEmbed(`Added [**${song.name}**](${song.url}) to queue.`, "GREEN"));
})
    .on("playSong", (queue, song) => {
    queue.textChannel.send(toEmbed(`Started Playing: [**${song.name}**](${song.url}) (${song.formattedDuration}) - Requested by ${song.user.tag}`));
})
    .on("disconnect", (queue) => {
    queue.textChannel.send(toEmbed("Leaving the Voice Channel..."));
})
    .on("searchCancel", (message) => {
    message.channel.send(toEmbed("Search Canceled.", "RED"));
})
    .on("searchDone", () => {
})
    .on("searchNoResult", (message) => {
    message.channel.send(toEmbed("Found Nothing...", "RED"));
})
    .on("searchInvalidAnswer", (message) => {
    message.channel.send(toEmbed("Invalid Answer. Search Canceled.", "RED"));
})
    .on("searchResult", (message, results) => {
    message.channel.send({
        embeds: [
            new Discord.MessageEmbed({
                title: "Search Results",
                description: results
                    .map((result, key) => `${key + 1}: [**${result.name}**](${result.url}) (${result.formattedDuration})`)
                    .join("\n"),
                footer: {
                    text: "Type (1-10) to choose songs, or type other texts to cancel.",
                },
            }),
        ],
    });
})
    .on("error", (channel, error) => {
    channel.send(toEmbed(error.toString().slice(0, 1999), "RED"));
});
client.login(process.env.BOT_TOKEN);

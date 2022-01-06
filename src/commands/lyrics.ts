import axios from "axios";
import { MessageEmbed } from "discord.js";
import { Command, MMResponse } from "../types.js";
import { toEmbed } from "../utils.js";

export default {
  name: "Lyrics",
  cmds: ["lyrics", "ly"],
  run: (distube, message, args) => {
    const queue = distube.getQueue(message);
    if (args[0] || queue) {
      axios
        .get<MMResponse>(
          encodeURI(
            `https://api.musixmatch.com/ws/1.1/track.search?apikey=${
              process.env.MM_KEY
            }&q=${
              args[0]
                ? args.join(" ").replace("/", "*")
                : queue.songs[0].name.replace("/", "*")
            }&s_track_rating=desc`
          )
        )
        .then(({ data, status }) => {
          if (status != 200) {
            message.channel.send(
              `Error Searching Lyrics. Status: ${status} :frowning:`
            );
          } else if (data.message.body.track_list[0]) {
            message.channel.send({
              embeds: [
                new MessageEmbed({
                  title: "Lyrics Found",
                  author: {
                    name: "Powered by Musixmatch",
                    url: "https://www.musixmatch.com/",
                  },
                  description: data.message.body.track_list
                    .map(
                      ({ track }, key) =>
                        `${key + 1}: [**${track.track_name}** - ${
                          track.artist_name
                        }](${track.track_share_url})`
                    )
                    .join("\n"),
                  footer: { text: "Follow the links for you lyrics" },
                }),
              ],
            });
          } else {
            message.channel.send(
              toEmbed(
                args[0]
                  ? "We couldn't find any lyrics for your query. :frowning:"
                  : "Not found... Try searching with search terms instead."
              )
            );
          }
        });
    } else {
      message.channel.send(
        toEmbed(
          "Play some songs or enter search terms for lyrics search :slight_smile:",
          "RED"
        )
      );
    }
  },
} as Command;

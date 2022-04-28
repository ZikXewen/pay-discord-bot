import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'
import { MessageEmbed } from 'discord.js'
import { Command, MMResponse } from '../types.js'
import { toEmbed } from '../utils.js'

const lyrics: Command = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Get lyrics of a track.')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription(
          "Name of the track to search for lyrics. Leave empty to use current track's title"
        )
        .setRequired(false)
    ),
  exec: async (interaction) => {
    await interaction.deferReply()
    const track =
      interaction.options.getString('name') ||
      interaction.client.distube.getQueue(interaction)?.songs[0].name
    if (!track) {
      interaction.editReply(
        toEmbed(
          'Play some songs or enter search terms for lyrics search :slight_smile:',
          'RED'
        )
      )
      return
    }
    try {
      const response = (
        await axios.get<MMResponse>(
          `https://api.musixmatch.com/ws/1.1/track.search?apikey=${
            process.env.MM_KEY
          }&q=${encodeURI(track)}&s_track_rating=desc`
        )
      ).data
      const track_list = response.message.body.track_list
      if (!track_list[0]) {
        interaction.editReply(
          toEmbed(
            "We couldn't find any lyrics for your query. :frowning:",
            'RED'
          )
        )
      } else {
        interaction.editReply({
          embeds: [
            new MessageEmbed({
              title: 'Lyrics Found',
              author: {
                name: 'Powered by Musixmatch',
                url: 'https://www.musixmatch.com/',
              },
              description: track_list
                .map(
                  ({ track }, key) =>
                    `${key + 1}: [**${track.track_name}** - ${
                      track.artist_name
                    }](${track.track_share_url})`
                )
                .join('\n'),
              footer: { text: 'Follow the links for your lyrics' },
            }),
          ],
        })
      }
    } catch (error) {
      interaction.editReply(
        toEmbed(`Error Searching Lyrics. :frowning:`, 'RED')
      )
    }
  },
}

export default lyrics

import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const nowPlaying: Command = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Get the name of the current track.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) {
      interaction.reply(
        toEmbed('No song is playing... :slight_smile:', Colors.Red)
      )
      return
    }
    const { name, url, formattedDuration, user } = queue.songs[0]
    interaction.reply(
      toEmbed(
        `Now Playing: [**${name}**](${url}) (${formattedDuration}) - Requested by ${user.tag}`
      )
    )
  },
}

export default nowPlaying

import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed, trackEmbed } from '../utils.js'

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
    interaction.reply(trackEmbed('Now Playing', queue.songs[0]))
  },
}

export default nowPlaying

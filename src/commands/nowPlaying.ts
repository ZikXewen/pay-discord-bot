import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'
import { trackEmbed } from '../utils/trackEmbed.js'

const nowPlaying: Command = {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Get the name of the current track.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    await interaction.reply(
      queue
        ? trackEmbed('Now Playing', queue.songs[0])
        : toEmbed('No song is playing... :slight_smile:', Colors.Red)
    )
  },
}

export default nowPlaying

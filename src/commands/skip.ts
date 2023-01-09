import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

const skip: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (queue)
      await Promise.all([
        interaction.reply(toEmbed('Skipping current track...')),
        queue.songs.length > 1
          ? interaction.client.distube.skip(interaction)
          : interaction.client.distube.stop(interaction),
      ])
    else
      await interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
  },
}

export default skip

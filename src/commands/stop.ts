import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

const stop: Command = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Remove all tracks and disconnect.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue)
      interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
    else
      await Promise.all([
        interaction.reply(toEmbed('Removing all tracks...')),
        queue.stop(),
      ])
  },
}

export default stop

import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const stop: Command = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Remove all tracks and disconnect.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) interaction.reply(toEmbed('No songs... :slight_smile:', 'RED'))
    else {
      interaction.client.distube.stop(interaction)
      interaction.reply(toEmbed('Removing all tracks...'))
    }
  },
}

export default stop

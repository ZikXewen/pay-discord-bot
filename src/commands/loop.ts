import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const loop: Command = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Change track looping mode.'),
  exec: async (interaction) => {
    if (interaction.client.distube.getQueue(interaction)) {
      const mode = interaction.client.distube.setRepeatMode(interaction)
      interaction.reply(
        toEmbed(
          'Repeat mode set to **' + ['None', 'Single', 'Queue'][mode] + '**'
        )
      )
    } else {
      interaction.reply(toEmbed('No songs... :slight_smile:', 'RED'))
    }
  },
}

export default loop

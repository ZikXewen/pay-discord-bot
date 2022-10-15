import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

const modes = ['None', 'Single', 'Queue']

const loop: Command = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Change track looping mode.')
    .addIntegerOption((option) =>
      option
        .setName('mode')
        .setDescription('Looping mode to switch to')
        .setRequired(true)
        .addChoices(...modes.map((mode, idx) => ({ name: mode, value: idx })))
    ),
  exec: async (interaction) => {
    if (interaction.client.distube.getQueue(interaction)) {
      const mode = interaction.options.getInteger('mode')
      if (!mode) throw new Error('Unspecified mode')
      interaction.client.distube.setRepeatMode(interaction, mode)
      interaction.reply(toEmbed('Repeat mode set to **' + modes[mode] + '**'))
    } else {
      interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
    }
  },
}

export default loop

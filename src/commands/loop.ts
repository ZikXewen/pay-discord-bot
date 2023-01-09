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
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) {
      await interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
      return
    }
    const mode = interaction.options.getInteger('mode') || 0
    queue.setRepeatMode(mode)
    await interaction.reply(
      toEmbed('Repeat mode set to **' + modes[mode] + '**')
    )
  },
}

export default loop

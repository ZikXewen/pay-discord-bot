import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const roll: Command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a dice')
    .addIntegerOption((option) =>
      option.setName('min').setDescription('Minimum roll').setRequired(false)
    )
    .addIntegerOption((option) =>
      option.setName('max').setDescription('Maximum roll').setRequired(false)
    ),
  exec: async (interaction) => {
    const min = interaction.options.getInteger('min') || 1
    const max = interaction.options.getInteger('max') || 6
    if (min > max) interaction.reply(toEmbed('Invalid Range!', 'RED'))
    else
      interaction.reply(
        toEmbed(`:game_die: Rolled ${Math.ceil(Math.random() * 6)}`)
      )
  },
}

export default roll

import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
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
    if (min > max) interaction.reply(toEmbed('Invalid Range!', Colors.Red))
    else
      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `:game_die: Got ${
                min + Math.floor(Math.random() * (max - min + 1))
              }.`
            )
            .setFooter({ text: `Rolled from ${min} to ${max}` }),
        ],
      })
  },
}

export default roll

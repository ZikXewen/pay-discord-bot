import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types'
import Skoy from 'skoy'

const skoy: Command = {
  data: new SlashCommandBuilder()
    .setName('skoy')
    .setDescription('Transform a Thai quote to Skoy language.')
    .addStringOption((option) =>
      option.setName('quote').setDescription('Original quote').setRequired(true)
    ),
  exec: async (interaction) => {
    const quote = interaction.options.getString('quote')
    interaction.reply(`${Skoy.convert(quote)} (${quote})`)
  },
}

export default skoy
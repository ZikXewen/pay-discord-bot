import { SlashCommandBuilder } from '@discordjs/builders'
import aki from 'discord.js-akinator'
import { Command } from '../types.js'

const akinator: Command = {
  data: new SlashCommandBuilder()
    .setName('akinator')
    .setDescription('Start an Akinator game.'),
  exec: async (interaction) => {
    aki(interaction, { useButtons: true, embedColor: 'GREY' })
  },
}

export default akinator

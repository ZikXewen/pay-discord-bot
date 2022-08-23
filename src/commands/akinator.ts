import { SlashCommandBuilder } from 'discord.js'
import aki from 'discord.js-akinator'
import { Command } from '../types'

const akinator: Command = {
  data: new SlashCommandBuilder()
    .setName('akinator')
    .setDescription('Start an Akinator game.'),
  exec: async (interaction) => {
    aki(interaction, { useButtons: true, embedColor: '#99AAB5' })
  },
}

export default akinator

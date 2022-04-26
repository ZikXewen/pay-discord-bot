import { SlashCommandBuilder } from '@discordjs/builders'
import aki from 'discord.js-akinator'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const akinator: Command = {
  data: new SlashCommandBuilder()
    .setName('akinator')
    .setDescription('Start an Akinator game.'),
  exec: async (interaction) => {
    interaction.reply({ ...toEmbed('Starting game...'), ephemeral: true })
    aki(interaction, { useButtons: true, embedColor: 'GREY' })
  },
}

export default akinator

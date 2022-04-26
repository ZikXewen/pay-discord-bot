import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const skip: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) {
      interaction.reply(toEmbed('No songs... :slight_smile:', 'RED'))
      return
    }
    if (queue.songs.length > 1) interaction.client.distube.skip(interaction)
    else interaction.client.distube.stop(interaction)
    interaction.reply(toEmbed('Skipping current track...'))
  },
}

export default skip

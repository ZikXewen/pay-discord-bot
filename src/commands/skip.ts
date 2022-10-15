import { Colors, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

const skip: Command = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip current track.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) {
      interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
      return
    }
    if (queue.songs.length > 1) interaction.client.distube.skip(interaction)
    else interaction.client.distube.stop(interaction)
    interaction.reply(toEmbed('Skipping current track...'))
  },
}

export default skip

import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const queue: Command = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('List all tracks in the queue.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue) interaction.reply(toEmbed('No songs... :slight_smile:', 'RED'))
    else
      interaction.reply({
        embeds: [
          new MessageEmbed({
            title: 'Current Queue',
            description: queue.songs
              .map(
                (song, id) =>
                  `${id + 1}: [${song.name}](${song.url}) (${
                    song.formattedDuration
                  })`
              )
              .join('\n')
              .slice(0, 4000),
          }),
        ],
      })
  },
}

export default queue

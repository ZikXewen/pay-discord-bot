import { Colors, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const queue: Command = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('List all tracks in the queue.'),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue)
      interaction.reply(toEmbed('No songs... :slight_smile:', Colors.Red))
    else
      interaction.reply({
        embeds: [
          new EmbedBuilder().setTitle('Current Queue').setDescription(
            queue.songs
              .map(
                (song, id) =>
                  `${id + 1}: [${song.name}](${song.url}) (${
                    song.formattedDuration
                  })`
              )
              .join('\n')
              .slice(0, 4000)
          ),
        ],
      })
  },
}

export default queue

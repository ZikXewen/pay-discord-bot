import { SlashCommandBuilder } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { defaultFilters } from 'distube'
import { Command } from '../types.js'
import { toEmbed } from '../utils.js'

const filter: Command = {
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Toggle or list filters.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('toggle')
        .setDescription('Toggle a filter')
        .addStringOption((option) =>
          option
            .setName('filter')
            .setDescription('Name of the filter to toggle')
            .setRequired(true)
            .addChoices(
              ...Object.keys(defaultFilters).map((filter) => ({
                name: filter,
                value: filter,
              }))
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('off').setDescription('Remove all active filters')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('active').setDescription('List all active filters')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('list').setDescription('List all available filters')
    ),
  exec: async (interaction) => {
    const queue = interaction.client.distube.getQueue(interaction)
    if (!queue)
      return interaction.reply(
        toEmbed('Play some songs to apply filters.', 'RED')
      )

    const subcommand = interaction.options.getSubcommand()

    switch (subcommand) {
      case 'off':
        queue.setFilter(false)
        interaction.reply(toEmbed('Turned off all filters.'))
        break
      case 'list':
        interaction.reply({
          embeds: [
            new MessageEmbed({
              title: 'Available Filters',
              description: Object.keys(defaultFilters)
                .map((fil) => `- ${fil}`)
                .join('\n'),
            }),
          ],
        })
        break
      case 'active':
        interaction.reply({
          embeds: [
            new MessageEmbed({
              title: 'Active Filters',
              description:
                queue.filters.length > 0
                  ? queue.filters.map((fil) => `- ${fil}`).join('\n')
                  : 'None.',
            }),
          ],
        })
        break
      case 'toggle': {
        const filter = interaction.options.getString('filter')
        queue.setFilter(filter)
        interaction.reply(toEmbed(`Toggled ${filter}`))
        break
      }
    }
  },
}

export default filter

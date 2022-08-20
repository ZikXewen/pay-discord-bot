import { SlashCommandBuilder, EmbedBuilder, Colors } from 'discord.js'
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
    const subcommand = interaction.options.getSubcommand()

    if (subcommand === 'list') {
      interaction.reply({
        embeds: [
          new EmbedBuilder().setTitle('Available Filters').setDescription(
            Object.keys(defaultFilters)
              .map((fil) => `- ${fil}`)
              .join('\n')
          ),
        ],
      })
      return
    }

    const queue = interaction.client.distube.getQueue(interaction)

    if (!queue) {
      interaction.reply(
        toEmbed('Play some songs to apply filters.', Colors.Red)
      )
      return
    }
    switch (subcommand) {
      case 'off':
        queue.filters.clear()
        interaction.reply(toEmbed('Cleared all filters.'))
        break
      case 'active':
        interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Active Filters')
              .setDescription(
                queue.filters.size > 0
                  ? queue.filters.names.map((fil) => `- ${fil}`).join('\n')
                  : 'None.'
              ),
          ],
        })
        break
      case 'toggle': {
        const filter = interaction.options.getString('filter')
        if (queue.filters.has(filter)) queue.filters.remove(filter)
        else queue.filters.add(filter)
        interaction.reply(toEmbed(`Toggled ${filter}`))
        break
      }
    }
  },
}

export default filter

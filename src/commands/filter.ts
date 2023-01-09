import { SlashCommandBuilder, EmbedBuilder, Colors } from 'discord.js'
import { defaultFilters } from 'distube'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

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
      await interaction.reply({
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
      await interaction.reply(
        toEmbed('Play some songs to apply filters.', Colors.Red)
      )
      return
    }
    switch (subcommand) {
      case 'off':
        queue.filters.clear()
        await interaction.reply(toEmbed('Cleared all filters.'))
        break
      case 'active':
        await interaction.reply({
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
        if (!filter) throw new Error('Unspecified filter')
        if (queue.filters.has(filter)) queue.filters.remove(filter)
        else queue.filters.add(filter)
        await interaction.reply(toEmbed(`Toggled ${filter}`))
        break
      }
    }
  },
}

export default filter

import { Command } from '../types'
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} from 'discord.js'
import { isURL, SearchResultType } from 'distube'
import { addTrack } from '../utils/addTrack.js'
import { toEmbed } from '../utils/toEmbed.js'

const play: Command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a track from name/url.')
    .addStringOption((option) =>
      option
        .setName('track')
        .setDescription('Name or URL of the track.')
        .setRequired(true)
    ),
  exec: async (interaction) => {
    await interaction.deferReply({ ephemeral: true })
    const track = interaction.options.getString('track')
    if (!track) throw new Error('Unspecified track')
    if (isURL(track)) {
      await Promise.all([
        interaction.editReply(toEmbed('Added to queue')),
        addTrack(interaction, track),
      ])
      return
    }
    const results = await interaction.client.distube.search(track, {
      type: SearchResultType.VIDEO,
    })
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setTitle('Search Results')
          .setDescription(
            results
              .map(
                ({ name, url, formattedDuration }, key) =>
                  `${key + 1}: [**${name}**](${url}) (${formattedDuration})`
              )
              .join('\n')
          ),
      ],
      components: [
        new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('track')
            .setPlaceholder('Select Track.')
            .addOptions(
              results.map(({ name, url }, key) => ({
                label: `${key + 1}: ${name}`.slice(0, 99),
                value: url,
              }))
            )
        ),
      ],
    })
  },
}

export default play

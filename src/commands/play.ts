import { Command } from '../types.js'
import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
} from 'discord.js'
import { isURL, SearchResultType, SearchResultVideo } from 'distube'
import { customPlay, toEmbed } from '../utils.js'

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

    if (isURL(track)) {
      await interaction.editReply(toEmbed('Added to queue'))
      return customPlay(interaction, track)
    }
    const results = (await interaction.client.distube.search(track, {
      type: SearchResultType.VIDEO,
    })) as SearchResultVideo[]
    interaction.editReply({
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
        new ActionRowBuilder<SelectMenuBuilder>().addComponents(
          new SelectMenuBuilder()
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

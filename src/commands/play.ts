import { Command } from '../types.js'
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'

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
    // if (track.noturl()) {
    const results = await interaction.client.distube.search(track)
    interaction.editReply({
      embeds: [
        new MessageEmbed({
          title: 'Search Results',
          description: results
            .map(
              ({ name, url, formattedDuration }, key) =>
                `${key + 1}: [**${name}**](${url}) (${formattedDuration})`
            )
            .join('\n'),
        }),
      ],
      components: [
        new MessageActionRow({
          components: [
            new MessageSelectMenu({
              customId: 'track',
              placeholder: 'Select Track.',
              options: results.map(({ name, url }, key) => ({
                label: `${key + 1}: ${name}`,
                value: url,
              })),
            }),
          ],
        }),
      ],
    })
  },
}

export default play

import {
  Colors,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils.js'

const avatar: Command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription("Retrieve a user's avatar")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Select the user.')
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('type')
        .setDescription(
          'Select whether to retrieve their server avatar or global avatar.'
        )
        .addChoices(
          { name: 'Global Avatar', value: 0 },
          { name: 'Server Avatar', value: 1 }
        )
    )
    .addBooleanOption((option) =>
      option
        .setName('ephemeral')
        .setDescription(
          'With this option on, only you see the retrieved image.'
        )
    ),
  exec: async (interaction) => {
    try {
      await interaction.deferReply({
        ephemeral: interaction.options.getBoolean('ephemeral') || false,
      })
      const user = interaction.options.getMember('user')
      const server = interaction.options.getInteger('type')
      if (!(user instanceof GuildMember)) throw new Error()
      const image = server
        ? user.avatarURL({ size: 4096 })
        : user.user.avatarURL({ size: 4096 })
      if (!image) throw new Error()
      await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setTitle(
              `${server ? 'Server' : 'Global'} avatar of ${user.user.tag}`
            )
            .setImage(image),
        ],
      })
    } catch {
      await interaction.editReply(
        toEmbed('User have no such avatar.', Colors.Red)
      )
    }
  },
}

export default avatar

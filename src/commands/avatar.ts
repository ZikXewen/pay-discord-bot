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
    const user = interaction.options.getMember('user')
    try {
      if (!(user instanceof GuildMember)) throw new Error()
      const image = interaction.options.getInteger('type')
        ? user.avatarURL({ size: 4096 })
        : user.user.avatarURL({ size: 4096 })
      if (!image) throw new Error()
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Avatar of ${user.user.tag}`)
            .setImage(image),
        ],
        ephemeral: interaction.options.getBoolean('ephemeral') || false,
      })
    } catch {
      await interaction.reply(toEmbed('User have no such avatar.', Colors.Red))
    }
  },
}

export default avatar

import {
  Colors,
  CommandInteraction,
  GuildMember,
  StringSelectMenuInteraction,
} from 'discord.js'
import { toEmbed } from './toEmbed.js'

export const addTrack = async (
  interaction: CommandInteraction | StringSelectMenuInteraction,
  track: string
) => {
  if (
    interaction.inGuild() &&
    interaction.member instanceof GuildMember &&
    interaction.member.voice.channel
  )
    await interaction.client.distube
      .play(interaction.member.voice.channel, track, {
        member: interaction.member,
        textChannel: interaction.channel || undefined,
      })
      .catch((err) => {
        console.error(err)
        interaction.editReply(
          toEmbed('Cannot add this track. :slight_smile:', Colors.Red)
        )
      })
  else
    await interaction.editReply(
      toEmbed('Please join a voice channel first. :slight_smile:', Colors.Red)
    )
}

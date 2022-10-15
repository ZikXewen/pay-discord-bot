import {
  Colors,
  CommandInteraction,
  GuildMember,
  SelectMenuInteraction,
} from 'discord.js'
import { toEmbed } from './toEmbed.js'

export const customPlay = (
  interaction: CommandInteraction | SelectMenuInteraction,
  track: string
) => {
  if (
    interaction.inGuild() &&
    interaction.member instanceof GuildMember &&
    interaction.member.voice.channel
  )
    interaction.client.distube
      .play(interaction.member.voice.channel, track, {
        member: interaction.member,
        textChannel: interaction.channel || undefined,
      })
      .catch()
  else
    interaction.editReply(
      toEmbed('Please join a voice channel first. :slight_smile:', Colors.Red)
    )
}

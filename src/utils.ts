import {
  ColorResolvable,
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  SelectMenuInteraction,
  Colors,
} from 'discord.js'

export const toEmbed = (desc: string, color?: ColorResolvable) => ({
  embeds: [new EmbedBuilder().setColor(color || null).setDescription(desc)],
})

export const customPlay = (
  interaction: CommandInteraction | SelectMenuInteraction,
  track: string
) => {
  if (
    interaction.member instanceof GuildMember &&
    interaction.member.voice.channel
  )
    interaction.client.distube
      .play(interaction.member.voice.channel, track, {
        member: interaction.member,
        textChannel: interaction.channel,
      })
      .catch()
  else
    interaction.editReply(
      toEmbed('Please join a voice channel first. :slight_smile:', Colors.Red)
    )
}

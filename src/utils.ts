import {
  ColorResolvable,
  CommandInteraction,
  GuildMember,
  GuildTextBasedChannel,
  MessageEmbed,
  SelectMenuInteraction,
} from 'discord.js'

export const toEmbed = (desc: string, color?: ColorResolvable) => ({
  embeds: [new MessageEmbed({ description: desc, color })],
})

export const customPlay = (
  interaction: CommandInteraction | SelectMenuInteraction,
  track: string
) => {
  const voiceChannel = (interaction.member as GuildMember).voice.channel
  if (voiceChannel)
    interaction.client.distube
      .play(voiceChannel, track, {
        member: interaction.member as GuildMember,
        textChannel: interaction.channel as GuildTextBasedChannel,
      })
      .catch()
  else
    interaction.editReply(
      toEmbed('Please join a voice channel first. :slight_smile:', 'RED')
    )
}

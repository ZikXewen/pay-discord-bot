import {
  ColorResolvable,
  CommandInteraction,
  GuildMember,
  EmbedBuilder,
  SelectMenuInteraction,
  Colors,
} from 'discord.js'
import { Song } from 'distube'

export const toEmbed = (desc: string, color?: ColorResolvable) => ({
  embeds: [new EmbedBuilder().setColor(color || null).setDescription(desc)],
})

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

export const trackEmbed = (
  title: string,
  { name, url, formattedDuration, user, thumbnail }: Song,
  color?: ColorResolvable
) => ({
  embeds: [
    new EmbedBuilder()
      .setTitle(title)
      .setDescription(`[**${name}**](${url}) (${formattedDuration})`)
      .setFooter({ text: user?.tag || '', iconURL: user?.displayAvatarURL() })
      .setImage(thumbnail || null)
      .setColor(color || null),
  ],
})

import { ColorResolvable, EmbedBuilder } from 'discord.js'
import { Song } from 'distube'

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

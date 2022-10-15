import { ColorResolvable, EmbedBuilder } from 'discord.js'

export const toEmbed = (desc: string, color?: ColorResolvable) => ({
  embeds: [new EmbedBuilder().setColor(color || null).setDescription(desc)],
})

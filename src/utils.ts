import { ColorResolvable, MessageEmbed, MessageOptions } from 'discord.js'

export const toEmbed = (
  desc: string,
  color?: ColorResolvable
): MessageOptions => ({
  embeds: [new MessageEmbed({ description: desc, color: color })],
})

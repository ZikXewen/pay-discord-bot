import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'

export type Command = {
  data: Pick<SlashCommandBuilder, 'toJSON' | 'name'>
  exec: (interaction: ChatInputCommandInteraction) => Promise<void>
}

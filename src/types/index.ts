import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js'

export type CommandOption = {
  type: string
  name: string
  description: string
  required: boolean
}

export type Command = {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  exec: (interaction: ChatInputCommandInteraction) => Promise<void>
}

export type MMResponse = {
  message: {
    body: { track_list: { track: Track }[] }
  }
}
export type Track = {
  artist_name: string
  track_name: string
  track_share_url: string
}

export type HFResponse = {
  label: string
  score: number
}[][]

export type WSResponse = {
  quote: {
    body: string
  }
}

export type Skin = {
  levels: [{ uuid: string; displayIcon: string }]
  displayName: string
  displayIcon: string
  contentTierUuid: string
}

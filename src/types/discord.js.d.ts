import { Collection } from 'discord.js'
import DisTube from 'distube'
import { Command } from '.'

declare module 'discord.js' {
  interface Client {
    distube: DisTube
    commands: Collection<string, Command>
  }
}

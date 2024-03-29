import { REST, Routes } from 'discord.js'

import dotenv from 'dotenv'
import commands from './commands/index.js'

dotenv.config()
if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN not found')
if (!process.env.BOT_ID) throw new Error('BOT_ID not found')

const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

const commands_json = commands.map((command) => command.data.toJSON())

rest
  .put(
    // Routes.applicationGuildCommands(process.env.BOT_ID, process.env.GUILD_ID),
    Routes.applicationCommands(process.env.BOT_ID),
    {
      body: commands_json,
    }
  )
  .then(() => console.log('commands pushed'))
  .catch(console.error)

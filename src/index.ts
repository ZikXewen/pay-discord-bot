import {
  ActivityType,
  Client,
  Collection,
  Colors,
  GatewayIntentBits,
} from 'discord.js'
import { DisTube } from 'distube'
import { SpotifyPlugin } from '@distube/spotify'
import { YtDlpPlugin } from '@distube/yt-dlp'
import dotenv from 'dotenv'

import { customPlay } from './utils/customPlay.js'
import { toEmbed } from './utils/toEmbed.js'
import { trackEmbed } from './utils/trackEmbed.js'
import commands from './commands/index.js'
import mongoose from 'mongoose'

// Load Environment Variables
dotenv.config()
if (!process.env.DB_URL) throw new Error('DB_URL not found')

// Connect to DB
await mongoose.connect(process.env.DB_URL)

// Initialize Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
  ],
})

client.commands = new Collection()
commands.forEach((command) => {
  client.commands.set(command.data.name, command)
})

client
  .on('ready', () => {
    console.log(`${client.user?.tag} logged in. Ready to run!`)
    client.user?.setActivity({ type: ActivityType.Listening, name: 'itself' })
  })
  .on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName)
      if (!command) return
      try {
        await command.exec(interaction)
      } catch (err) {
        console.error(err)
        interaction.channel?.send('Command Error')
      }
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId === 'track') {
        await interaction.update({
          components: [],
        })
        customPlay(interaction, interaction.values[0])
      }
    }
  })

// Initialize Distube

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  nsfw: true,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin()],
  youtubeCookie: process.env.COOKIE,
})

client.distube
  .on('addSong', (queue, song) => {
    queue.textChannel?.send(trackEmbed('Added Track', song, Colors.Green))
  })
  .on('playSong', (queue, song) => {
    queue.textChannel?.send(trackEmbed('Started Playing', song))
  })
  .on('disconnect', (queue) => {
    queue.textChannel?.send(toEmbed('Leaving the Voice Channel...'))
  })
  .on('error', (channel, error) => {
    console.error(error)
    channel?.send(toEmbed(error.toString().slice(0, 1999), Colors.Red))
  })

client.login(process.env.BOT_TOKEN)

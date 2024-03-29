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

import { addTrack } from './utils/addTrack.js'
import { toEmbed } from './utils/toEmbed.js'
import { trackEmbed } from './utils/trackEmbed.js'
import commands from './commands/index.js'
import mongoose from 'mongoose'

// Load Environment Variables
dotenv.config()
if (!process.env.DB_URL) throw new Error('DB_URL not found')

// Connect to DB
mongoose.set('strictQuery', false)
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
      await command.exec(interaction).catch(async (err) => {
        console.error(err)
        if (interaction.replied)
          await interaction
            .followUp(toEmbed('Command Error', Colors.Red))
            .catch()
        else
          await interaction.reply(toEmbed('Command Error', Colors.Red)).catch()
      })
    } else if (
      interaction.isStringSelectMenu() &&
      interaction.customId === 'track'
    ) {
      await Promise.all([
        interaction.update({ components: [] }).catch(),
        addTrack(interaction, interaction.values[0]),
      ])
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

// Hack for Koyeb
import http from 'http'
http
  .createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Hello World!')
  })
  .listen(process.env.PORT || 8000)

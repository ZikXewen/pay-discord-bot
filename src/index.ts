import Discord, {
  Collection,
  GuildMember,
  GuildTextBasedChannel,
} from 'discord.js'
import { DisTube } from 'distube'
import { SpotifyPlugin } from '@distube/spotify'
import { YtDlpPlugin } from '@distube/yt-dlp'
import dotenv from 'dotenv'

import { toEmbed } from './utils.js'
import commands from './commands/index.js'

dotenv.config()

const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ],
})
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  nsfw: true,
  plugins: [new SpotifyPlugin(), new YtDlpPlugin()],
  youtubeCookie: process.env.COOKIE,
  youtubeDL: false,
})
client.commands = new Collection()
commands.forEach((command) => {
  client.commands.set(command.data.name, command)
})

client
  .on('ready', () => {
    console.log(`${client.user.tag} logged in. Ready to run!`)
    client.user.setActivity({ type: 'LISTENING', name: 'itself' })
  })
  .on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName)
      if (!command) return
      try {
        await command.exec(interaction)
      } catch (err) {
        console.error(err)
        interaction.channel.send('Command Error')
      }
    } else if (interaction.isSelectMenu()) {
      if (interaction.customId === 'track') {
        interaction.update({
          components: [],
        })
        interaction.client.distube
          .play(
            (interaction.member as GuildMember).voice.channel,
            interaction.values[0],
            {
              member: interaction.member as GuildMember,
              textChannel: interaction.channel as GuildTextBasedChannel,
            }
          )
          .catch(({ errorCode }) => {
            if (errorCode == 'NOT_IN_VOICE')
              interaction.editReply(
                toEmbed(
                  'Please join a voice channel first. :slight_smile:',
                  'RED'
                )
              )
          })
      }
    }
  })

client.distube
  .on('addSong', (queue, song) => {
    queue.textChannel.send(
      toEmbed(
        `**${song.user.tag}** added [**${song.name}**](${song.url}) to queue.`,
        'GREEN'
      )
    )
  })
  .on('playSong', (queue, song) => {
    queue.textChannel.send(
      toEmbed(
        `Started Playing: [**${song.name}**](${song.url}) (${song.formattedDuration}) - Requested by ${song.user.tag}`
      )
    )
  })
  .on('disconnect', (queue) => {
    queue.textChannel?.send(toEmbed('Leaving the Voice Channel...'))
  })
  .on('error', (channel, error) => {
    channel.send(toEmbed(error.toString().slice(0, 1999), 'RED'))
  })

client.login(process.env.BOT_TOKEN)

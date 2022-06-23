import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Agent } from 'https'
import mongoose from 'mongoose'
import { Command, Skin } from '../types.js'
import { toEmbed } from '../utils.js'

const AuthModel =
  mongoose.models.Auth ||
  mongoose.model(
    'Auth',
    new mongoose.Schema({
      _id: String,
      authCookie: String,
      region: String,
    })
  )

const tiers = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': 'Deluxe',
  'e046854e-406c-37f4-6607-19a9ba8426fc': 'Exclusive',
  '60bca009-4182-7998-dee7-b8a2558dc369': 'Premium',
  '12683d76-48d7-84a3-4e09-6985794f0445': 'Select',
  '411e4a55-4e59-7757-41f0-86a53f101bb5': 'Ultra',
}

const roles = {
  Initiator: '5fc02f99-4091-4486-a531-98459a3e95e9',
  Duelist: 'dbe8757e-9e92-4ed4-b39f-9dfc589691d4',
  Sentinel: '5fc02f99-4091-4486-a531-98459a3e95e9',
  Controller: '4ee40330-ecdd-4f2f-98a8-eb1243428373',
}

const agents = [
  {
    name: 'Fade',
    uuid: 'dade69b4-4f5a-8528-247b-219e5a1facd6',
    role: 'Initiator',
  },
  {
    name: 'Breach',
    uuid: '5f8d3a7f-467b-97f3-062c-13acf203c006',
    role: 'Initiator',
  },
  {
    name: 'Raze',
    uuid: 'f94c3b30-42be-e959-889c-5aa313dba261',
    role: 'Duelist',
  },
  {
    name: 'Chamber',
    uuid: '22697a3d-45bf-8dd7-4fec-84a9e28c69d7',
    role: 'Sentinel',
  },
  {
    name: 'KAY/O',
    uuid: '601dbbe7-43ce-be57-2a40-4abd24953621',
    role: 'Initiator',
  },
  {
    name: 'Skye',
    uuid: '6f2a04ca-43e0-be17-7f36-b3908627744d',
    role: 'Initiator',
  },
  {
    name: 'Cypher',
    uuid: '117ed9e3-49f3-6512-3ccf-0cada7e3823b',
    role: 'Sentinel',
  },
  {
    name: 'Sova',
    uuid: '320b2a48-4d9b-a075-30f1-1f93a9b638fa',
    role: 'Initiator',
  },
  {
    name: 'Killjoy',
    uuid: '1e58de9c-4950-5125-93e9-a0aee9f98746',
    role: 'Sentinel',
  },
  {
    name: 'Viper',
    uuid: '707eab51-4836-f488-046a-cda6bf494859',
    role: 'Controller',
  },
  {
    name: 'Phoenix',
    uuid: 'eb93336a-449b-9c1b-0a54-a891f7921d69',
    role: 'Duelist',
  },
  {
    name: 'Astra',
    uuid: '41fb69c1-4189-7b37-f117-bcaf1e96f1bf',
    role: 'Controller',
  },
  {
    name: 'Brimstone',
    uuid: '9f0d8ba9-4140-b941-57d3-a7ad57c6b417',
    role: 'Controller',
  },
  {
    name: 'Neon',
    uuid: 'bb2a4828-46eb-8cd1-e765-15848195d751',
    role: 'Duelist',
  },
  {
    name: 'Yoru',
    uuid: '7f94d92c-4234-0a36-9646-3a87eb8b5c89',
    role: 'Duelist',
  },
  {
    name: 'Sage',
    uuid: '569fdd95-4d10-43ab-ca70-79becc718b46',
    role: 'Sentinel',
  },
  {
    name: 'Reyna',
    uuid: 'a3bfb853-43b2-7238-a4f1-ad90e9e46bcc',
    role: 'Duelist',
  },
  {
    name: 'Omen',
    uuid: '8e253930-4c05-31dd-1b6c-968525494517',
    role: 'Controller',
  },
  {
    name: 'Jett',
    uuid: 'add6443a-41bd-e414-f6ad-e58d267f4e95',
    role: 'Duelist',
  },
]

const maps = [
  { name: 'Ascent', uuid: '7eaecc1b-4337-bbf6-6ab9-04b8f06b3319' },
  { name: 'Split', uuid: 'd960549e-485c-e861-8d71-aa9d1aed12a2' },
  { name: 'Fracture', uuid: 'b529448b-4d60-346e-e89e-00a4c527a405' },
  { name: 'Bind', uuid: '2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba' },
  { name: 'Breeze', uuid: '2fb9a4fd-47b8-4e7d-a969-74b4046ebd53' },
  { name: 'Icebox', uuid: 'e2ad5c54-4114-a870-9641-8ea21279579a' },
  { name: 'The Range', uuid: 'ee613ee9-28b7-4beb-9666-08db13bb2244' },
  { name: 'Haven', uuid: '2bee0dc9-4ffe-519b-1cbd-7fbe763a6047' },
  { name: 'Pearl', uuid: 'fd267378-4d1d-484f-ff52-77821ed10dc2' },
]

const valorant: Command = {
  data: new SlashCommandBuilder()
    .setName('valorant')
    .setDescription('Commands about Valorant.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('store')
        .setDescription('Check your daily Valorant offers.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('random')
        .setDescription('Randomly select a map or an agent.')
        .addStringOption((option) =>
          option
            .setName('type')
            .setDescription('What to select?')
            .setRequired(true)
            .addChoices(
              { name: 'A map', value: 'map' },
              { name: 'An agent', value: 'agent' }
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('login').setDescription('Login to your Riot account.')
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('logout').setDescription('Unbind your Riot account')
    ),
  exec: async (interaction) => {
    switch (interaction.options.getSubcommand()) {
      case 'store': {
        await interaction.deferReply()
        const auth = await AuthModel.findById(interaction.user.id)
        if (!auth) {
          interaction.editReply({
            embeds: [
              new MessageEmbed({
                title: 'Please login with `/valorant login` first',
                footer: {
                  text: 'We do not and will never collect your password.',
                },
              }),
            ],
          })
          break
        }
        try {
          const reauth = await axios.post(
            'https://auth.riotgames.com/api/v1/authorization',
            {
              client_id: 'play-valorant-web-prod',
              nonce: 1,
              redirect_uri: 'https://playvalorant.com/opt_in',
              response_type: 'token id_token',
              response_mode: 'query',
              scope: 'account openid',
            },
            {
              headers: {
                Cookie: auth.authCookie,
                'User-Agent':
                  'RiotClient/43.0.1.4195386.4190634 rso-auth (Windows; 10;;Professional, x64)',
              },
              httpsAgent: new Agent({
                ciphers: [
                  'TLS_CHACHA20_POLY1305_SHA256',
                  'TLS_AES_128_GCM_SHA256',
                  'TLS_AES_256_GCM_SHA384',
                  'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
                ].join(':'),
                honorCipherOrder: true,
                minVersion: 'TLSv1.2',
              }),
            }
          )

          const ssidCookie = reauth.headers['set-cookie'].find((elem) =>
            /^ssid/.test(elem)
          )

          await AuthModel.findByIdAndUpdate(auth._id, {
            authCookie: ssidCookie,
          })

          const access_token = new URL(
            reauth.data.response.parameters.uri
          ).searchParams.get('access_token')

          const entitlement: string = (
            await axios.post(
              'https://entitlements.auth.riotgames.com/api/token/v1',
              {},
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            )
          ).data.entitlements_token

          const puuid: string = JSON.parse(
            Buffer.from(access_token.split('.')[1], 'base64').toString()
          ).sub

          const store: string[] = (
            await axios.get(
              `https://pd.${auth.region}.a.pvp.net/store/v2/storefront/${puuid}`,
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                  'X-Riot-Entitlements-JWT': entitlement,
                },
              }
            )
          ).data.SkinsPanelLayout.SingleItemOffers

          const skins: Skin[] = (
            await axios.get('https://valorant-api.com/v1/weapons/skins')
          ).data.data

          interaction.editReply({
            embeds: skins
              .filter((skin) => store.includes(skin.levels[0].uuid))
              .map(
                (skin) =>
                  new MessageEmbed({
                    author: {
                      name: tiers[skin.contentTierUuid],
                      iconURL: `https://media.valorant-api.com/contenttiers/${skin.contentTierUuid}/displayicon.png`,
                    },
                    title: skin.displayName,
                    image: {
                      url: skin.displayIcon || skin.levels[0].displayIcon,
                    },
                  })
              ),
          })
        } catch (err) {
          console.error(err)
          await AuthModel.findByIdAndDelete(auth._id).catch(() => {
            interaction.editReply(
              toEmbed(
                'Error fetching the shop. Service is temporarily down. :frowning:',
                'RED'
              )
            )
          })
          interaction.editReply(
            toEmbed(
              'Error fetching the shop. Token might have expired. Please login again :frowning:',
              'RED'
            )
          )
        }
        break
      }
      case 'login':
        interaction.reply({
          ephemeral: true,
          embeds: [
            new MessageEmbed({
              title: 'Here is your login link.',
              footer: {
                text: 'We do not and will never collect your password.',
              },
            }),
          ],
          components: [
            new MessageActionRow({
              components: [
                new MessageButton({
                  style: 'LINK',
                  label: `Login (only for ${interaction.user.tag})`,
                  url: `https://pay-discord-bot-auth-endpoint.vercel.app/?id=${interaction.user.id}`,
                }),
              ],
            }),
          ],
        })
        break
      case 'logout':
        await interaction.deferReply({ ephemeral: true })
        try {
          await AuthModel.findByIdAndDelete(interaction.user.id)
          interaction.editReply(toEmbed('Unbound successfully.'))
        } catch (error) {
          interaction.editReply(
            toEmbed('Error occurred while attempting to unbind account.', 'RED')
          )
          console.error(error)
        }
        break
      case 'random':
        switch (interaction.options.getString('type')) {
          case 'agent': {
            const agent = agents[Math.floor(Math.random() * agents.length)]
            interaction.reply({
              embeds: [
                new MessageEmbed({
                  author: {
                    name: agent.role,
                    iconURL: `https://media.valorant-api.com/agents/roles/${
                      roles[agent.role]
                    }/displayicon.png`,
                  },
                  title: agent.name,
                  image: {
                    url: `https://media.valorant-api.com/agents/${agent.uuid}/fullportraitv2.png`,
                  },
                }),
              ],
            })
            break
          }
          case 'map': {
            const map = maps[Math.floor(Math.random() * maps.length)]
            interaction.reply({
              embeds: [
                new MessageEmbed({
                  title: map.name,
                  image: {
                    url: `https://media.valorant-api.com/maps/${map.uuid}/splash.png`,
                  },
                }),
              ],
            })
          }
        }
    }
  },
}

export default valorant

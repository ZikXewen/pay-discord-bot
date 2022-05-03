import { SlashCommandBuilder } from '@discordjs/builders'
import axios from 'axios'
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Agent } from 'https'
import mongoose from 'mongoose'
import { Command, ValAPIResponse } from '../types.js'
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

const tiers = [
  {
    uuid: '0cebb8be-46d7-c12a-d306-e9907bfc5a25',
    devName: 'Deluxe',
    displayIcon:
      'https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png',
  },
  {
    uuid: 'e046854e-406c-37f4-6607-19a9ba8426fc',
    devName: 'Exclusive',
    displayIcon:
      'https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png',
  },
  {
    uuid: '60bca009-4182-7998-dee7-b8a2558dc369',
    devName: 'Premium',
    displayIcon:
      'https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png',
  },
  {
    uuid: '12683d76-48d7-84a3-4e09-6985794f0445',
    devName: 'Select',
    displayIcon:
      'https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png',
  },
  {
    uuid: '411e4a55-4e59-7757-41f0-86a53f101bb5',
    devName: 'Ultra',
    displayIcon:
      'https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png',
  },
]

const valStore: Command = {
  data: new SlashCommandBuilder()
    .setName('val_store')
    .setDescription('Check your daily Valorant offers.'),
  exec: async (interaction) => {
    await interaction.deferReply()
    const auth = await AuthModel.findById(interaction.user.id)

    if (auth) {
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

        await AuthModel.findByIdAndUpdate(auth._id, { authCookie: ssidCookie })

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

        const puuid = JSON.parse(
          Buffer.from(access_token.split('.')[1], 'base64').toString()
        ).sub

        const store = (
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

        const skins = (
          await axios.get<ValAPIResponse>(
            'https://valorant-api.com/v1/weapons/skins'
          )
        ).data

        interaction.editReply({
          embeds: skins.data
            .filter((skin) => store.includes(skin.levels[0].uuid))
            .map((skin) => {
              const tier = tiers.find(
                (tier) => tier.uuid === skin.contentTierUuid
              )
              return new MessageEmbed({
                author: { name: tier.devName, iconURL: tier.displayIcon },
                title: skin.displayName,
                image: {
                  url: skin.displayIcon || skin.levels[0].displayIcon,
                },
              })
            }),
        })
      } catch (err) {
        console.error(err)
        AuthModel.findByIdAndDelete(auth._id)
        interaction.editReply(
          toEmbed(
            'Error fetching the shop. If this happens regularly, contact the owner. :frowning:',
            'RED'
          )
        )
      }
    } else
      interaction.editReply({
        embeds: [
          new MessageEmbed({
            title: 'We require your credentials first.',
            footer: { text: 'We do not and will never collect your password.' },
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
  },
}

export default valStore

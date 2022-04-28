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
            .map(
              (skin) =>
                new MessageEmbed({
                  title: skin.displayName,
                  image: {
                    url: skin.displayIcon || skin.levels.at(-1).displayIcon,
                  },
                })
            ),
        })
      } catch (err) {
        console.error(err)
        interaction.editReply(
          toEmbed('Error fetching the shop. :frowning:', 'RED')
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

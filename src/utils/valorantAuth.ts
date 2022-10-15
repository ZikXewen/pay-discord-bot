import axios from 'axios'
import { Agent } from 'https'
import mongoose from 'mongoose'

export const AuthModel = mongoose.model(
  'Auth',
  new mongoose.Schema({
    _id: String,
    authCookie: String,
    region: String,
  })
)

export const valorantAuth = async (authCookie: string, authId: string) => {
  const session = axios.create({
    headers: {
      Cookie: authCookie,
      'User-Agent':
        'RiotClient/59.0.3.4723620.4719081 rso-auth (Windows; 10;;Professional, x64)',
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
  })
  const reauth = await session.post(
    'https://auth.riotgames.com/api/v1/authorization',
    {
      client_id: 'play-valorant-web-prod',
      nonce: 1,
      redirect_uri: 'https://playvalorant.com/opt_in',
      response_type: 'token id_token',
      response_mode: 'query',
      scope: 'account openid',
    }
  )

  const ssidCookie = reauth.headers['set-cookie']?.find((elem) =>
    /^ssid/.test(elem)
  )

  await AuthModel.findByIdAndUpdate(authId, {
    authCookie: ssidCookie,
  })

  const access_token =
    new URL(reauth.data.response.parameters.uri).searchParams.get(
      'access_token'
    ) || ''

  const entitlement: string = (
    await session.post(
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

  return { access_token, entitlement, puuid }
}

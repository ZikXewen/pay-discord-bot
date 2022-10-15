import axios from 'axios'

const roles = {
  Initiator: '1b47567f-8f7b-444b-aae3-b0c634622d10',
  Duelist: 'dbe8757e-9e92-4ed4-b39f-9dfc589691d4',
  Sentinel: '5fc02f99-4091-4486-a531-98459a3e95e9',
  Controller: '4ee40330-ecdd-4f2f-98a8-eb1243428373',
}

const tiers = {
  '0cebb8be-46d7-c12a-d306-e9907bfc5a25': 'Deluxe',
  'e046854e-406c-37f4-6607-19a9ba8426fc': 'Exclusive',
  '60bca009-4182-7998-dee7-b8a2558dc369': 'Premium',
  '12683d76-48d7-84a3-4e09-6985794f0445': 'Select',
  '411e4a55-4e59-7757-41f0-86a53f101bb5': 'Ultra',
}

type AgentsResponse = {
  data: {
    uuid: string
    displayName: string
    isPlayableCharacter: boolean
    role: { displayName: keyof typeof roles }
  }[]
}

type MapsResponse = {
  data: {
    uuid: string
    displayName: string
  }[]
}

type SkinsResponse = {
  data: {
    displayName: string
    contentTierUuid: keyof typeof tiers
    levels: {
      uuid: string
      displayIcon?: string
    }[]
    displayIcon?: string
  }[]
}

type Agent = {
  uuid: string
  name: string
  role: keyof typeof roles
}

type Map = {
  uuid: string
  name: string
}

type Skin = {
  uuid: string
  name: string
  tierUuid: keyof typeof tiers
  image: string
}

let agents: Agent[] | null = null
let maps: Map[] | null = null
let skins: Skin[] | null = null

export const getRandomAgent = async () => {
  if (agents === null)
    agents = (
      await axios.get<AgentsResponse>('https://valorant-api.com/v1/agents')
    ).data.data
      .filter((agent) => agent.isPlayableCharacter)
      .map(({ uuid, displayName, role: { displayName: role } }) => ({
        uuid,
        name: displayName,
        role,
      }))
  const agent = agents[Math.floor(Math.random() * agents.length)]
  return { ...agent, roleUuid: roles[agent.role] }
}

export const getRandomMap = async () => {
  if (maps === null)
    maps = (
      await axios.get<MapsResponse>('https://valorant-api.com/v1/maps')
    ).data.data.map(({ uuid, displayName }) => ({ uuid, name: displayName }))
  return maps[Math.floor(Math.random() * maps.length)]
}

export const getSkins = async (store: string[]) => {
  if (skins === null)
    skins = (
      await axios.get<SkinsResponse>(
        'https://valorant-api.com/v1/weapons/skins'
      )
    ).data.data.map(
      ({ contentTierUuid, displayName, levels, displayIcon }) => ({
        uuid: levels[0].uuid,
        tierUuid: contentTierUuid,
        name: displayName,
        image: displayIcon || levels[0].displayIcon || '',
      })
    )
  return skins
    .filter((skin) => store.includes(skin.uuid))
    .map((skin) => ({ ...skin, tier: tiers[skin.tierUuid] }))
}

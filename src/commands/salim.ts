import { Colors, SlashCommandBuilder } from 'discord.js'
import axios from 'axios'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'

type HFResponse = {
  label: string
  score: number
}[][]

type WSResponse = {
  quote: {
    body: string
  }
}

const salim: Command = {
  data: new SlashCommandBuilder()
    .setName('salim')
    .setDescription('Generate or rate a salim quote.')
    .addStringOption((option) =>
      option
        .setName('quote')
        .setDescription('Salim quote to rate. Leave blank to generate one.')
        .setRequired(false)
    ),
  exec: async (interaction) => {
    await interaction.deferReply()
    const quote = interaction.options.getString('quote')
    if (quote) {
      try {
        const data = (
          await axios.post<HFResponse>(
            'https://api-inference.huggingface.co/models/tupleblog/salim-classifier',
            {
              inputs: quote + (quote.length < 50 ? '<pad>' : ''),
            },
            {
              headers: {
                Authorization: 'Bearer ' + process.env.HF_KEY,
              },
            }
          )
        ).data
        const score = data[0][1].score * 100
        interaction.editReply(
          toEmbed(
            `"${quote}" is ${score.toFixed(2)}% Salim. ${
              score > 80 ? ' :cold_face::cold_face:' : ' :fist::pensive:'
            }`
          )
        )
      } catch (err) {
        interaction.editReply(
          toEmbed('Error Salim classification request :frowning:', Colors.Red)
        )
      }
    } else {
      try {
        const data = (
          await axios.get<WSResponse>(
            'https://watasalim.vercel.app/api/quotes/random'
          )
        ).data
        interaction.editReply(data.quote.body)
      } catch (err) {
        interaction.editReply(
          toEmbed('Error fetching Salim quotes :frowning:', Colors.Red)
        )
      }
    }
  },
}

export default salim

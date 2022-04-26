import { SlashCommandBuilder } from '@discordjs/builders'
import fetch from 'node-fetch'
import { Command, HFResponse, WSResponse } from '../types.js'
import { toEmbed } from '../utils.js'

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
      fetch(
        'https://api-inference.huggingface.co/models/tupleblog/salim-classifier',
        {
          method: 'post',
          headers: {
            Authorization: 'Bearer ' + process.env.HF_KEY,
          },
          body: JSON.stringify({
            inputs: quote + (quote.length < 50 ? '<pad>' : ''),
          }),
        }
      )
        .then(async (response) => {
          const data = (await response.json()) as HFResponse
          const score = data[0][1].score * 100
          interaction.editReply(
            `This quote is ${score.toFixed(2)}% Salim.` +
              (score > 80 ? ' :cold_face::cold_face:' : '')
          )
        })
        .catch(() => {
          interaction.editReply(
            toEmbed('Error Salim classification request :frowning:', 'RED')
          )
        })
    } else {
      fetch('https://watasalim.vercel.app/api/quotes/random')
        .then(async (response) => {
          const data = (await response.json()) as WSResponse
          interaction.editReply(data.quote.body)
        })
        .catch(() =>
          interaction.editReply(
            toEmbed('Error fetching Salim quotes :frowning:', 'RED')
          )
        )
    }
  },
}

export default salim

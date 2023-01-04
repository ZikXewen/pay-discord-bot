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
    .addSubcommand((subcommand) =>
      subcommand
        .setName('generate')
        .setDescription('Generate a random salim quote.')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('rate')
        .setDescription('Rate a salim quote.')
        .addStringOption((option) =>
          option
            .setName('quote')
            .setDescription('The quote to rate.')
            .setRequired(true)
        )
    ),
  exec: async (interaction) => {
    await interaction.deferReply()
    const subcommand = interaction.options.getSubcommand()
    switch (subcommand) {
      case 'generate':
        await axios
          .get<WSResponse>('https://watasalim.vercel.app/api/quotes/random')
          .then((res) => interaction.editReply(res.data.quote.body))
          .catch(() =>
            interaction.editReply(
              toEmbed('Error fetching Salim quotes :frowning:', Colors.Red)
            )
          )
        break
      case 'rate': {
        const quote = interaction.options.getString('quote')
        if (!quote) throw new Error('No quote provided.')
        await axios
          .post<HFResponse>(
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
          .then((res) => {
            const score = res.data[0][1].score * 100
            interaction.editReply(
              toEmbed(
                `"${quote}" is ${score.toFixed(2)}% Salim. ${
                  score > 80 ? ' :cold_face::cold_face:' : ' :fist::pensive:'
                }`
              )
            )
          })
          .catch(() =>
            interaction.editReply(
              toEmbed(
                'Error Salim classification request :frowning:',
                Colors.Red
              )
            )
          )
      }
    }
  },
}

export default salim

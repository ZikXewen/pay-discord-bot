import axios from 'axios'
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from 'discord.js'
import { Command } from '../types'
import { toEmbed } from '../utils/toEmbed.js'
import { AuthModel, valorantAuth } from '../utils/valorantAuth.js'
import {
  getRandomAgent,
  getRandomMap,
  getSkins,
} from '../utils/valorantStatic.js'

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
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle('Please login with `/valorant login` first')
                .setFooter({
                  text: 'We do not and will never collect your password.',
                }),
            ],
          })
          return
        }
        try {
          const { access_token, entitlement, puuid } = await valorantAuth(
            auth.authCookie || '',
            auth._id
          )
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
          await interaction.editReply({
            embeds: (
              await getSkins(store)
            ).map((skin) =>
              new EmbedBuilder()
                .setAuthor({
                  name: skin.tier,
                  iconURL: `https://media.valorant-api.com/contenttiers/${skin.tierUuid}/displayicon.png`,
                })
                .setTitle(skin.name)
                .setImage(skin.image)
            ),
          })
        } catch (err) {
          console.error(err)
          await Promise.all([
            AuthModel.findByIdAndDelete(auth._id),
            interaction.editReply(
              toEmbed(
                'Error fetching the shop. Token might have expired. Please login again :frowning:',
                Colors.Red
              )
            ),
          ])
        }
        break
      }
      case 'login':
        await interaction.reply({
          ephemeral: true,
          embeds: [
            new EmbedBuilder().setTitle('Here is your login link.').setFooter({
              text: 'We do not and will never collect your password.',
            }),
          ],
          components: [
            new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel(`Login (only for ${interaction.user.tag})`)
                .setURL(
                  `https://pay-discord-bot-auth-endpoint.vercel.app/?id=${interaction.user.id}`
                )
            ),
          ],
        })
        break
      case 'logout':
        await interaction.deferReply({ ephemeral: true })
        try {
          await Promise.all([
            AuthModel.findByIdAndDelete(interaction.user.id),
            interaction.editReply(toEmbed('Unbound successfully.')),
          ])
        } catch (error) {
          console.error(error)
          await interaction.editReply(
            toEmbed(
              'Error occurred while attempting to unbind account.',
              Colors.Red
            )
          )
        }
        break
      case 'random':
        await interaction.deferReply()
        switch (interaction.options.getString('type')) {
          case 'agent': {
            const agent = await getRandomAgent()
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setAuthor({
                    name: agent.role,
                    iconURL: `https://media.valorant-api.com/agents/roles/${agent.roleUuid}/displayicon.png`,
                  })
                  .setTitle(agent.name)
                  .setImage(
                    `https://media.valorant-api.com/agents/${agent.uuid}/fullportrait.png`
                  ),
              ],
            })
            break
          }
          case 'map': {
            const map = await getRandomMap()
            await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setTitle(map.name)
                  .setImage(
                    `https://media.valorant-api.com/maps/${map.uuid}/splash.png`
                  ),
              ],
            })
          }
        }
    }
  },
}

export default valorant

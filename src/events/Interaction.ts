import { CommandInteraction, Interaction, InteractionType } from 'discord.js'
import Colors from '../constants/Colors'
import MyClient from '../structures/Client'
import Command from '../structures/Command'
import Event from '../structures/Event'
import Premium from '../structures/Premium'

export default class InteractionEvent extends Event {
  public constructor() {
    super('interactionCreate', false)
  }

  public async execute(client: MyClient, interaction: Interaction): Promise<void> {
    if (!interaction.guildId) return

    let premiumData = await client.premiums.get(interaction.guildId)?.getPremium(client)

    if (!premiumData) {
      premiumData = client.premiums.set(interaction.guildId, new Premium(
        interaction.guildId,
        false,
        new Date()
      )).get(interaction.guildId) as Premium
    }

    if (interaction.type == InteractionType.ApplicationCommand) {
      this.command(client, interaction, premiumData)
    }
  }

  public async command(client: MyClient, interaction: CommandInteraction, premium: Premium) {
    const command = client.commands.get(interaction.commandName) as Command
    const premiumExpired = await premium.expired(client)

    try {
      if (command.options.permissions && interaction.guild?.members.me?.permissions.has(command.options.permissions) && !interaction.guild?.members.me?.permissions.has('Administrator')) {
        await client.reply.reply({
          interaction: interaction,
          color: Colors.warning,
          author: 'Permissions error',
          description: 'Not enough permissions',
          fields: [
            {
              name: 'Required permissions',
              value: `${command.options.permissions.toString().replace(/,/, ', ')}`,
              inline: false
            }
          ]
        })

        return
      }

      if (command.options.access == 'premium' && premiumExpired) {
        await client.reply.reply({
          interaction: interaction,
          color: Colors.warning,
          author: 'Premium error',
          description: 'Command is premium only'
        })

        return
      }

      if (command.options.access == 'private') {
        await client.reply.reply({
          interaction: interaction,
          color: Colors.warning,
          author: 'Access error',
          description: 'Command is private'
        })

        return
      }

      if (!command.options.status) {
        await client.reply.reply({
          interaction: interaction,
          color: Colors.warning,
          author: 'Command error',
          description: 'Command is under maintenance'
        })

        return
      }

      command.execute(client, interaction, premium.status)
    } catch (err) {
      console.log(err)

      await client.reply.reply({
        interaction: interaction,
        color: Colors.warning,
        author: 'Unspecified error',
        description: 'Something went wrong'
      })
    }
  }
}
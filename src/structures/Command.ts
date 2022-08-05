import { ChatInputApplicationCommandData, CommandInteraction, MessageApplicationCommandData, PermissionResolvable, UserApplicationCommandData } from 'discord.js'
import MyClient from './Client'

export default abstract class Command {
  public options: CommandOptions
  public abstract data: ChatInputApplicationCommandData | UserApplicationCommandData | MessageApplicationCommandData

  protected constructor(options: CommandOptions) {
    this.options = options
  }

  public abstract execute(client: MyClient, interaction: CommandInteraction, premium: boolean): void
}

export interface CommandOptions {
  permissions: PermissionResolvable
  access: 'public' | 'private' | 'premium'
  type: 'public' | 'private'
  status: boolean
}
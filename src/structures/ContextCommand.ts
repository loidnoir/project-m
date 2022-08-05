import { MessageApplicationCommandData, UserApplicationCommandData } from 'discord.js'
import Command, { CommandOptions } from './Command'

export default abstract class ContextCommand extends Command {
  public data: UserApplicationCommandData | MessageApplicationCommandData

  protected constructor(options: CommandOptions, data: UserApplicationCommandData | MessageApplicationCommandData) {
    super(options)
    this.data = data
  }
}
import { ChatInputApplicationCommandData } from 'discord.js'
import Command, { CommandOptions } from './Command'

export default abstract class ChatCommand extends Command {
  public data: ChatInputApplicationCommandData

  protected constructor(options: CommandOptions, data: ChatInputApplicationCommandData) {
    super(options)
    this.data = data
  }
}
import { ActivityType, ClientOptions, Partials } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

export default class Options {
  public static clientGuild = '976623581603700746'
  public static clientToken: string = process.env.TOKEN!
  public static clientOptions: ClientOptions = {
    intents: [
      'Guilds',
      'GuildMembers',
      'GuildPresences'
    ],
    partials: [
      Partials.GuildMember,
      Partials.Channel,
      Partials.User
    ],
    presence: {
      activities: [
        {
          name: 'For players',
          type: ActivityType.Watching
        }
      ]
    }
  }
}
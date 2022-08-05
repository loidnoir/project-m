import { ActivityType, ClientOptions, Partials } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

export default class Options {
  public static clientToken: string = process.env.TOKEN!
  public static clientOptions: ClientOptions = {
    intents: [
      'Guilds',
      'GuildMembers',
      'GuildWebhooks'
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
import { ClientEvents } from 'discord.js'
import MyClient from './Client'

export default abstract class Event {
  public name: keyof ClientEvents
  public type: boolean

  public constructor(name: keyof ClientEvents, type = false) {
    this.name = name
    this.type = type
  }

  public abstract execute(client: MyClient, ...args: any[]): void

  public async reloadEvents(client: MyClient): Promise<void> {
    await client.handleEvents()
  }
}
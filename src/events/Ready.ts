import MyClient from '../structures/Client'
import Event from '../structures/Event'

export default class ReadyEvent extends Event {
  public constructor() {
    super('ready', true)
  }

  public execute(client: MyClient): void {
    console.log('Bot ready!')
  }
}
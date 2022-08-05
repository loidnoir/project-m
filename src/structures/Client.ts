import { Client } from 'discord.js'
import glob from 'glob'
import { promisify } from 'util'
import Options from '../constants/Options'
import Event from './Event'

export default class MyClient extends Client {
  public constructor() {
    super(Options.clientOptions)
  }

  public async connect() {
    await this.handleEvents()
    await this.login(Options.clientToken)
  }

  public async handleEvents() {
    const filesPath = __dirname + '/../events/**/*{.js,.ts}'
    const getPath = promisify(glob)
    const files = await getPath(filesPath)

    for (const file of files) {
      try {
        const event: Event = new (await import(file)).default()

        if (!event.execute) continue

        if (event.type) {
          this.once(event.name, (...args: any) => event.execute(this, args))
        }

        else {
          this.on(event.name, (...args: any) => event.execute(this, args))
        }

      } catch (err) {
        console.log(err)
        continue
      }
    }
  }
}

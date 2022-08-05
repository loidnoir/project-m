import { PrismaClient } from '@prisma/client'
import { Client, Collection } from 'discord.js'
import glob from 'glob'
import { promisify } from 'util'
import Options from '../constants/Options'
import Reply from '../utils/Reply'
import Utils from '../utils/Utils'
import Command from './Command'
import Event from './Event'
import Premium from './Premium'

export default class MyClient extends Client {
  public prisma: PrismaClient
  public premiums: Collection<string, Premium>
  public commands: Collection<string, Command>
  public utils: Utils
  public reply: Reply

  public constructor() {
    super(Options.clientOptions)
    this.prisma = new PrismaClient()
    this.commands = new Collection()
    this.premiums = new Collection()
    this.utils = new Utils(this)
    this.reply = new Reply(this)
  }

  public async connect() {
    await this.handleEvents()
    await this.login(Options.clientToken)
    await this.handleCommands()
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
          this.once(event.name, (...args: unknown[]) => event.execute(this, ...args))
        }

        else {
          this.on(event.name, (...args: unknown[]) => event.execute(this, ...args))
        }

      } catch (err) {
        console.log(err)
        continue
      }
    }
  }

  public async handleCommands() {
    const filesPath = __dirname + '/../commands/**/*{.ts,.js}'
    const getPath = promisify(glob)
    const files = await getPath(filesPath)

    for (const file of files) {
      try {
        const command: Command = new (await import(file)).default()

        if (!command.execute) continue

        if (command.options.type == 'public') {
          // await this.application?.commands.set([])
          await this.application?.commands.create(command.data)
        }

        else {
          await this.guilds.cache.get(Options.clientGuild)?.commands.create(command.data)
        }

        this.commands.set(command.data.name, command)
      } catch (err) {
        console.log(err)
        continue
      }
    }
  }
}

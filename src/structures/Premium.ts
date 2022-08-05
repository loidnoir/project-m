import MyClient from './Client'

export default class Premium {
  public guild: string
  public status: boolean
  public expireAt: Date

  public constructor(guild: string, status: boolean, expireAt: Date) {
    this.guild = guild
    this.status = status
    this.expireAt = expireAt
  }

  public async getPremium(client: MyClient): Promise<Premium> {
    let premiumCache = client.premiums.get(this.guild)

    if (!premiumCache) {
      let premiumData = await client.prisma.premium.findFirst({ where: { guild: this.guild } })

      if (!premiumData) {
        premiumData = await client.prisma.premium.create({
          data: {
            expireAt: this.expireAt,
            guild: this.guild,
            status: false
          }
        })
      }

      client.premiums.set(this.guild, new Premium(premiumData.guild, premiumData.status, premiumData.expireAt))
      premiumCache = client.premiums.get(this.guild) as Premium
    }

    return premiumCache
  }

  public async savePremium(client: MyClient): Promise<void> {
    const premiumData = await this.getPremium(client)

    await client.prisma.premium.updateMany({
      where: {
        guild: premiumData.guild
      },
      data: {
        expireAt: premiumData.expireAt,
        status: premiumData.status
      }
    })
  }

  public async expired(client: MyClient): Promise<boolean> {
    const premiumData = await this.getPremium(client)

    if (premiumData.status && premiumData.expireAt.getTime() <= new Date().getTime()) {
      premiumData.status = false
      premiumData.expireAt = new Date
      await this.savePremium(client)
    }

    return !premiumData.status
  }
}
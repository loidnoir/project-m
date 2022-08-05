import NoirClient from '../structures/Client'

export default class Utils {
  public client: NoirClient

  constructor(client: NoirClient) {
    this.client = client
  }

  public capitalize(string: string, underscore?: boolean) {
    string = string.charAt(0).toUpperCase() + string.slice(1)

    if (underscore) {
      string = string.replace(/_/, ' ')
    }

    return string
  }
}
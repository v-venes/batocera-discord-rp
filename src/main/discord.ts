import DiscordRPC from 'discord-rpc'

type DiscordActivity = {
  title: string
  subtitle: string
}

class Discord {
  client: DiscordRPC.Client

  constructor() {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID

    if (!clientId) {
      throw new Error('Client ID not found')
    }

    this.client = new DiscordRPC.Client({ transport: 'ipc' })
    this.client.login({ clientId }).catch((err) => {
      console.error(err)
    })
  }

  setGameActivity(info: DiscordActivity): void {
    const startTimestamp = new Date()
    this.client.setActivity({
      details: info.title,
      state: info.subtitle,
      startTimestamp,
      instance: false
    })
  }

  clearGameActivity(): void {
    this.client.clearActivity()
  }
}

export default Discord

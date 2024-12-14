import http from 'http'
import Discord from './discord'
import { BrowserWindow } from 'electron'

type GameInfo = {
  gameName: string
  platform: string
}

class Server {
  server: http.Server
  port: string
  discordClient: Discord

  constructor(discordClient: Discord, port?: string) {
    this.port = port || '3333'
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res)
    })
    this.discordClient = discordClient
  }

  handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    res.setHeader('Content-Type', 'application/json')
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end(JSON.stringify({ error: 'Method not allowed' }))
      return
    }
    let body = ''
    switch (req.url) {
      case '/start':
        body = ''
        req.on('data', (data) => {
          body += data.toString()
        })
        req.on('end', () => {
          this._startGame(JSON.parse(body))
          res.writeHead(200)
          res.end()
        })
        break
      case '/stop':
        this._stopGame()
        res.writeHead(200)
        res.end()
        break
      default:
        res.writeHead(404)
        res.end(JSON.stringify({ error: 'Resource not found' }))
    }
  }
  _startGame(gameInfo: GameInfo): void {
    this.discordClient.setGameActivity({ title: gameInfo.gameName, subtitle: gameInfo.platform })
    this._sendEventToRenderer(gameInfo)
  }
  _stopGame(): void {
    this.discordClient.clearGameActivity()
    this._sendEventToRenderer(null)
  }

  _sendEventToRenderer(gameInfo: GameInfo | null): void {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length > 0) {
      allWindows[0].webContents.send('server-event', gameInfo)
    }
  }

  start(clb: () => void): void {
    this.server.listen(this.port, clb)
  }
}

export default Server

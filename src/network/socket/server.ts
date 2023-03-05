import { getData, getDataById } from 'database'
import { Debugger } from 'debug'
import { Server } from 'socket.io'

const PORT = parseInt(process.env.PORT as string) || 8080
const origin = ['http://localhost:3000', process.env.FRONT_URL as string]

const socketConnection = (d: Debugger) => ({
  connect: () => {
    if (!global.__io__) {
      let id: string | undefined

      global.__io__ = new Server(PORT, {
        allowRequest(req, fn) {
          const url = new URL(req?.url ?? '', `http://${req?.headers.host}`)
          const search = url.search.substring(1)
          const query = JSON.parse(
            '{"' +
              decodeURI(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
              '"}'
          ) as { id?: string }

          id = query.id

          fn(null, true)
        },
        cors: {
          origin
        }
      })

      global.__io__.on('connection', async socket => {
        const db = global.__firebase__.database(
          process.env.FIREBASE_REAL_TIME_DB
        )

        if (id) socket.emit(`${id}/initialData`, await getDataById({ db, id }))
        else socket.emit(`initialData`, await getData({ db }))

        d(`Socket connected: ${socket.id}`)
      })

      d(`Socket server started on port: ${PORT}.`)
    }

    return global.__io__
  },
  disconnect: () => {
    if (global.__io__) global.__io__.disconnectSockets(true)
  }
})

export { socketConnection }

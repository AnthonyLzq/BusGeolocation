import debug from 'debug'

import { getPointsOnLine, ROUTE_POINTS, sleep } from './utils'
import { socketConnection } from './socket'

const serverDebug = debug('BusGeolocation:SocketServer')

const main = async () => {
  const socket = socketConnection(serverDebug).connect()
  const points = [
    ...getPointsOnLine(ROUTE_POINTS[0], ROUTE_POINTS[1], 8),
    ...ROUTE_POINTS.slice(2, -2),
    ...getPointsOnLine(
      ROUTE_POINTS[ROUTE_POINTS.length - 2],
      ROUTE_POINTS[ROUTE_POINTS.length - 1],
      8
    )
  ]

  while (true)
    for (const element of points) {
      serverDebug(`Sending position: ${element}`)
      socket.emit('bus/position', element)
      await sleep(5000)
    }
}

main()

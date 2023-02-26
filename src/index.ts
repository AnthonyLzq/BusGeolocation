import debug from 'debug'

import { getPointsOnLine, ROUTE_POINTS, sleep } from './utils'
import { socketConnection } from './socket'

const serverDebug = debug('BusGeolocation:SocketServer')

const main = async () => {
  const socket = socketConnection(serverDebug).connect()
  const points = [
    ...getPointsOnLine(ROUTE_POINTS[0], ROUTE_POINTS[1], 8),
    ...ROUTE_POINTS.slice(1, -2),
    ...getPointsOnLine(
      ROUTE_POINTS[ROUTE_POINTS.length - 2],
      ROUTE_POINTS[ROUTE_POINTS.length - 1],
      8
    )
  ]

  while (true) {
    let i = 0

    for (const element of points) {
      serverDebug(`Sending position: ${i}, position: [${element}]`)
      socket.emit('bus/position', element)
      i++
      await sleep(1000)
    }
  }
}

main()

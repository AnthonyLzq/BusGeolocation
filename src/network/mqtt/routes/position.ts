import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updatePosition } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'position'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)
  const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const [id, moduleId, sensorId, value] = message.toString().split('/')
      const [latString, lngString] = value.split(',')
      const lat = parseFloat(latString) || 0
      const lng = parseFloat(lngString) || 0

      if (lat === 0 || lng === 0) return

      subDebug(`Topic: ${topic} - Message received`)
      subDebug(
        `Received a ${TOPIC.toUpperCase()} update at: ${new Date().toISOString()}`
      )
      subDebug(`Message: \t${message}`)
      updatePosition({
        db,
        id,
        moduleId,
        value: { lat, lng },
        sensorId
      })
      socketConnection(subDebug)
        .connect()
        .emit(`${sensorId}/position`, [lat, lng])
    }
  })
}

const turbidity: Route = {
  sub,
  SUB_TOPIC
}

export { turbidity }

import debug from 'debug'
import { MqttClient } from 'mqtt'

import { updateDate } from 'database'
import { MAIN_TOPIC } from 'utils'
import { socketConnection } from 'network/socket'

const TOPIC = 'date'
const SUB_TOPIC = `${MAIN_TOPIC}/${TOPIC}`

const sub = (client: MqttClient) => {
  const subDebug = debug(`${MAIN_TOPIC}:Mqtt:${TOPIC}:sub`)
  const db = global.__firebase__.database(process.env.FIREBASE_REAL_TIME_DB)

  client.subscribe(SUB_TOPIC, error => {
    if (!error) subDebug(`Subscribed to Topic: ${SUB_TOPIC}`)
  })

  client.on('message', (topic, message) => {
    if (topic.includes(TOPIC)) {
      const [id, moduleId, sensorId] = message.toString().split('/')
      const value = new Date().toISOString()

      subDebug(`Topic: ${topic} - Message received`)
      subDebug(
        `Received a ${TOPIC.toUpperCase()} update at: ${new Date().toISOString()}`
      )
      subDebug(`Message: \t${message}`)
      updateDate({
        db,
        id,
        moduleId,
        value,
        sensorId
      })
      socketConnection(subDebug).connect().emit(`${sensorId}/date`, value)
    }
  })
}

const date: Route = {
  sub,
  SUB_TOPIC
}

export { date }

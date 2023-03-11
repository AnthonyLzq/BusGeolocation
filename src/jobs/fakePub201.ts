import cron from 'node-cron'
import debug from 'debug'
import { MqttClient } from 'mqtt'
import { readFileSync } from 'fs'
import { join } from 'path'

import { formatDateToCronJobStringSMHDM, MAIN_TOPIC, sleep } from 'utils'
import { clientPublish } from './helpers'

const bus = {
  id: '8e234a60-4b52-431a-8c33-98fac1bca3a9',
  moduleId: 'rojo',
  sensorId: 201
}

const updateRoute201Data = (client: MqttClient) => {
  const pubDebug = debug(`${MAIN_TOPIC}:Mqtt:demo:pub`)

  if (process.env.NODE_ENV === 'production') {
    pubDebug(
      `This job: "${updateRoute201Data.name}" is not allowed in production.`
    )

    return
  }

  const datePlus5s = new Date(Date.now() + 5 * 1000)
  const cronJobTime = formatDateToCronJobStringSMHDM(datePlus5s)
  const route201Points = readFileSync(
    join(__dirname, '../routes/201.txt'),
    'utf8'
  )
    .split('\n')
    .map(point => point.split(',').map(coord => parseFloat(coord)))

  pubDebug(`Started job: "${updateRoute201Data.name}".`)
  cron.schedule(cronJobTime, async () => {
    pubDebug(`Job started at: ${new Date().toISOString()}`)

    const { id, moduleId, sensorId } = bus
    const currentIsoTime = new Date().toISOString()

    pubDebug(`Publishing messages at: ${currentIsoTime}`)

    let i = 0

    while (true) {
      clientPublish({
        client,
        value: 'on',
        id,
        moduleId,
        sensorId,
        topic: 'state',
        cb: () => {
          clientPublish({
            client,
            value: route201Points[i].join(','),
            id,
            moduleId,
            sensorId,
            topic: 'position',
            cb: () => {
              clientPublish({
                client,
                value: currentIsoTime,
                id,
                moduleId,
                sensorId,
                topic: 'date'
              })
            }
          })
        }
      })
      await sleep(1000)
      i++

      if (i === route201Points.length - 1) i = 0
    }
  })
}

export { updateRoute201Data }

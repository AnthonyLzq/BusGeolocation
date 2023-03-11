import { MqttClient } from 'mqtt'

import { MAIN_TOPIC } from 'utils'

export type ClientPublishProps<T> = {
  client: MqttClient
  value: T
  id: number | string
  moduleId: number | string
  sensorId: number | string
  topic: string
  cb?: () => void
}

const clientPublish = <T>({
  client,
  value,
  id,
  moduleId,
  sensorId,
  topic,
  cb
}: ClientPublishProps<T>) => {
  client.publish(
    `${MAIN_TOPIC}/${topic}`,
    `${id}/${moduleId}/${sensorId}/${value}`
  )
  cb?.()
}

export { clientPublish }

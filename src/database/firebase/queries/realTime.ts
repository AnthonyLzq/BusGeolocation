import { Database } from 'firebase-admin/lib/database/database.js'
import { z } from 'zod'
import debug from 'debug'

import { MAIN_TOPIC } from 'utils'

const realTimeDebug = debug(`${MAIN_TOPIC}:Mqtt:FirebaseRealTime`)
const clientData = z.object({
  date: z.string(),
  position: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  state: z.enum(['on', 'off'])
})
const allClientsData = z.record(z.record(z.record(clientData)))

declare global {
  type ClientData = z.infer<typeof clientData>
  type AllClientsData = z.infer<typeof allClientsData>
}

type Update<T = number> = {
  db: Database
  id: string
  moduleId: string
  sensorId: string
  value: T
}

const getData = async ({ db }: { db: Database }) => {
  const result = await db.ref(`/ids`).get()

  try {
    console.log(
      '🚀 ~ file: realTime.ts:36 ~ getData ~ result.toJSON():',
      result.toJSON()
    )
    const value = allClientsData.parse(result.toJSON())

    return value
  } catch (error) {
    return null
  }
}

const getDataById = async ({
  db,
  id
}: Omit<Update, 'value' | 'moduleId' | 'sensorId'>) => {
  const result = await db.ref(`/ids/${id}`).get()

  try {
    const value = clientData.parse(result.val())

    return value
  } catch (error) {
    return null
  }
}

const updateDate = ({ db, id, moduleId, sensorId, value }: Update<string>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('Date updated.')
  })
}

const updateState = ({ db, id, moduleId, sensorId, value }: Update<string>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/state`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('State updated.')
  })
}

const updatePosition = ({
  db,
  id,
  moduleId,
  sensorId,
  value
}: Update<{ lat: number; lng: number }>) => {
  db.ref(`/ids/${id}/${moduleId}/${sensorId}/position`).set(value, error => {
    if (error) realTimeDebug(`Error: ${error}`)
    else realTimeDebug('Position updated.')
  })
}

// const listenChangesInDate = ({
//   db,
//   id,
//   moduleId,
//   sensorId
// }: Omit<Update, 'value'>) => {
//   db.ref(`/ids/${id}/${moduleId}/${sensorId}/date`).on('value', async () => {
//     const data = await getDataById({ db, id, moduleId, sensorId })

//     if (data)
//       try {
//         await saveClientData(z.coerce.number().parse(sensorId), data)
//       } catch (error) {
//         realTimeDebug(`Error: ${error}`)
//       }
//     else
//       realTimeDebug(
//         `Error: The data for the sensor ${sensorId} was not found in the database.`
//       )
//   })
// }

export {
  getData,
  getDataById,
  updateState,
  updatePosition,
  updateDate
  // listenChangesInDate
}

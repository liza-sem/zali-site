import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

type PayloadCache = {
  payload?: Promise<Payload>
}

const globalForPayload = globalThis as typeof globalThis & PayloadCache

export async function getPayloadClient(): Promise<Payload> {
  if (!globalForPayload.payload) {
    globalForPayload.payload = getPayload({ config: await config })
  }

  return globalForPayload.payload
}

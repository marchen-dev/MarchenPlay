import { resolve } from 'node:path'

import { dbPath } from '@main/constants/app'
import { JSONFileSyncPreset } from 'lowdb/node'

let db: {
  data: Record<string, unknown>
  write: () => void
  read: () => void
}

const createOrGetDb = () => {
  if (!db) {
    db = JSONFileSyncPreset(resolve(dbPath(), 'db.json'), {})
  }
  return db
}

export const store = {
  get: (key: string) => {
    const { data } = createOrGetDb()
    return data[key] as any
  },
  set: (key: string, value: unknown) => {
    const { data, write } = createOrGetDb()
    data[key] = value
    write()
  },
  remove: (key: string) => {
    const { data, write } = createOrGetDb()
    delete data[key]
    write()
  },
  clear: () => {
    const { data, write } = createOrGetDb()
    Object.keys(data).forEach((key) => delete data[key])
    write()
  },
}

import type { EntityTable } from 'dexie'
import Dexie from 'dexie'

import { LOCAL_DB_NAME, TABLES } from './constants'
import { dbSchemaV1 } from './db.schema'
import type { DB_History } from './schemas/history'

class LocalDB extends Dexie {
  history: EntityTable<DB_History, 'id'>

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.history = this.table(TABLES.HISTORY)
  }
}

export const db = new LocalDB()

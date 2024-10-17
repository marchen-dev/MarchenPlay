import type { EntityTable } from 'dexie'
import Dexie from 'dexie'

import { LOCAL_DB_NAME, TABLES } from './constants'
import { dbSchemaV1 } from './db.schema'
import type { DB_App } from './schemas/app'
import type { DB_Player } from './schemas/player'

class LocalDB extends Dexie {
  app: EntityTable<DB_App, 'id'>
  player: EntityTable<DB_Player, 'id'>

  constructor() {
    super(LOCAL_DB_NAME)
    this.version(1).stores(dbSchemaV1)
    this.app = this.table(TABLES.APP)
    this.player = this.table(TABLES.PLAYER)
  }
}

export const db = new LocalDB()

import Dexie from 'dexie'
import { Identity } from '../types'

class QuickTypingDatabase extends Dexie {
  configs: Dexie.Table<Identity, string>

  constructor (databaseName: string) {
    super(databaseName)
    this.version(1).stores({ configs: 'id' })
    this.configs = this.table('configs')
  }
}

const db = new QuickTypingDatabase('QuickTyping')

db.open().catch(err => {
  console.error(`Open failed: ${err.stack}`)
})

export default db

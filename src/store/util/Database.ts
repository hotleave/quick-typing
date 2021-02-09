import Dexie from 'dexie'
import { TrieNode } from './TrieTree'

class QuickTypingDatabase extends Dexie {
  configs: Dexie.Table<TrieNode, string>

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

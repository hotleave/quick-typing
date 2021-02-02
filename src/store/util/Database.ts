import Dexie from 'dexie'
import { TrieNode } from './TrieTree'

class QuickTypingDatabase extends Dexie {
  codings: Dexie.Table<TrieNode, string>

  constructor (databaseName: string) {
    super(databaseName)
    this.version(1).stores({ codings: 'id' })
    this.codings = this.table('codings')
    this.codings.mapToClass(TrieNode)
  }
}

const db = new QuickTypingDatabase('QuickTyping')

db.open().catch(err => {
  console.error(`Open failed: ${err.stack}`)
})

export default db

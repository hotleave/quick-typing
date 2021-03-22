import Dexie from 'dexie'
import { Achievement, Identity } from '../types'

class QuickTypingDatabase extends Dexie {
  /**
   * 配置
   */
  configs: Dexie.Table<Identity, string>
  /**
   * 汇总
   */
  summary: Dexie.Table<Identity, string>

  achievement: Dexie.Table<Achievement, number>

  constructor (databaseName: string) {
    super(databaseName)
    this.version(2).stores({
      configs: 'id',
      summary: 'id',
      achievement: '++'
    })
    this.configs = this.table('configs')
    this.summary = this.table('summary')
    this.achievement = this.table('achievement')
  }
}

const db = new QuickTypingDatabase('QuickTyping')

db.open().catch(err => {
  console.error(`Open failed: ${err.stack}`)
})

export default db

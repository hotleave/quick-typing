import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { article } from './article'
import { racing } from './racing'
import { setting } from './setting'
import { login } from './login'
import { Identity, LooseObject, QuickTypingState } from './types'
import db from './util/Database'
import { TrieNode } from './util/TrieTree'

Vue.use(Vuex)

const state: QuickTypingState = new QuickTypingState()

const store: StoreOptions<QuickTypingState> = {
  state,
  modules: {
    article,
    racing,
    setting,
    login
  },
  mutations: {
    codings (state, codings: TrieNode) {
      state.codings = codings
    },
    overallKeyCount (state, keyCount: LooseObject<number>) {
      const { overallKeyCount } = state
      if (overallKeyCount) {
        for (const key in keyCount) {
          overallKeyCount[key] += keyCount[key]
        }
      } else {
        state.overallKeyCount = keyCount
      }
    },

    updateAchievements (state, achievements): void {
      state.achievements = achievements
    },

    addAchievements (state, achievement): void {
      state.achievements.unshift(achievement)
    }
  },

  actions: {
    updateCodings ({ commit }, codings: TrieNode) {
      commit('codings', codings)
    },
    summaryKeyCount ({ commit, state }, keyCount: LooseObject<number>) {
      commit('overallKeyCount', keyCount)

      const data: Identity = { id: 'keyCount', ...state.overallKeyCount }
      db.summary.put(data)
    },
    addAchievements ({ commit }, achievement) {
      commit('addAchievements', achievement)
    }
  }
}

export default new Vuex.Store(store)

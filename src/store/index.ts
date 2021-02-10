import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { article } from './article'
import { racing } from './racing'
import { setting } from './setting'
import { QuickTypingState } from './types'
import { TrieNode } from './util/TrieTree'

Vue.use(Vuex)

const store: StoreOptions<QuickTypingState> = {
  modules: {
    article,
    racing,
    setting
  },
  mutations: {
    codings (state, codings: TrieNode) {
      state.codings = codings
    }
  },

  actions: {
    codings ({ commit }, codings: TrieNode) {
      commit('codings', codings)
    }
  }
}

export default new Vuex.Store(store)

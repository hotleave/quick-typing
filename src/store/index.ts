import Vue from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { article } from './article'
import { racing } from './racing'
import { QuickTypingState } from './types'

Vue.use(Vuex)

const store: StoreOptions<QuickTypingState> = {
  modules: {
    article,
    racing
  }
}

export default new Vuex.Store(store)

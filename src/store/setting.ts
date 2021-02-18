import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { InterfaceStyle, QuickTypingState, SettingState } from './types'

const state = new SettingState()

const getters: GetterTree<SettingState, QuickTypingState> = {
  state (): SettingState {
    return state
  },

  styles (): InterfaceStyle {
    const { pending, typed, correct, error, hintColor, code1, code2, code3, code4 } = state
    return {
      '--pending': pending,
      '--typed': typed,
      '--correct': correct,
      '--error': error,
      '--hint': hintColor,
      '--code1': code1,
      '--code2': code2,
      '--code3': code3,
      '--code4': code4
    }
  }
}

const mutations: MutationTree<SettingState> = {
  update (state, setting) {
    if (setting) {
      Object.assign(state, setting)
    }
  },

  loaded (state) {
    state.loaded = true
  }
}

const actions: ActionTree<SettingState, QuickTypingState> = {
  load ({ commit }, setting) {
    if (setting) {
      commit('update', setting)
      commit('loaded')
    }
  }
}

export const setting: Module<SettingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

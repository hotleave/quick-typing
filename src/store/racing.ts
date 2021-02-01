import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, RacingState } from './types'

const state: RacingState = {
  status: 'wait',
  input: '',
  time: 0,
  keys: '',
  start: 0,
  backspace: 0,
  enter: 0,
  replace: 0,
  error: 0,
  selective: 0,
  phrase: 0,
  retry: 1
}

const getters: GetterTree<RacingState, QuickTypingState> = {
  // 击键速度
  hitSpeed ({ keys }, getters): string {
    const used = getters.usedTime
    if (used === 0) {
      return (0).toFixed(2)
    }

    return (keys.length / used * 1000).toFixed(2)
  },

  // 打字速度
  typeSpeed (state, getters, { article }): string {
    const used = getters.usedTime
    if (used === 0) {
      return (0).toFixed(2)
    }

    return (article.content.length / used * 1000 * 60).toFixed(2)
  },

  // 码长
  codeLength ({ keys }, getters, { article }): string {
    return (keys.length / article.content.length).toFixed(2)
  },

  // 打词率
  phraseRate ({ phrase }, getters, { article }): string {
    return (phrase / article.content.length * 100).toFixed(2)
  },

  // 比赛结果
  result (state, getters, { article }): string {
    return `第${article.identity}段 速度${getters.typeSpeed} 击键${getters.hitSpeed} 键数${state.keys.length} 码长${getters.codeLength} 字数${article.content.length} 错字${state.error} 退格${state.backspace} 回改${state.replace} 打词${state.phrase} 打词率${getters.phraseRate}% 重打${state.retry}`
  },

  // 已用时间
  usedTime ({ status, time, start }): number {
    if (status !== 'typing') {
      return time
    } else {
      return time + (new Date().getTime() - start)
    }
  }
}

const mutations: MutationTree<RacingState> = {
  init (state): void {
    Object.assign(state, {
      status: 'init',
      time: 0,
      keys: '',
      start: 0,
      backspace: 0,
      enter: 0,
      replace: 0,
      error: 0,
      selective: 0,
      phrase: 0,
      retry: 1
    })
  },

  start (state): void {
    state.status = 'typing'
    state.time = 0
    state.start = new Date().getTime()
  },

  pause (state): void {
    state.status = 'pause'
    state.time += new Date().getTime() - state.start
  },

  resume (state): void {
    state.status = 'typing'
    state.start = new Date().getTime()
  },

  finish (state): void {
    state.status = 'finished'
    state.time += new Date().getTime() - state.start
  },

  // 重打
  retry (state): void {
    Object.assign(state, {
      status: 'init',
      time: 0,
      keys: '',
      start: 0,
      backspace: 0,
      enter: 0,
      replace: 0,
      error: 0,
      selective: 0,
      phrase: 0,
      retry: state.retry + 1
    })
  },

  typing (state, key): void {
    let typed = key
    switch (key) {
      case 'Shift':
        typed = '⇧'
        break
      case 'Enter':
        typed = '↵'
        state.enter++
        break
      case 'Backspace':
        typed = '⌫'
        state.backspace++
        break
      case ' ':
        typed = '□'
        break
      case 'Escape':
      case 'Meta':
        typed = ''
        break
      case 'ArrowUp':
        typed = '↑'
        break
      case 'ArrowRight':
        typed = '→'
        break
      case 'ArrowDown':
        typed = '↓'
        break
      case 'ArrowLeft':
        typed = '←'
        break
      case 'Home':
        typed = '⇤'
        break
      case 'End':
        typed = '⇥'
        break
      case 'Tab':
        typed = '⇆'
        break
    }

    state.keys += typed
  },

  accept (state, input: string): void {
    state.input = input
  },

  replace (state, count: number): void {
    state.replace += count
  },

  phrase (state, count: number): void {
    state.phrase += count
  }
}

const actions: ActionTree<RacingState, QuickTypingState> = {
  init ({ commit }): void {
    commit('init')
  },

  accept ({ commit, state, rootState }, content: string): void {
    if (state.status === 'init') {
      commit('start')
    }

    const { article } = rootState
    if (state.input !== content) {
      const delta = content.length - state.input.length
      if (delta < 0) {
        // 字数变少，回改
        commit('replace', -delta)
      } else if (delta > 1) {
        // 输入多个字，打词
        commit('phrase', delta)
      }
    }

    commit('accept', content)

    if (content.length === article.content.length) {
      commit('finish')
    }
  }
}

export const racing: Module<RacingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

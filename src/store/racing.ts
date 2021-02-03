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
  selective: 0,
  phrase: 0,
  retry: 1,
  timer: 0
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
  typeSpeed (state, getters): string {
    const used = getters.usedTime
    if (used === 0) {
      return (0).toFixed(2)
    }

    return (state.input.length / used * 1000 * 60).toFixed(2)
  },

  // 码长
  codeLength ({ keys, input }): string {
    return input.length > 0 ? (keys.length / input.length).toFixed(2) : '0.00'
  },

  // 理论码长
  idealCodeLength (state, getters, { article }): string {
    return article.shortest ? (article.shortest.distance / article.content.length).toFixed(2) : '0.00'
  },

  // 打词率
  phraseRate ({ phrase }, getters, { article }): string {
    return (phrase / article.content.length * 100).toFixed(2)
  },

  // 键准
  accuracy ({ keys, backspace, replace }, getters): string {
    // 总键数
    const total = keys.length
    // 有效键数 = 总数 - 退格数 - (回改数 * 码长)
    const correct = total - backspace - (replace * parseFloat(getters.codeLength))
    return (correct / total * 100).toFixed(2)
  },

  // 比赛结果
  result (state, getters, { article }): string {
    const statistics = [
      `第${article.identity}段`,
      `速度${getters.typeSpeed}`,
      `击键${getters.hitSpeed}`,
      `键准${getters.accuracy}%`,
      `码长${getters.codeLength}`,
      `理想码长${getters.idealCodeLength}`,
      `字数${article.content.length}`,
      `打词${state.phrase}`,
      `打词率${getters.phraseRate}%`,
      `选重${state.selective}`,
      `回改${state.replace}`,
      `键数${state.keys.length}`,
      `退格${state.backspace}`,
      `回车${state.enter}`,
      `重打${state.retry}`
    ]

    return statistics.join(' ')
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
    state.start = new Date().getTime()
    state.time = 0
  },

  pause (state): void {
    state.status = 'pause'
    state.time += new Date().getTime() - state.start
  },

  resume (state): void {
    if (state.status === 'pause') {
      state.status = 'typing'
      state.start = new Date().getTime()
    }
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

  typing (state, e): void {
    let typed = e.key
    switch (typed) {
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

    // 判断选重
    if (e.isComposing && ';\'23456789'.indexOf(e.key) >= 0) {
      state.selective++
    }
  },

  accept (state, input: string): void {
    state.input = input
  },

  replace (state, count: number): void {
    state.replace += count
  },

  phrase (state, count: number): void {
    state.phrase += count
  },

  elapse (state, time): void {
    state.time += time
    state.start += time
  },

  timer (state, id): void {
    state.timer = id
  }
}

const actions: ActionTree<RacingState, QuickTypingState> = {
  init ({ commit, state }): void {
    commit('init')

    if (state.status === 'typing') {
      clearInterval(state.timer)
    }
  },

  accept ({ commit, state, rootState }, content: string): void {
    if (state.status === 'init') {
      commit('start')
      const interval = 1000
      const id = setInterval(() => {
        if (state.status === 'typing') {
          commit('elapse', interval)
        }
      }, interval)
      commit('timer', id)
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

    if (content === article.content) {
      clearInterval(state.timer)
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

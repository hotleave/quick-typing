import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, RacingState, Word } from './types'
import { Edge } from './util/Graph'

const leftHandKeys = '`12345~!@#$%⇆qwertasdfgzxcvb'
const statusMap = new Map<string, string>([
  ['init', '初始化'],
  ['wait', '等待开始'],
  ['pause', '暂停'],
  ['typing', '进行中'],
  ['finished', '结束']
])

const formatTime = (time: number): string => {
  let total = time
  if (total < 60) {
    return `${time.toFixed(3)}″`
  }

  const seconds = total % 60
  total = (total - seconds) / 60
  if (total < 60) {
    return `${total.toFixed(0)}′${seconds.toFixed(3)}″`
  }

  const minutes = total % 60
  total = (total - minutes) / 60
  return `${total.toFixed(0)}:${minutes.toFixed(0)}′${seconds.toFixed(3)}″`
}

const codeHint = (edge: Edge<Word>): string => {
  const { code, text } = edge.value
  return `${text}: ${code}`
}

const init = {
  status: 'wait',
  input: '',
  keys: '',
  time: 0,
  start: 0,
  backspace: 0,
  leftHand: 0,
  rightHand: 0,
  enter: 0,
  replace: 0,
  selective: 0,
  phrase: 0,
  retry: 1,
  timer: 0
}

const state: RacingState = Object.assign({}, init)

const getters: GetterTree<RacingState, QuickTypingState> = {
  statusText ({ status }): string {
    return statusMap.get(status) || '未知'
  },

  // 击键速度
  hitSpeed ({ keys }, getters): string {
    const used = getters.usedTime
    if (used === 0) {
      return (0).toFixed(2)
    }

    return (keys.length / used).toFixed(2)
  },

  // 打字速度
  typeSpeed (state, getters): string {
    const used = getters.usedTime
    if (used === 0) {
      return (0).toFixed(2)
    }

    return (state.input.length / used * 60).toFixed(2)
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

  // 键法
  balance ({ leftHand, rightHand }): string {
    const total = leftHand + rightHand
    const delta = Math.abs(leftHand - rightHand)

    return (100 - delta / total * 100).toFixed(2)
  },

  // 已用时间
  usedTime ({ status, time, start }): number {
    if (status !== 'typing') {
      return time / 1000
    } else {
      return (time + new Date().getTime() - start) / 1000
    }
  },

  // 进度
  progress ({ input }, getters, { article }): number {
    return input.length / article.content.length
  },

  // 编码提示
  hint ({ input }, getters, { article }): string {
    const { shortest } = article
    const length = input.length
    if (!shortest || length === shortest.path.length) {
      return '-'
    }

    const { path, vertices } = shortest
    const edge = vertices[path[length]].get(length)
    if (!edge) {
      return '-'
    }

    const single = vertices[length + 1].get(length)
    if (!single || edge.value.text.length === 1) {
      return codeHint(edge)
    }

    return `${codeHint(edge)} ${codeHint(single)}`
  },

  // 比赛结果
  result (state, getters, { article, setting }): string {
    const statistics: Map<string, string> = new Map([
      ['identity', `第${article.identity || 1}段`],
      ['typeSpeed', `速度${getters.typeSpeed}`],
      ['hitSpeed', `击键${getters.hitSpeed}`],
      ['codeLength', `码长${getters.codeLength}`],
      ['contentLength', `字数${article.content.length}`],
      ['usedTime', `用时${formatTime(getters.usedTime)}`],
      ['accuracy', `键准${getters.accuracy}%`],
      ['balance', `键法${getters.balance}%`],
      ['leftHand', `左${state.leftHand}`],
      ['rightHand', `右${state.rightHand}`],
      ['idealCodeLength', `理论码长${getters.idealCodeLength}`],
      ['phrase', `打词${state.phrase}`],
      ['phraseRate', `打词率${getters.phraseRate}%`],
      ['selective', `选重${state.selective}`],
      ['replace', `回改${state.replace}`],
      ['keys', `键数${state.keys.length}`],
      ['backspace', `退格${state.backspace}`],
      ['enter', `回车${state.enter}`],
      ['retry', `重打${state.retry}`],
      ['version', `QuickTyping-${process.env.VUE_APP_VERSION}`]
    ])

    const options = setting.resultOptions.slice(0)
    const versionIndex = options.indexOf('version')
    const { inputMethod, inputMethodName, signature, signatureText } = setting
    if (inputMethod && inputMethodName) {
      versionIndex > 0 ? options.splice(versionIndex, 0, 'inputMethod') : options.push('inputMethod')
      statistics.set('inputMethod', `输入法:${inputMethodName}`)
    }
    if (signature && signatureText) {
      versionIndex > 0 ? options.splice(versionIndex, 0, 'signature') : options.push('signature')
      statistics.set('signature', `个性签名:${signatureText}`)
    }

    return options.map(v => statistics.get(v)).join(' ')
  }
}

const mutations: MutationTree<RacingState> = {
  init (state): void {
    Object.assign(state, init)
    state.status = 'init'
  },

  start (state): void {
    state.status = 'typing'
    state.start = Date.now()
    state.time = 0
  },

  finish (state): void {
    state.status = 'finished'
    state.time += Date.now() - state.start
  },

  pause (state): void {
    state.status = 'pause'
    state.time += new Date().getTime() - state.start
  },

  resume (state): void {
    state.status = 'typing'
    state.start = Date.now()
  },

  // 重打
  retry (state): void {
    const retry = state.retry + 1
    Object.assign(state, init)
    state.status = 'init'
    state.retry = retry
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
        typed = '_'
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

    if (leftHandKeys.indexOf(typed) >= 0) {
      state.leftHand++
    } else {
      state.rightHand++
    }

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
    if (state.status === 'typing') {
      clearInterval(state.timer)
    }

    commit('init')
  },

  retry ({ commit, state }) {
    if (state.status !== 'init') {
      commit('retry')
    }
  },

  resume ({ commit, state }) {
    if (state.status === 'pause') {
      commit('resume')
    }
  },

  typing ({ commit, state }, e) {
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

    commit('typing', e)
  },

  accept ({ commit, state, rootState }, content: string): void {
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
      console.log('Input', state.keys)
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

import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { QuickTypingState, RacingState, Word } from './types'
import { keyboard } from './util/keyboard'

const statusMap = new Map<string, string>([
  ['init', '初始化'],
  ['wait', '等待开始'],
  ['pause', '暂停'],
  ['typing', '进行中'],
  ['finished', '结束']
])

const formatTime = (total: number, mill = 3): string => {
  if (total < 60) {
    return `${total.toFixed(mill)}`
  }

  const seconds = total % 60
  const minutes = (total - seconds) / 60
  return `${minutes.toFixed(0)}:${seconds.toFixed(mill)}`
}

const padLeft = (input: string, length: number): string => {
  if (input.length < length) {
    return padLeft('0' + input, length)
  }

  return input
}

const state = new RacingState()

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
  accuracy ({ keys, keyCount, replace }, getters): string {
    // 总键数
    const total = keys.length
    // 有效键数 = 总数 - 退格数 - (回改数 * 码长)
    const backspace = keyCount.Backspace || 0
    const correct = total - backspace - (replace * parseFloat(getters.codeLength))
    return (correct / total * 100).toFixed(2)
  },

  leftHand ({ keys }): number {
    return keys.map(v => keyboard.get(v)).filter(v => v && v.finger <= 3).length
  },

  rightHand ({ keys }): number {
    return keys.map(v => keyboard.get(v)).filter(v => v && v.finger >= 4 && v.finger <= 7).length
  },

  // 键法
  balance (state, getters): string {
    const { leftHand, rightHand } = getters
    const total = leftHand + rightHand
    const delta = Math.abs(leftHand - rightHand)

    return (100 - delta / total * 100).toFixed(2)
  },

  enterCount ({ keyCount }): number {
    return keyCount.Enter || 0
  },

  backspaceCount ({ keyCount }): number {
    return keyCount.Backspace || 0
  },

  // 用时
  usedTime ({ status, time, start }): number {
    if (status !== 'typing') {
      return time / 1000
    } else {
      return (time + Date.now() - start) / 1000
    }
  },

  // 计时显示
  passTime ({ status, time }): string {
    if (status !== 'typing' && time === 0) {
      return '--:--'
    }

    const total = time / 1000
    if (total < 60) {
      return `00:${padLeft(total.toFixed(0), 2)}`
    }

    const seconds = total % 60
    const minutes = (total - seconds) / 60
    return `${padLeft(minutes.toFixed(0), 2)}:${padLeft(seconds.toFixed(0), 2)}`
  },

  // 进度
  progress ({ input }, getters, { article }): number {
    return input.length / article.content.length
  },

  // 编码提示
  hint ({ input }, getters, { article }): Array<Word> | null {
    const { shortest } = article
    const length = input.length
    if (!shortest || length >= shortest.path.length) {
      return null
    }

    const { path, vertices } = shortest
    const edge = vertices[path[length]].get(length)
    if (!edge) {
      return null
    }

    const single = vertices[length + 1].get(length)
    if (!single || edge.value.text.length === 1) {
      return [edge.value]
    }

    return [edge.value, single.value]
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
      ['leftHand', `左${getters.leftHand}`],
      ['rightHand', `右${getters.rightHand}`],
      ['idealCodeLength', `理论码长${getters.idealCodeLength}`],
      ['phrase', `打词${state.phrase}`],
      ['phraseRate', `打词率${getters.phraseRate}%`],
      ['selective', `选重${state.selective}`],
      ['replace', `回改${state.replace}`],
      ['keys', `键数${state.keys.length}`],
      ['backspace', `退格${getters.backspaceCount}`],
      ['enter', `回车${getters.enterCount}`],
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
    Object.assign(state, new RacingState())
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
    state.timer = 0
  },

  pause (state): void {
    state.status = 'pause'
    state.time += Date.now() - state.start
  },

  resume (state): void {
    state.status = 'typing'
    state.start = Date.now()
  },

  // 重打
  retry (state): void {
    const retry = state.retry + 1
    Object.assign(state, new RacingState())
    state.status = 'init'
    state.retry = retry
    state.timer = 0
  },

  typing (state, { e, altSelectKey }: { e: KeyboardEvent; altSelectKey: string }): void {
    const { code } = e
    const { keyCount, keys } = state
    const count = keyCount[code]
    keyCount[code] = (count || 0) + 1
    keys.push(code)

    // 判断选重
    if (e.isComposing && altSelectKey.indexOf(e.key) >= 0) {
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
  },

  idealKeys (state, idealKeys): void {
    state.idealKeys = idealKeys
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
      clearInterval(state.timer)
      commit('retry')
    }
  },

  pause ({ commit, state }) {
    if (state.status === 'typing') {
      commit('pause')
    }
  },

  resume ({ commit, state }) {
    if (state.status === 'pause') {
      commit('resume')
    }
  },

  typing ({ commit, state, rootState }, e) {
    if (state.status === 'init' && state.timer === 0) {
      const interval = 1000
      const id = setInterval(() => {
        if (state.status === 'typing') {
          commit('elapse', interval)
        }
      }, interval)
      commit('timer', id)
      commit('start')
    }

    const { altSelectKey } = rootState.setting
    commit('typing', { e, altSelectKey })
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
      this.dispatch('summaryKeyCount', state.keyCount)
    }
  },

  setIdealKeys ({ commit }, idealKeys: string): void {
    commit('idealKeys', idealKeys)
  }
}

export const racing: Module<RacingState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

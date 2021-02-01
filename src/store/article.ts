import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { ArticleState, QuickTypingState, Word } from './types'

const parseIdentity = (input: string): string => {
  return input.replace(/-+第(\d+)段.*/, '$1')
}

const parseArticle = (content: string): ArticleState => {
  const lines = content.split(/[\r\n]/)
  const totalLines = lines.length
  let title = ''
  let identity = ''

  if (totalLines > 1) {
    identity = parseIdentity(lines[totalLines - 1])
    if (identity === lines[totalLines - 1]) {
      identity = ''
    }
  }

  if (lines.length >= 3) {
    title = lines[0]
    content = lines[1]
  } else if (lines.length === 2) {
    content = lines[0]
    identity = lines.pop() || ''
  }

  return { title, content, identity }
}

const state: ArticleState = {
  title: '',
  identity: '',
  content: ''
}

const getters: GetterTree<ArticleState, QuickTypingState> = {
  words ({ content }, getters, { racing }): Array<Word> {
    const input = racing.input
    if (content.length === 0) {
      return []
    } else if (input.length === 0) {
      return [{ id: 0, text: state.content, type: 'normal' }]
    } else if (content === input) {
      return [{ id: 0, text: state.content, type: 'correct' }]
    }

    const targetWords = content.split('')
    const inputWords = input.split('')
    const length = targetWords.length
    let lastCorrect = targetWords[0] === inputWords[0]
    let text = ''
    const words: Array<Word> = []

    inputWords.forEach((v, i) => {
      if (i >= length) {
        return
      }

      const target = targetWords[i]
      const correct = v === target
      if (correct !== lastCorrect) {
        words.push({ id: i, text, type: lastCorrect ? 'correct' : 'error' })
        text = ''
        lastCorrect = correct
      }
      text = text.concat(target)
    })

    words.push({ id: input.length - text.length, text, type: lastCorrect ? 'correct' : 'error' })
    if (input.length < length) {
      words.push({ id: input.length, text: content.substring(input.length), type: 'normal' })
    }

    return words
  }
}

const mutations: MutationTree<ArticleState> = {
  load (state, article: ArticleState) {
    Object.assign(state, article)
  }
}

const actions: ActionTree<ArticleState, QuickTypingState> = {
  loadArticle ({ commit }, content: string): void {
    const article = parseArticle(content)
    commit('load', article)

    // 初始化
    this.dispatch('racing/init', null, { root: true })
  }
}

export const article: Module<ArticleState, QuickTypingState> = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}

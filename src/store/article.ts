import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { ArticleState, Phrase, QuickTypingState, Word } from './types'
import { Graph, Edge } from './util/Graph'
import { TrieNode } from './util/TrieTree'

const parse = (input: string, codings: TrieNode) => {
  const graph = new Graph<Phrase>()
  const length = input.length
  let node: TrieNode
  for (let i = 0; i < length; i++) {
    node = codings
    for (let j = i; j < length; j++) {
      const sub = node.get(input[j])
      if (!sub) {
        break
      } else if (sub.value) {
        const { text, code, select } = sub.value
        // console.log('find', node.phrase, node.value, j + 1, i)
        const edge: Edge<Phrase> = { from: j + 1, to: i, length: code.length, value: { text, code, select } }
        graph.addEdge(edge)

        node = sub
      }
    }
  }

  // 补全缺失的边
  const vertices = graph.vertices
  for (let i = 1; i <= length; i++) {
    const vertex = vertices[i]
    if (vertex && vertex.size > 0) {
      continue
    }

    const edge: Edge<Phrase> = { from: i, to: i - 1, length: 1, value: { text: input[i - 1], code: input[i - 1], select: '_' } }
    graph.addEdge(edge)
  }
  return graph.shortestPath()
}

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

  return { title, content, identity, shortest: null }
}

const state: ArticleState = {
  title: '',
  identity: '',
  content: '',
  shortest: null
}

const getters: GetterTree<ArticleState, QuickTypingState> = {
  words ({ content, shortest }, getters, { racing }): Array<Word> {
    const input = racing.input
    if (content.length === 0) {
      return []
    }
    // else if (input.length === 0) {
    //   return [{ id: 0, text: state.content, type: 'normal' }]
    // } else if (content === input) {
    //   return [{ id: 0, text: state.content, type: 'correct' }]
    // }

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
    words.push({ id: input.length - text.length + 1, text, type: lastCorrect ? 'correct' : 'error' })

    // 待输入的内容
    if (input.length < length) {
      if (shortest == null) {
        const pending = content.substring(input.length)
        words.push({ id: input.length, text: pending, type: 'normal' })
      } else {
        const { path, vertices } = shortest
        for (let i = input.length; i < length;) {
          const edge = vertices[path[i]].get(i)
          if (!edge) {
            continue
          }
          const { text, code, select } = edge.value
          words.push({ id: i, text, type: 'normal', code, select })
          i = path[i]
        }
      }
    }

    return words
  }
}

const mutations: MutationTree<ArticleState> = {
  load (state, article: ArticleState) {
    Object.assign(state, article)
  },

  shortest (state, shortest) {
    state.shortest = shortest
  }
}

const actions: ActionTree<ArticleState, QuickTypingState> = {
  loadArticle ({ commit, rootState }, content: string): void {
    const article = parseArticle(content)
    commit('load', article)

    setTimeout(() => {
      const { codings } = rootState
      const shortest = parse(article.content, codings)
      commit('shortest', shortest)
    })

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

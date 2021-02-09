import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { ArticleState, Phrase, QuickTypingState, Word } from './types'
import { Graph, Edge, ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'
import { punctuation } from './util/punctuation'

const parse = (content: string, codings: TrieNode): ShortestPath<Phrase> | null => {
  if (!codings) {
    return null
  }

  const graph = new Graph<Phrase>()
  const contentLength = content.length
  let node: TrieNode
  for (let i = 0; i < contentLength; i++) {
    node = codings
    // 找出以当前字开始的所有词语
    for (let j = i; j < contentLength; j++) {
      const sub = node.get(content[j])
      if (!sub) {
        break
      }

      if (sub.value) {
        const next = j + 1
        const { text, code, first } = sub.value
        let { select, length } = sub.value
        if (first && length < 4 && next < contentLength && punctuation.has(content[next])) {
          // 该字/词码长小于4的首选，且后面的字符是标点，可自动顶屏，无须再用空格上屏
          select = ''
          // console.log('found', text, code, select, next, i)
        } else if (first && length === 4 && next === contentLength) {
          // 该字/词为4码首选，且为最后一个，需要补充空格
          select = '_'
        }
        length += select.length
        graph.addEdge({ from: next, to: i, length, value: new Phrase(text, code, select) })
      }
      node = sub
    }
  }

  // 补全缺失的边
  const vertices = graph.vertices
  for (let i = 1; i <= contentLength; i++) {
    const vertex = vertices[i]
    if (vertex && vertex.size > 0) {
      continue
    }

    const text = content[i - 1]
    graph.addEdge({ from: i, to: i - 1, length: 1, value: new Phrase(text, text) })
  }
  return graph.shortestPath()
}

const parseIdentity = (content: string): string => {
  return content.replace(/-+第(\d+)段.*/, '$1')
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

  if (identity && lines.length >= 3) {
    title = lines[0]
    content = lines[1]
  } else if (lines.length === 2) {
    content = lines[0]
    identity = lines.pop() || ''
  }

  return { title, content, identity, shortest: null }
}

const check = (index: number, input: string, target: string, words: Array<Word>): void => {
  const length = target.length
  const targetWords = target.split('')
  const inputWords = input.split('')
  let lastCorrect = targetWords[0] === inputWords[0]
  let text = ''

  inputWords.forEach((v, i) => {
    if (i >= length) {
      return
    }

    const target = targetWords[i]
    const correct = v === target

    if (correct !== lastCorrect) {
      words.push({ id: index + i - text.length, text, type: lastCorrect ? 'correct' : 'error' })
      text = ''
      lastCorrect = correct
    }
    text = text.concat(target)
  })

  if (text.length > 0) {
    words.push({ id: index + input.length - text.length, text, type: lastCorrect ? 'correct' : 'error' })
  }
}

const addWord = (content: string, edge: Edge<Phrase>, words: Array<Word>): number => {
  const { from, to, value } = edge
  const { text, code, select } = value

  if (content.length <= to) {
    // 输入长度小于当前词首，未打
    const type = `code${code.length}`
    words.push({ id: to, text, type, code, select })
    return 0
  } else {
    // 输入长度大于当前词尾，已打, 否则部分已打
    const length = content.length
    const source = content.substring(to, Math.min(from, length))
    check(to, source, text, words)
    return length > from ? 0 : length
  }
}

const state: ArticleState = {
  title: '',
  identity: '',
  content: '',
  shortest: null
}

const getters: GetterTree<ArticleState, QuickTypingState> = {
  // 长度
  length ({ content }): number {
    return content.length
  },

  // 拆分开的字词
  words ({ content, shortest }, getters, { racing }): Array<Word> {
    const input = racing.input
    if (content.length === 0) {
      return []
    }

    const length = content.length
    const words: Array<Word> = []

    if (shortest === null) {
      const pending = content.substring(input.length)
      words.push({ id: input.length, text: pending, type: 'pending' })
    } else {
      const { path, vertices } = shortest
      for (let i = 0; i < length;) {
        const edge = vertices[path[i]].get(i)
        if (!edge) {
          break
        }
        const next = addWord(input, edge, words)
        i = next === 0 ? path[i] : next
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

    const { path, vertices } = shortest
    const length = path.length
    let codes = ''
    for (let i = 0; i < length;) {
      const edge = vertices[path[i]].get(i)
      if (!edge) {
        break
      }
      const { code, select } = edge.value
      codes += code + select
      i = path[i]
    }

    console.log('Shortest codes: ', codes)
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

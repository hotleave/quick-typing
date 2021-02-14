import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { ArticleState, Phrase, QuickTypingState } from './types'
import { Edge, Graph, ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'
import { punctuation } from './util/punctuation'

const mergeEdge = (vertex: Map<number, Edge<Phrase>>, graph: Graph<Phrase>): void => {
  for (const edge of vertex.values()) {
    if (!punctuation.has(edge.value.text)) {
      continue
    }

    for (const prev of graph.vertices[edge.to].values()) {
      const { value, to, length } = prev
      if (value.length < 4 && value.first) {
        const phrase = new Phrase(value.text + edge.value.text, value.code + edge.value.code)
        phrase.length = value.length
        graph.addEdge({ from: edge.from, to, length: edge.length + length - 1, value: phrase })
      }
    }
  }
}

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

      let { value } = sub
      if (value) {
        const next = j + 1
        let { select, length } = value
        if (value.first && length === 4 && next === contentLength) {
          // 该字/词为4码首选，且为最后一个，需要补充空格
          select = '_'
          value = Object.assign({}, value, { select })
        }
        length += select.length
        graph.addEdge({ from: next, to: i, length, value })
      }
      node = sub
    }
  }

  // 补全缺失的边
  const vertices = graph.vertices
  for (let i = 1; i <= contentLength; i++) {
    const vertex = vertices[i]
    if (vertex && vertex.size > 0) {
      mergeEdge(vertex, graph)
    } else {
      const text = content[i - 1]
      graph.addEdge({ from: i, to: i - 1, length: 1, value: new Phrase(text, text) })
    }
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
  }
}

const mutations: MutationTree<ArticleState> = {
  load (state, article: ArticleState) {
    Object.assign(state, article)
  },

  shortest (state, shortest) {
    if (!shortest) {
      return
    }
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

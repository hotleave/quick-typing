import { ActionTree, GetterTree, Module, MutationTree } from 'vuex'
import { ArticleState, QuickTypingState, Word } from './types'
import { Edge, Graph, ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'
import { punctuation } from './util/punctuation'

/**
 * 处理标点顶屏
 * @param vertex 边
 * @param graph DAG图
 */
const mergeEdge = (vertex: Map<number, Edge<Word>>, graph: Graph<Word>): void => {
  for (const edge of vertex.values()) {
    if (!punctuation.has(edge.value.text)) {
      continue
    }

    for (const prev of graph.vertices[edge.to].values()) {
      const { to, length } = prev
      const { text, code, index, type } = prev.value
      if (/[a-zA-Z0-9]/.test(text)) {
        continue
      }

      if (code.length < 4 && index === 0) {
        const newCode = code + edge.value.code
        const value = new Word(to, text + edge.value.text, type, newCode, code.length, '', 0, '顶')
        graph.addEdge({ from: edge.from, to, length: edge.length + length - 1, value })
      }
    }
  }
}

/**
 * 获取选重键
 * @param length 码长
 * @param index 候选词所在位置
 * @param selective 所有选重键
 */
const getSelectChar = (length: number, index: number, selective: string): string => {
  // index < 0 表示无须选重
  if (index < 0 || (length === 4 && index === 0)) {
    return ''
  }

  const total = selective.length
  let alt = index
  let select = ''
  while (alt >= total) {
    select += '+'
    alt -= total
  }
  return select + selective[alt]
}

/**
 * 处理文章计算最佳码长
 * @param content 文章内容
 * @param codings 码表
 * @param selective 选重键
 */
const parse = (content: string, codings: TrieNode, selective: string): ShortestPath<Word> | null => {
  if (!codings) {
    return null
  }

  const graph = new Graph<Word>()
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
        const { index, text, code } = sub.value
        const length = code.length
        let select = getSelectChar(length, index, selective)
        if (index === 0 && length === 4 && (next === contentLength || selective.indexOf(content[next]) >= 0)) {
          // 该字/词为4码首选，且为最后一个，或者是后续的是选重符号，需要补充空格
          select = selective[0]
        }

        const type = `code${length}`
        const value = new Word(i, text, type, code, length, select, index)
        graph.addEdge({ from: next, to: i, length: length + select.length, value })
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
      graph.addEdge({ from: i, to: i - 1, length: 1, value: new Word(i - 1, text) })
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
      const { codings, setting } = rootState
      const shortest = parse(article.content, codings, setting.selective)
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

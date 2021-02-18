import { Identity, Phrase } from '../types'

export class TrieNode implements Identity {
  public id?: string
  /**
   * 子节点
   */
  public children?: Map<string, TrieNode>
  /**
   * 节点值
   */
  public value?: Phrase

  static convert (from: { id?: string; children?: Map<string, object>; value?: Phrase}): TrieNode {
    const node = new TrieNode()
    node.id = from.id
    node.value = from.value

    if (from.children) {
      node.children = new Map<string, TrieNode>()
      for (const entry of from.children.entries()) {
        node.children.set(entry[0], this.convert(entry[1]))
      }
    }

    return node
  }

  get (key: string): TrieNode | null {
    if (!this.children) {
      return null
    }

    const value = this.children.get(key)
    return value || null
  }

  set (key: string) {
    if (!this.children) {
      this.children = new Map<string, TrieNode>()
    }
    const node = new TrieNode()
    this.children.set(key, node)

    return node
  }
}

export class TrieTree {
  public root: TrieNode = new TrieNode()

  constructor () {
    this.root.id = 'codings'
  }

  /**
   * 加词
   * @param text 短语
   * @param code 编码
   * @param index 选重位置, `-1`表示无须选重，何如标点
   */
  put (text: string, code: string, index = -1): void {
    let node = this.root
    for (const word of text) {
      let sub = node.get(word)
      if (!sub) {
        sub = node.set(word)
      }
      node = sub
    }

    node.value = new Phrase(text, code, index)
  }

  /**
   * 查询短语
   * @param text 短语
   */
  get (text: string): Phrase | undefined {
    let node = this.root
    for (const word of text) {
      const sub = node.get(word)
      if (!sub) {
        return undefined
      }
      node = sub
    }

    return node.value
  }
}

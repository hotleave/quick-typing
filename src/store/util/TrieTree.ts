export interface NodeValue {
  /**
   * 文本
   */
  text: string;
  /**
   * 编码
   */
  code: string;
  /**
   * 选重
   */
  select: string;
  /**
   * 码长
   */
  length: number;
  /**
   * 是否为首选
   */
  first: boolean;
}

export class TrieNode {
  public id?: string
  /**
   * 子节点
   */
  public children?: Map<string, TrieNode>
  /**
   * 节点值
   */
  public value?: NodeValue

  static convert (from: { id?: string; children?: Map<string, object>; value?: NodeValue}): TrieNode {
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
    this.root.id = 'main'
  }

  /**
   * 加词
   * @param text 短语
   * @param code 编码
   * @param select 选重键
   * @param first 是否为首选
   */
  put (text: string, code: string, select: string, first: boolean): void {
    let node = this.root
    for (const word of text) {
      let sub = node.get(word)
      if (!sub) {
        sub = node.set(word)
      }
      node = sub
    }

    const length = code.length
    node.value = { text, code, select, length, first }
  }

  /**
   * 查询短语
   * @param text 短语
   */
  get (text: string): NodeValue | undefined {
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

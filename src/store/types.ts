import { ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'

/**
 * 提示文字
 */
export interface Word {
  id: number;
  text: string;
  type: string | Array<string>;
  select?: string;
  code?: string;
}

export class Phrase {
  id?: number;
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
  select = '';
  /**
   * 码长
   */
  length = 0;
  /**
   * 是否为首选
   */
  first = false;

  constructor (text: string, code: string, select?: string) {
    this.text = text
    this.code = code
    if (select) {
      this.select = select
    }
  }
}

export interface ArticleState {
  /**
   * 标题
   */
  title: string;
  /**
   * 标识
   */
  identity: string;
  /**
   * 文章内容
   */
  content: string;
  /**
   * 最短路径
   */
  shortest: ShortestPath<Phrase> | null;
}

export interface RacingState {
  /**
   * 状态
   */
  status: string;
  /**
   * 输入内容
   */
  input: string;
  /**
   * 用时
   */
  time: number;
  /**
   * 开始时间
   */
  start: number;
  /**
   * 按键序列
   */
  keys: string;
  /**
   * 退格
   */
  backspace: number;
  /**
   * 回车
   */
  enter: number;
  /**
   * 回改
   */
  replace: number;
  /**
   * 选重
   */
  selective: number;
  /**
   * 打词字数
   */
  phrase: number;
  /**
   * 重打
   */
  retry: number;
  /**
   * 计时器
   */
  timer: number;
  /**
   * 左手
   */
  leftHand: number;
  /**
   * 右手
   */
  rightHand: number;
}

export interface QuickTypingState {
  article: ArticleState;
  racing: RacingState;
  /**
   * 编码
   */
  codings: TrieNode;
}

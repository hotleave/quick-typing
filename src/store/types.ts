import { ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'

export interface Identity {
  id?: string;
}

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
  setting: SettingState;
}

export interface InterfaceStyle {
  /**
   * 未打文字颜色
   */
  '--pending': string;
  /**
   * 已打文字颜色
   */
  '--typed': string;

  /**
   * 正确文字背景颜色
   */
  '--correct': string;
  /**
   * 错误文字背景颜色
   */
  '--error': string;
  /**
   * 一码颜色
   */
  '--code1': string;
  /**
   * 二码颜色
   */
  '--code2': string;
  /**
   * 三码颜色
   */
  '--code3': string;
  /**
   * 全码颜色
   */
  '--code4': string;
}

export class SettingState implements Identity {
  id = 'setting'
  /**
   * 是否已从DB中加载
   */
  loaded = false
  /**
   * 选重键
   */
  select = '_;\'456789'

  /**
   * 未打文字颜色
   */
  pending = '#C0C4CC'
  /**
   * 已打文字颜色
   */
  typed = '#FFFFFF'

  /**
   * 正确文字背景颜色
   */
  correct = '#C0C4CC'
  /**
   * 错误文字背景颜色
   */
  error = '#F56C6C'

  /**
   * 词语提示
   */
  hint = false
  /**
   * 提示选项
   */
  hintOptions = ['phrase', 'color', 'select']
  /**
   * 一码颜色
   */
  code1 = '#F56C6C'
  /**
   * 二码颜色
   */
  code2 = '#E6A23C'
  /**
   * 三码颜色
   */
  code3 = '#409EFF'
  /**
   * 全码颜色
   */
  code4 = '#C0C4CC'

  /**
   * 替换空格
   */
  replaceSpace = true
  /**
   * 替换英文标点符号
   */
  replacePunctuation = false

  /**
   * 理论码长
   */
  ideal = true
  /**
   * 文章字数
   */
  length = true
  /**
   * 退格数量
   */
  backspace = true
  /**
   * 回改数量
   */
  replace = true
  /**
   * 击键数量
   */
  keys = true
  /**
   * 选重数量
   */
  selective = true
  /**
   * 选重率
   */
  selectiveRate = true
  /**
   * 打词数
   */
  phrase = true
  /**
   * 打词率
   */
  phraseRate = true
  /**
   * 键准
   */
  accuracy = true
  /**
   * 重打次数
   */
  retry = true
  /**
   * 键法
   */
  balance = true
  /**
   * 版本号
   */
  version = true
  /**
   * 输入法
   */
  inputMethod = false
  /**
   * 输入法名称
   */
  inputMethodName = ''
  /**
   * 个性签名
   */
  signature = false
  /**
   * 个性签名内容
   */
  signatureText = ''
}

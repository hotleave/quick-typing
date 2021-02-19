import { ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'

export interface Identity {
  id?: string;
}

export class Phrase {
  /**
   * 文本
   */
  text: string;
  /**
   * 编码
   */
  code: string;
  /**
   * 选重位置
   */
  index = 0;
  /**
   * 编码是为四码唯一
   */
  fourthSingle = false;

  constructor (text: string, code: string, index?: number) {
    this.text = text
    this.code = code
    if (index !== undefined) {
      this.index = index
    }
  }
}

/**
 * 提示文字
 */
export class Word {
  id: number;
  /**
   * 文字
   */
  text: string;
  /**
   * 编码
   */
  code: string;
  /**
   * 码长
   */
  length: number;
  /**
   * 选重
   */
  select: string;
  /**
   *  位置
   */
  index: number;
  /**
   * 类别
   */
  type: string;
  /**
   * 可以用标点顶屏
   */
  autoSelect: boolean;

  constructor (id: number, text: string, type = '', code = '', length = 0, select = '', index = -1, autoSelect = false) {
    this.id = id
    this.text = text
    this.code = code
    this.select = select
    this.length = length
    this.index = index
    this.type = type
    this.autoSelect = autoSelect
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
  shortest: ShortestPath<Word> | null;
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
   * 提示颜色
   */
  '--hint': string;
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
   * 未打文字颜色
   */
  pending = '#909399'
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
   * 候选词条数
   */
  pageSize = 9
  /**
   * 最大页数，超过指定页数的候选词丢弃, `0`为不限制
   */
  maxIndex = 0
  /**
   * 选重键，用于提示
   */
  selective = '_23456789'
  /**
   * 下一页按键
   */
  nextPage = '+'
  /**
   * 额外的二三选键
   */
  extra23Selective = ';\''
  /**
   * 在出现以下字符时需要手动选取全码首选候选词
   */
  disableAutoSelectText = '2;3\'4567890 　２；３’４５６７８９０'
  /**
   * 是否启用4码唯一时自动上屏
   */
  fourthAutoSelect = true
  /**
   * 是否启用第5码顶屏
   */
  fifthAutoSelect = true
  /**
   * 提示选项
   */
  hintOptions = ['phrase', 'color', 'select', 'punctuation']
  /**
   * 标点顶屏提示
   */
  punctuationAutoSelectHint = '顶'
  /**
   * 提示颜色
   */
  hintColor = '#909399'
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
  code4 = '#909399'

  /**
   * 替换空格
   */
  replaceSpace = true
  /**
   * 替换英文标点符号
   */
  replacePunctuation = false

  /**
   * 结果选项
   */
  resultOptions = ['identity', 'typeSpeed', 'hitSpeed', 'codeLength', 'version']

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

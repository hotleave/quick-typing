import { ShortestPath } from './util/Graph'
import { TrieNode } from './util/TrieTree'
import { punctuations } from './util/punctuation'
import { emptyKeyCount } from './util/keyboard'

export interface Identity {
  id?: string;
}

export interface LooseObject<v> {
  [key: string]: v;
}

export class Coding {
  /**
   * 编码
   */
  code: string;
  /**
   * 权重
   */
  weight: number;
  /**
   * 选重位置
   */
  index = 0;
  /**
   * 编码是为四码唯一
   */
  fourthSingle = false;

  constructor (weight: number, code: string, index?: number) {
    this.code = code
    this.weight = weight
    if (index !== undefined) {
      this.index = index
    }
  }
}

export class Phrase {
  /**
   * 文本
   */
  text: string;
  /**
   * 编码
   */
  codings: Array<Coding>

  constructor (weight: number, text: string, code: string, index?: number) {
    this.text = text
    this.codings = [new Coding(weight, code, index)]
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
   * 选重
   */
  select: string;
  /**
   * 类别
   */
  type: string;
  /**
   * 可以用标点顶屏
   */
  autoSelect: boolean;
  /**
   * 编码
   */
  codings: Array<Coding>;

  constructor (id: number, text: string, type = '', autoSelect = false, select = '', codings: Array<Coding> = []) {
    this.id = id
    this.text = text
    this.select = select
    this.type = type
    this.autoSelect = autoSelect
    this.codings = codings
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

export class RacingState {
  /**
   * 状态
   */
  status = 'wait';
  /**
   * 输入内容
   */
  input = '';
  /**
   * 用时
   */
  time = 0;
  /**
   * 开始时间
   */
  start = 0;
  /**
   * 按键序列
   */
  keys: Array<string> = [];
  /**
   * 理想按键序列
   */
  idealKeys = '';
  /**
   * 回改
   */
  replace = 0;
  /**
   * 选重
   */
  selective = 0;
  /**
   * 打词字数
   */
  phrase = 0;
  /**
   * 重打
   */
  retry = 1;
  /**
   * 计时器
   */
  timer = 0;
  /**
   * 键数
   */
  keyCount: LooseObject<number> = emptyKeyCount()
}

export interface QuickTypingState {
  article: ArticleState;
  racing: RacingState;
  /**
   * 编码
   */
  codings: TrieNode;
  setting: SettingState;
  /**
   * 总键数
   */
  overallKeyCount: LooseObject<number>;
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
  selective = '␣23456789'
  /**
   * 下一页按键
   */
  nextPage = '+'
  /**
   * 选重键对应文本，在首选字后出现以下字符时需要手动上屏
   */
  selectiveText = ' 1234567890;+\'＋；’'
  /**
   * 非首选键，用于判断选重率
   */
  altSelectKey = '234567890;\''
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
  hintOptions = ['phrase', 'color', 'select', 'autoSelect']
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
  /**
   * 加入码表
   */
  addToCodings = ['numbers', 'letters', 'punctuations']
  /**
   * 标点码表
   */
  punctuations = punctuations
  /**
   * 将标点加入码表中
   */
  addPunctuationToCodings = false
}

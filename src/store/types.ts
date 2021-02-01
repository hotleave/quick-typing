/**
 * 提示文字
 */
export interface Word {
  id: number;
  text: string;
  type: string;
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
   * 错字
   */
  error: number;
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
}

export interface QuickTypingState {
  article: ArticleState;
  racing: RacingState;
}

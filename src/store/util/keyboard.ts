export interface Keynote {
  /**
   * 显示文本
   */
  key: string;
  /**
   * 手指位置
   * 0 - 3: 左手，4 - 7: 右手, 8：待定，9：拇指
   */
  finger: number;
  /**
   * 所在行
   */
  row: number;
  /**
   * 是否为功能键
   */
  fn?: boolean;
}

export const keyboard = new Map<string, Keynote>([
  ['Escape', { key: '⎋', fn: true, finger: 0, row: 0 }],
  ['F1', { key: '', fn: true, finger: 0, row: 0 }],
  ['F2', { key: '', fn: true, finger: 0, row: 0 }],
  ['F3', { key: '', fn: true, finger: 0, row: 0 }],
  ['F4', { key: '', fn: true, finger: 0, row: 0 }],
  ['F5', { key: '', fn: true, finger: 0, row: 0 }],
  ['F6', { key: '', fn: true, finger: 0, row: 0 }],
  ['F7', { key: '', fn: true, finger: 0, row: 0 }],
  ['F8', { key: '', fn: true, finger: 0, row: 0 }],
  ['F9', { key: '', fn: true, finger: 0, row: 0 }],
  ['F10', { key: '', fn: true, finger: 0, row: 0 }],
  ['F11', { key: '', fn: true, finger: 0, row: 0 }],
  ['F12', { key: '', fn: true, finger: 0, row: 0 }],
  ['PrintScreen', { key: '', fn: true, finger: 8, row: 0 }],
  ['ScrollLock', { key: '', fn: true, finger: 8, row: 0 }],
  ['Pause', { key: '⏸', fn: true, finger: 8, row: 0 }],
  ['Backquote', { key: '`', finger: 0, row: 1 }],
  ['Digit1', { key: '1', finger: 0, row: 1 }],
  ['Digit2', { key: '2', finger: 1, row: 1 }],
  ['Digit3', { key: '3', finger: 2, row: 1 }],
  ['Digit4', { key: '4', finger: 3, row: 1 }],
  ['Digit5', { key: '5', finger: 3, row: 1 }],
  ['Digit6', { key: '6', finger: 4, row: 1 }],
  ['Digit7', { key: '7', finger: 4, row: 1 }],
  ['Digit8', { key: '8', finger: 5, row: 1 }],
  ['Digit9', { key: '9', finger: 6, row: 1 }],
  ['Digit0', { key: '0', finger: 7, row: 1 }],
  ['Minus', { key: '-', finger: 7, row: 1 }],
  ['Equal', { key: '=', finger: 7, row: 1 }],
  ['Backspace', { key: '⌫', fn: true, finger: 7, row: 1 }],
  ['Insert', { key: '', fn: true, finger: 8, row: 1 }],
  ['Home', { key: '⇤', fn: true, finger: 8, row: 1 }],
  ['PageUp', { key: '«', fn: true, finger: 8, row: 1 }],
  ['Tab', { key: '⇆', fn: true, finger: 0, row: 2 }],
  ['KeyQ', { key: 'q', finger: 0, row: 2 }],
  ['KeyW', { key: 'w', finger: 1, row: 2 }],
  ['KeyE', { key: 'e', finger: 2, row: 2 }],
  ['KeyR', { key: 'r', finger: 3, row: 2 }],
  ['KeyT', { key: 't', finger: 3, row: 2 }],
  ['KeyY', { key: 'y', finger: 3, row: 2 }],
  ['KeyU', { key: 'u', finger: 3, row: 2 }],
  ['KeyI', { key: 'i', finger: 4, row: 2 }],
  ['KeyO', { key: 'o', finger: 5, row: 2 }],
  ['KeyP', { key: 'p', finger: 6, row: 2 }],
  ['BracketLeft', { key: '[', finger: 7, row: 2 }],
  ['BracketRight', { key: ']', finger: 7, row: 2 }],
  ['Backslash', { key: '\\', finger: 7, row: 2 }],
  ['Delete', { key: '⌦', fn: true, finger: 8, row: 2 }],
  ['End', { key: '⇥', fn: true, finger: 8, row: 2 }],
  ['PageDown', { key: '»', fn: true, finger: 8, row: 2 }],
  ['CapsLock', { key: '⇪', fn: true, finger: 0, row: 3 }],
  ['KeyA', { key: 'a', finger: 0, row: 3 }],
  ['KeyS', { key: 's', finger: 1, row: 3 }],
  ['KeyD', { key: 'd', finger: 2, row: 3 }],
  ['KeyF', { key: 'f', finger: 3, row: 3 }],
  ['KeyG', { key: 'g', finger: 3, row: 3 }],
  ['KeyH', { key: 'h', finger: 4, row: 3 }],
  ['KeyJ', { key: 'j', finger: 4, row: 3 }],
  ['KeyK', { key: 'k', finger: 5, row: 3 }],
  ['KeyL', { key: 'l', finger: 6, row: 3 }],
  ['Semicolon', { key: ';', finger: 7, row: 3 }],
  ['Quote', { key: '\'', finger: 7, row: 3 }],
  ['Enter', { key: '⏎', fn: true, finger: 7, row: 3 }],
  ['ShiftLeft', { key: '⇧', fn: true, finger: 0, row: 4 }],
  ['KeyZ', { key: 'z', finger: 0, row: 4 }],
  ['KeyX', { key: 'x', finger: 1, row: 4 }],
  ['KeyV', { key: 'v', finger: 2, row: 4 }],
  ['KeyC', { key: 'c', finger: 3, row: 4 }],
  ['KeyB', { key: 'b', finger: 3, row: 4 }],
  ['KeyM', { key: 'm', finger: 4, row: 4 }],
  ['KeyN', { key: 'n', finger: 4, row: 4 }],
  ['Comma', { key: ',', finger: 5, row: 4 }],
  ['Period', { key: '.', finger: 6, row: 4 }],
  ['Slash', { key: '/', finger: 7, row: 4 }],
  ['ShiftRight', { key: '⇧', fn: true, finger: 7, row: 4 }],
  ['ArrowUp', { key: '↑', fn: true, finger: 8, row: 4 }],
  ['ControlLeft', { key: '⌃', fn: true, finger: 0, row: 5 }],
  ['AltLeft', { key: '⌥', fn: true, finger: 0, row: 5 }],
  ['MetaLeft', { key: '⌘', fn: true, finger: 0, row: 5 }],
  ['Space', { key: '␣', finger: 9, row: 5 }],
  ['ControlRight', { key: '⌃', fn: true, finger: 7, row: 5 }],
  ['MetaRight', { key: '⌘', fn: true, finger: 7, row: 5 }],
  ['AltRight', { key: '⌥', fn: true, finger: 7, row: 5 }],
  ['ArrowLeft', { key: '←', fn: true, finger: 8, row: 5 }],
  ['ArrowDown', { key: '↓', fn: true, finger: 8, row: 0 }],
  ['ArrowRight', { key: '→', fn: true, finger: 8, row: 0 }]
])

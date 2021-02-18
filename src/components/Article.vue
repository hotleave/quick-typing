<template>
  <div :class="articleStyle" :style="styles">
    <Words v-for="word in words" :key="word.id" :word="word"/>
  </div>
</template>

<script lang="ts">
import { InterfaceStyle, Word } from '@/store/types'
import { Edge, ShortestPath } from '@/store/util/Graph'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Words from '@/components/Words.vue'

const article = namespace('article')
const racing = namespace('racing')
const setting = namespace('setting')

@Component({
  components: { Words }
})
export default class Article extends Vue {
  @article.State('content')
  private content!: string

  @racing.State('input')
  private input!: string

  @article.State('shortest')
  private shortest!: ShortestPath<Word> | null;

  @racing.Getter('progress')
  private progress!: number

  @setting.Getter('styles')
  private styles!: InterfaceStyle

  @setting.State('hint')
  private hint!: boolean

  @setting.State('hintOptions')
  private hintOptions!: Array<string>

  get articleStyle (): Array<string> {
    let mode = 'inline'
    if (this.hint && this.shortest !== null && (this.codeHint || this.selectHint)) {
      mode = 'grid'
    }
    return ['article', mode]
  }

  get selectHint (): boolean {
    return this.hintOptions.indexOf('select') >= 0
  }

  get codeHint (): boolean {
    return this.hintOptions.indexOf('code') >= 0
  }

  get words (): Array<Word> {
    const length = this.content.length
    if (length === 0) {
      return []
    }

    const input = this.input
    const words: Array<Word> = []
    if (!this.hint || this.shortest === null) {
      const inputLength = input.length
      const typed = this.content.substring(0, inputLength)
      this.check(0, input, typed, words)
      const pending = this.content.substring(inputLength)
      words.push(new Word(inputLength, pending, 'pending'))
    } else {
      const { path, vertices } = this.shortest
      for (let i = 0; i < length;) {
        const edge = vertices[path[i]].get(i)
        if (!edge) {
          break
        }
        const next = this.addPhrase(input, edge, words)
        i = next === 0 ? path[i] : next
      }
    }

    return words
  }

  /**
   * 自动调整滚动条位置
   */
  @Watch('progress')
  autoScroll (progress: number) {
    const el = this.$el
    const { scrollHeight, clientHeight } = el
    const fixed = 150
    if (scrollHeight > clientHeight) {
      let scrollTop = scrollHeight * progress
      if (scrollTop <= fixed) {
        scrollTop = 0
      } else if (scrollHeight - scrollTop > clientHeight) {
        scrollTop -= fixed
      } else {
        scrollTop -= fixed * progress
      }

      el.scrollTop = scrollTop
    }
  }

  check (index: number, input: string, target: string, words: Array<Word>): void {
    const length = target.length
    const targetWords = target.split('')
    const inputWords = input.split('')
    let lastCorrect = targetWords[0] === inputWords[0]
    let text = ''

    inputWords.forEach((v, i) => {
      if (i >= length) {
        return
      }

      const target = targetWords[i]
      const correct = v === target

      if (correct !== lastCorrect) {
        words.push(new Word(index + i - text.length, text, lastCorrect ? 'correct' : 'error'))
        text = ''
        lastCorrect = correct
      }
      text = text.concat(target)
    })

    if (text.length > 0) {
      words.push(new Word(index + input.length - text.length, text, lastCorrect ? 'correct' : 'error'))
    }
  }

  addPhrase (content: string, edge: Edge<Word>, words: Array<Word>): number {
    const { from, to, value } = edge

    if (content.length <= to) {
      // 输入长度小于当前词首，未打
      words.push(value)
      return 0
    } else {
      // 输入长度大于当前词尾，已打, 否则部分已打
      const length = content.length
      const source = content.substring(to, Math.min(from, length))
      this.check(to, source, value.text, words)
      return length > from ? 0 : length
    }
  }
}
</script>

<style lang="scss">
.article {
  padding: 5px 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 2rem;
  height: 15rem;
  overflow: auto;
  color: var(--pending, #606266);

  :nth-child(2n) {
    font-weight: bold;
  }

  .correct, .error, .pending {
    font-weight: normal;
  }
  .correct, .error {
    color: var(--typed, #fff);
  }
  .correct {
    background-color: var(--correct, #C0C4CC);
  }
  .error {
    background-color: var(--error, #F56C6C);
  }

  .code1 {
    color: var(--code1, #F56C6C);
  }
  .code2 {
    color: var(--code2, #E6A23C);
  }
  .code3 {
    color: var(--code3, #409EFF);
  }
  .code4 {
    color: var(--code4, #909399);
  }
}

.article.grid {
  div {
    display: inline-grid;
  }

  label {
    display: inline-block;
    width: 90%;
    margin: 0 auto;
    text-align: center;
    font-size: 12px;
    font-weight: normal;
    color: var(--hint, #909399);
    letter-spacing: 1px;
    border-top: 1px solid var(--hint, #909399);
  }

  span:last-child {
    height: 4rem;
  }
}

.article.inline {
  div {
    display: inline;
  }
}
</style>

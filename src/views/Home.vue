<template>
  <div class="home">
    <div class="info">
      <label>速度：<span>{{ typeSpeed }}</span></label>
      <label>击键：<span>{{ hitSpeed }}</span></label>
      <label>码长：<span>{{ codeLength }}</span></label>
      <label>理论码长：<span>{{ idealCodeLength }}</span></label>
    </div>
    <Article ref="article"/>
    <textarea id="typing" @keydown="keydown" @input="accept(input)" :disabled="status !== 'typing' && status !== 'init'" v-model="input" autofocus="true"></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Article from '@/components/Article.vue' // @ is an alias to /src
import { Action, namespace } from 'vuex-class'
import db from '../store/util/Database'
import { TrieNode } from '@/store/util/TrieTree'

const article = namespace('article')
const racing = namespace('racing')

@Component({
  components: {
    Article
  }
})

export default class Home extends Vue {
  @article.Action('loadArticle')
  private loadArticle!: Function

  @article.State('content')
  private content!: string

  @racing.State('status')
  private status!: string

  @racing.Action('accept')
  private accept!: Function

  @racing.Mutation('typing')
  private typing!: Function

  @racing.Mutation('pause')
  private pause!: Function

  @racing.Mutation('resume')
  private resume!: Function

  @racing.Mutation('retry')
  private retry!: Function

  @racing.Getter('result')
  private result!: string

  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.Getter('idealCodeLength')
  private idealCodeLength!: string

  @Action('codings')
  private codings!: Function

  // 输入的内容
  private input = ''

  @Watch('status')
  statusUpdate (newStatus: string) {
    const result = this.result
    function handler (event: ClipboardEvent) {
      const { clipboardData } = event
      clipboardData && clipboardData.setData('text/plain', result)
      document.removeEventListener('copy', handler, true)
      event.preventDefault()
    }

    if (newStatus === 'finished') {
      document.addEventListener('copy', handler, true)
      document.execCommand('copy')
    }
  }

  @Watch('input')
  inputUpdate () {
    const el = (this.$refs.article as Vue).$el
    const scrollLength = el.scrollHeight - el.clientHeight
    if (scrollLength > 0) {
      const progress = this.input.length / this.content.length
      const scrollTop = progress * scrollLength

      el.scrollTop = Math.max(scrollTop - 50 * (1 - progress), 0)
    }
  }

  created () {
    document.addEventListener('keydown', this.handleShortCut)
    document.addEventListener('paste', this.paste)
    db.codings.get('main').then((root: TrieNode | undefined) => {
      if (root) {
        root = TrieNode.convert(root)
        this.codings(root)
        console.log('Trie tree loaded')
      }
    })
  }

  destroyed () {
    document.removeEventListener('keydown', this.handleShortCut)
    document.removeEventListener('paste', this.paste)
  }

  /**
   * Textarea 按键监听
   */
  keydown (e: KeyboardEvent) {
    // console.log(e, e.isComposing && ';\'23456789'.indexOf(e.key) >= 0)
    // if (!e.metaKey && !e.ctrlKey) {
    //   e.stopPropagation()
    // }

    this.typing(e)
  }

  /**
   * 粘贴监听
   */
  paste (e: ClipboardEvent) {
    e.preventDefault()

    const clipboardData = e.clipboardData
    if (clipboardData) {
      const pasteContent = clipboardData.getData('text/plain')
      if (pasteContent) {
        this.accept('')
        this.loadArticle(pasteContent)
        this.input = ''
        setTimeout(this.focusInput, 50)
      }
    }
  }

  handleShortCut (e: KeyboardEvent) {
    switch (e.key) {
      case 'F3':
        // 重打
        this.retry()
        this.input = ''
        this.accept('')
        break
      case 'Escape':
        // 暂停
        this.pause()
        break
      case 'Enter':
        // 恢复
        this.resume()
        setTimeout(this.focusInput, 50)
        break
    }
  }

  focusInput () {
    const input = document.getElementById('typing')
    input && input.focus()
  }
}
</script>

<style lang="scss" scoped>
#typing {
  font-size: 3rem;
  width: 80%;
  height: 24rem;
  display: block;
  margin: .5rem auto;
  border: 1px solid #cccccc;
  border-radius: 5px;
  letter-spacing: 3px;
}
</style>

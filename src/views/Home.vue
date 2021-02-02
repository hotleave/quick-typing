<template>
  <div class="home">
    <Article/>
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

  created () {
    document.addEventListener('keydown', this.handleShortCut)
    document.addEventListener('paste', this.paste)
    db.codings.get('main').then((root: TrieNode | undefined) => {
      if (root) {
        root = TrieNode.convert(root)
        this.codings(root)
        console.log('Loaded')
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
    // console.log(e)
    // if (!e.metaKey && !e.ctrlKey) {
    //   e.stopPropagation()
    // }

    this.typing(e.key)
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
  font-size: 3em;
  width: 80%;
  height: 400px;
  display: block;
  margin: .5em auto;
  border: 1px solid #cccccc;
  border-radius: 4px;
}
</style>

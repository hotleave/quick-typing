<template>
  <el-row>
    <el-col :span="24">
      <Indicator/>
      <Article ref="article"/>
      <Racing ref="racing"/>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Indicator from '@/components/Indicator.vue'
import Article from '@/components/Article.vue'
import Racing from '@/components/Racing.vue'
import { Action, namespace } from 'vuex-class'
import db from '../store/util/Database'
import { TrieNode } from '@/store/util/TrieTree'

const article = namespace('article')
const racing = namespace('racing')

@Component({
  components: {
    Article,
    Indicator,
    Racing
  }
})

export default class Home extends Vue {
  @racing.Mutation('pause')
  private pause!: Function

  @racing.Action('resume')
  private resume!: Function

  @racing.Action('retry')
  private retry!: Function

  @article.Action('loadArticle')
  private loadArticle!: Function

  @Action('codings')
  private codings!: Function

  created () {
    // 监听快捷键
    document.addEventListener('keydown', this.handleShortCut)

    // 监听粘贴事件
    document.addEventListener('paste', this.paste)

    // 读取数据库中的码表
    db.codings.get('main').then((root: TrieNode | undefined) => {
      if (root) {
        const node = TrieNode.convert(root)
        this.codings(node)
        console.log('Trie tree loaded')
      }
    })
  }

  destroyed () {
    document.removeEventListener('keydown', this.handleShortCut)
    document.removeEventListener('paste', this.paste)
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
        this.loadArticle(pasteContent)
      }
    }
  }

  handleShortCut (e: KeyboardEvent) {
    switch (e.key) {
      case 'F3':
        // 重打
        this.retry()
        break
      case 'Escape':
        // 暂停
        this.pause()
        break
      case 'Enter':
        // 恢复
        this.resume()
        break
    }
  }
}
</script>

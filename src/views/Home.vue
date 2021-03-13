<template>
  <div>
    <el-container>
      <el-aside>
        <Indicator/>
      </el-aside>
      <el-main class="main">
        <el-row class="toolbar">
          <el-col :span="12" :offset="12">
            <el-button-group>
              <el-button size="mini" icon="el-icon-document" @click="loadFromClipboard">载文</el-button>
              <el-button size="mini" :icon="triggerIcon" @click="trigger">{{ triggerText }}</el-button>
              <el-button size="mini" icon="el-icon-refresh" @click="retry">重打</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row class="middle">
          <el-col :span="24">
            <Article ref="article"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <Racing ref="racing"/>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Indicator from '@/components/Indicator.vue'
import Article from '@/components/Article.vue'
import Racing from '@/components/Racing.vue'
import { namespace } from 'vuex-class'

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
  @racing.State('status')
  private status!: string

  @racing.Action('pause')
  private pause!: Function

  @racing.Action('resume')
  private resume!: Function

  @racing.Action('retry')
  private retry!: Function

  @article.Action('loadArticle')
  private loadArticle!: Function

  get triggerText (): string {
    return this.status === 'pause' ? '继续' : '暂停'
  }

  get triggerIcon (): string {
    return this.status === 'pause' ? 'el-icon-video-play' : 'el-icon-video-pause'
  }

  created () {
    // 监听快捷键
    document.addEventListener('keydown', this.handleShortCut)

    // 监听粘贴事件
    document.addEventListener('paste', this.paste)

    // 切换页面自动暂停
    window.addEventListener('blur', () => this.pause())
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

    const { clipboardData } = e
    if (clipboardData) {
      const pasteContent = clipboardData.getData('text/plain')
      if (pasteContent) {
        try {
          this.loadArticle(pasteContent)
        } catch (error) {
          this.$message.error(error.message)
        }
      }
    }
  }

  loadFromClipboard () {
    try {
      navigator.clipboard.readText().then(text => { this.loadArticle(text) })
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  trigger () {
    if (this.status === 'pause') {
      this.resume()
    } else {
      this.pause()
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

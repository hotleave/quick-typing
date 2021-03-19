<template>
  <div>
    <el-input id="racing-textarea" type="textarea" ref="textarea"
      @keydown.native="typing"
      @blur="pause"
      @input="accept(input)"
      :disabled="status !== 'typing' && status !== 'init'"
      placeholder="在这里输入赛文..."
      v-model="input">
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')

@Component
export default class Racing extends Vue {
  @racing.State('status')
  private status!: string

  @racing.Getter('result')
  private result!: string

  @racing.Action('typing')
  private typing!: Function

  @racing.Action('accept')
  private accept!: Function

  @racing.Action('pause')
  private pause!: Function

  /**
   * 输入的内容
   */
  private input = ''

  @Watch('status')
  statusUpdate (status: string) {
    switch (status) {
      case 'init':
        this.input = ''
        // fall through
      case 'typing':
        setTimeout(this.focus, 50)
        break
      case 'finished': {
        const result = this.result
        navigator.clipboard.writeText(result).then(() => result, () => {
          document.addEventListener('copy', this.copy, true)
          document.execCommand('copy')
        })
        this.$notify({ title: '成功', message: result, type: 'success', duration: 10000, showClose: true })
        break
      }
    }
  }

  /**
   * 让输入框获取焦点
   */
  focus () {
    (this.$refs.textarea as HTMLElement).focus()
  }

  /**
   * 复制结果到剪切板
   */
  copy (event: ClipboardEvent) {
    const { clipboardData } = event
    clipboardData && clipboardData.setData('text/plain', this.result)
    document.removeEventListener('copy', this.copy, true)
    event.preventDefault()
  }
}
</script>

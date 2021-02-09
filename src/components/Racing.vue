<template>
  <el-input class="textarea" type="textarea" rows="6" ref="textarea"
    @keydown.native="typing"
    @input="accept(input)"
    :disabled="status !== 'typing' && status !== 'init'"
    v-model="input">
  </el-input>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')
// const article = namespace('article')

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

  // 输入的内容
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
      case 'finished':
        document.addEventListener('copy', this.copy, true)
        document.execCommand('copy')
        this.$message({ message: this.result, type: 'success', showClose: true, duration: 5000 })
        break
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

<style lang="scss" scoped>
.textarea {
  font-size: 2rem;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}
</style>

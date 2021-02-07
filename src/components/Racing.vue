<template>
  <div class="racing">
    <textarea ref="textarea" @keydown="typing" @input="accept(input)" :disabled="status !== 'typing' && status !== 'init'" v-model="input" autofocus="true"></textarea>

    <div class="info">
      <label>状态：<span>{{ status }}</span></label>
    </div>
  </div>
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

  @racing.Mutation('typing')
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
.info {
  width: 100%;
  padding: .5rem;
  margin-top: .5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: #999;

  label {
    font-size: 1.5rem;
    margin-right: 1rem;
    padding: .5rem;

    span {
      color: #f66;
    }
  }
}

textarea {
  font-size: 2rem;
  height: 16rem;
  width: 100%;
  padding: .5rem;
  border: 1px solid #cccccc;
  border-radius: 5px;
  letter-spacing: 3px;
}
</style>

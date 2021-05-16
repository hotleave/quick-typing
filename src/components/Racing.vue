<template>
  <div>
    <el-input id="racing-textarea" type="textarea" ref="textarea"
      @keydown.native="typing"
      @blur="pause"
      @input="accept(input)"
      @compositionstart.native="compositionStart"
      @compositionupdate.native="compositionupdate"
      @compositionend.native="compositionEnd"
      :disabled="status !== 'typing' && status !== 'init'"
      placeholder="在这里输入赛文..."
      v-model="input">
    </el-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Clipboard from '@/store/util/Clipboard'

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
      case 'init': {
        this.input = ''
        const textarea = document.getElementById('racing-textarea') as HTMLInputElement
        textarea.value = ''
        setTimeout(this.focus, 50)
        break
      }
      case 'typing':
        setTimeout(this.focus, 50)
        break
      case 'finished': {
        const text = this.result
        Clipboard.copy(text, () => null, () => {
          this.$message.warning('你的浏览器不支持自动复制，需要手动操作')
        })
        this.$message.success(text)
        break
      }
    }
  }

  compositionStart (e: CompositionEvent) {
    console.log('compisition start', e)
  }

  compositionupdate (e: CompositionEvent) {
    console.log('compisition update', e)
  }

  compositionEnd (e: CompositionEvent) {
    console.log('compisition end', e)
  }

  /**
   * 让输入框获取焦点
   */
  focus () {
    (this.$refs.textarea as HTMLElement).focus()
  }
}
</script>

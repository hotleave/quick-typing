<template>
  <div :class="style">
    <span>{{ word.text }}</span>
    <label v-if="hasHint">{{ hintText }}</label>
  </div>
</template>

<script lang="ts">
import { Word } from '@/store/types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const setting = namespace('setting')

@Component
export default class Words extends Vue {
  @Prop({ type: Word, required: true })
  readonly word!: Word

  @setting.State('hint')
  private hint!: boolean

  @setting.State('hintOptions')
  private hintOptions!: Array<string>

  get colorHint (): boolean {
    return this.hintOptions.indexOf('color') >= 0
  }

  get selectHint (): boolean {
    return this.hintOptions.indexOf('select') >= 0
  }

  get codeHint (): boolean {
    console.log('codeHint')
    return this.hintOptions.indexOf('code') >= 0
  }

  get style (): Array<string> {
    const styles = ['code']
    const { type } = this.word

    if (this.colorHint || !type.startsWith('code')) {
      styles.push(type)
    }

    return styles
  }

  get hasHint (): boolean {
    const { code, select, hint } = this.word
    return this.hint && ((this.codeHint && !!code) || (this.selectHint && (!!select || !!hint)))
  }

  get hintText (): string {
    let text = ''
    const { code, select, hint } = this.word
    if (this.codeHint) {
      text += code
    }
    if (this.selectHint) {
      text += select
      if (hint) {
        text += hint
      }
    }
    return text
  }
}
</script>

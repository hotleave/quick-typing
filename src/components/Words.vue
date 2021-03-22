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

  @setting.State('punctuationAutoSelectHint')
  private punctuationAutoSelectHint!: string

  @setting.State('hintOptions')
  private hintOptions!: Array<string>

  get hasColorHint (): boolean {
    return this.hintOptions.indexOf('color') >= 0 || !this.word.type.startsWith('code')
  }

  get hasSelectHint (): boolean {
    return this.hintOptions.indexOf('select') >= 0 && !!this.word.select
  }

  get hasCodeHint (): boolean {
    const { codings } = this.word
    return this.hintOptions.indexOf('code') >= 0 && codings && codings.length > 0 && !!codings[0].code
  }

  get hasAutoSelectHint (): boolean {
    return this.hintOptions.indexOf('autoSelect') >= 0 && this.word.autoSelect
  }

  get style (): Array<string> {
    const styles = ['code']

    if (this.hasColorHint) {
      styles.push(this.word.type)
    }

    return styles
  }

  get hasHint (): boolean {
    return this.hint && (this.hasCodeHint || this.hasSelectHint || this.hasAutoSelectHint)
  }

  get hintText (): string {
    let text = ''
    const { select, codings } = this.word
    if (this.hasCodeHint) {
      text += codings[0].code
    }
    if (this.hasSelectHint) {
      text += select
    }
    if (this.hasAutoSelectHint) {
      text += this.punctuationAutoSelectHint
    }
    return text
  }
}
</script>

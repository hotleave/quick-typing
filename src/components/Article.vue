<template>
  <div class="article">
    <div v-for="word in words" :key="word.id" :class="word.type">
      <span>{{ word.text }}</span>
      <label v-if="word.code">{{ word.code }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Word } from '@/store/types'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const article = namespace('article')
const racing = namespace('racing')

@Component
export default class Article extends Vue {
  @article.Getter('words')
  private words!: Array<Word>

  @racing.Getter('progress')
  private progress!: number

  /**
   * 自动调整滚动条位置
   */
  @Watch('progress')
  autoScroll () {
    const el = this.$el
    const scrollLength = el.scrollHeight - el.clientHeight
    if (scrollLength > 0) {
      const scrollTop = this.progress * scrollLength

      el.scrollTop = Math.max(scrollTop - 192 * (1 - this.progress), 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
  font-size: 3rem;
  height: 24rem;
  width: 100%;
  padding: .5rem .5rem 3.5rem .5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
  letter-spacing: 3px;
  margin-bottom: .5rem;

  div {
    display: inline-grid;

    label {
      display: inline-block;
      width: 80%;
      margin: 0 auto;
      font-size: 0.3rem;
      color: #aaa;
      letter-spacing: 1px;
      border-top: 1px solid #aaa;
      text-align: center;
    }
  }

  // 待打
  .pending1 {
    color: #f66;
  }
  .pending2 {
    color: #cc0;
  }
  .pending3 {
    color: #39C;
  }
  .pending, .pending4 {
    color: #999;
  }

  // 已打
  // .correct, .error {
  //   display: inline;
  //   line-height: 5.1rem;
  // }
  .correct {
    background-color: #ccc;
  }
  .error {
    background-color: #f66;
  }
}
</style>

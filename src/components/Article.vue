<template>
  <div class="article">
    <div v-for="word in words" :key="word.id" :class="word.type">
      <span>{{ word.text }}</span>
      <label v-if="word.select && word.select !== '_'">{{ word.select }}</label>
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
  autoScroll (progress: number) {
    const el = this.$el
    const { scrollHeight, clientHeight } = el
    const fixed = 150
    if (scrollHeight > clientHeight) {
      let scrollTop = scrollHeight * progress
      if (scrollTop <= fixed) {
        scrollTop = 0
      } else if (scrollHeight - scrollTop > clientHeight) {
        scrollTop -= fixed
      } else {
        scrollTop -= fixed * progress
      }

      el.scrollTop = scrollTop
    }
  }
}
</script>

<style lang="scss" scoped>
.article {
  font-size: 2rem;
  height: 16rem;
  width: 100%;
  padding: .5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
  letter-spacing: 3px;
  margin-bottom: .5rem;
  color: #999;

  div {
    display: inline-grid;

    label {
      display: inline-block;
      width: 80%;
      margin: 0 auto;
      font-size: 0.6rem;
      color: #aaa;
      letter-spacing: 1px;
      border-top: 1px solid #aaa;
      text-align: center;
    }
  }

  // 待打
  .code1 {
    color: #f66;
  }
  .code2 {
    color: #cc0;
  }
  .code3 {
    color: #39C;
  }
  .code4 {
    color: #ccc;
  }
  :nth-child(2n) {
    font-weight: bold;
  }

  .correct>span, .code1>span:last-child, .code2>span:last-child, .code3>span:last-child, .code4>span:last-child {
    height: 4rem;
  }

  // 已打
  .correct, .error {
    color: #fff;
    font-weight: normal;
  }
  .correct {
    background-color: #ccc;
  }
  .error {
    background-color: #f66;
  }
}
</style>

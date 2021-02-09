<template>
  <div class="article" :style="{}">
    <div v-for="word in words" :key="word.id" :class="word.type">
      <span>{{ word.text }}</span>
      <label v-if="word.select">{{ word.select }}</label>
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
  padding: 5px 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 2rem;
  height: 15rem;
  overflow: auto;

  .grid {
    display: inline-grid;

    label {
      display: inline-block;
      width: 90%;
      margin: 0 auto;
      text-align: center;
      font-size: 0.6rem;
      font-weight: normal;
      color: var(--hint, #C0C4CC);
      letter-spacing: 1px;
      border-top: 1px solid var(--hint, #C0C4CC);
    }

    :nth-child(2n) {
      font-weight: bold;
    }

    span:last-child {
      height: 4rem;
    }
  }

  // 待打
  .code1 {
    color: var(--code1, #F56C6C);
  }
  .code2 {
    color: var(--code2, #E6A23C);
  }
  .code3 {
    color: var(--code3, #409EFF);
  }
  .code4 {
    color: var(--code4, #C0C4CC);
  }

  .inline {
    display: inline;
  }

  // 未打
  .pending {
    color: var(--pending, #C0C4CC);
  }

  // 已打
  .correct, .error {
    color: var(--typed, #fff);
    font-weight: normal;
  }
  .correct {
    background-color: var(--correct, #C0C4CC);
  }
  .error {
    background-color: var(--error, #F56C6C);
  }
}
</style>

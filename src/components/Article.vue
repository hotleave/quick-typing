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
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const article = namespace('article')

@Component
export default class Article extends Vue {
    @article.Getter('words')
    private words!: [Word]
}
</script>

<style lang="scss" scoped>
.article {
  font-size: 3rem;
  width: 80%;
  min-width: 10rem;
  height: 24rem;
  margin: 0 auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: auto;
  letter-spacing: 3px;

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
  .correct, .error {
    display: inline;
    line-height: 1.3rem;
  }
  .correct {
    background-color: #ccc;
  }
  .error {
    background-color: #f66;
  }
}
</style>

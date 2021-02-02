<template>
  <div class="article">
    <div v-for="word in words" :key="word.id" :class="[word.type, 'key' + (word.code ? word.code.length - 1 : '')]">
      <span>{{ word.text }}</span>
      <label>{{ word.code }}</label>
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
  font-size: 3em;
  width: 80%;
  height: 400px;
  margin: 0 auto;
  border: 1px solid #cccccc;
  border-radius: 4px;
  overflow: auto;

  div {
    display: inline-grid;
    text-align: center;
    margin-right: 5px;
  }

  label {
    margin-top: -0.5em;
    font-size: 0.5em;
  }

  .normal {
    background-color: transparent;

    span {
      text-decoration: underline;
    }
  }
  .normal.key1 {
    color: red;
  }
  .normal.key2 {
    color: rgb(255, 217, 0);
  }
  .normal.key3 {
    color: blue;
  }
  .normal.key4 {
    color: #333
  }
  .correct {
    background-color: #cccccc;
  }
  .error {
    background-color: red;
  }
}
</style>

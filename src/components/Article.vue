<template>
    <p class="article">
        <span v-for="word in words" :key="word.id" :class="word.type">{{ word.text }}</span>
    </p>
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

  .normal {
    background-color: transparent
  }
  .correct {
    background-color: #cccccc
  }
  .error {
    background-color: red
  }
}
</style>

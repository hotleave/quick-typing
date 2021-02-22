<template>
  <div class="about">
    <h1>QuickTyping v{{ version }}</h1>
    <p class="intro">
      <ReadmeMarkdown/>
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// import { ReadmeMarkdown } from '/help.md'

@Component
export default class Setting extends Vue {
  private version = process.env.VUE_APP_VERSION
}
</script>

<style lang="scss" scoped>
.about {
  color: #606266;
  h1 {
    color: #303133;
  }
}
</style>

<template>
  <div>
    <label for="codings">编码文件:</label>
    <input id="codings" type="file" @change="loadPhrase"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TrieTree } from '../store/util/TrieTree'
import db from '../store/util/Database'
import punctuation from '../store/util/punctuation'

const alternatives = '_;\'456789'

interface HtmlInputEvent extends Event {
  target: HTMLInputElement;
}

@Component
export default class Article extends Vue {
  loadPhrase ({ target }: HtmlInputEvent): void {
    const { files } = target
    if (files === null || files.length === 0) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const trie = new TrieTree()
      const lines = (reader.result as string).split(/[\r\n]/)
      const altCount = alternatives.length
      let count = 0
      let lastCode = ''
      lines.map(line => line.split('\t'))
        .filter(line => line.length === 2)
        .forEach(line => {
          const text = line[0]
          const exist = trie.get(text)
          const code = line[1]
          let select = ''
          let index

          if (code === lastCode) {
            index = ++count

            while (index >= altCount) {
              select += '+'
              index -= altCount
            }
          } else {
            index = count = 0
            lastCode = code
          }

          if (code.length < 4 || index > 0) {
            select += alternatives[index]
          }

          if (!exist || exist.code.length > code.length) {
            trie.put(text, code, select, index === 0)
          }
        })

      for (const entry of punctuation.entries()) {
        trie.put(entry[0], entry[1], '', false)
      }

      db.configs.put(trie.root).then(() => {
        this.$message({ message: '码表处理完成', type: 'success', showClose: true, duration: 5000 })
      })
    }

    reader.readAsText(files[0])
  }
}
</script>

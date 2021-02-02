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

const alternatives = '_23456789'

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
          let code = line[1]
          let index

          if (code === lastCode) {
            index = ++count

            while (index >= altCount) {
              code += '+'
              index -= altCount
            }
          } else {
            index = count = 0
            lastCode = code
          }

          if (line[1].length < 4 || index > 0) {
            code += alternatives[index]
          }

          if (!exist || exist.code.length > code.length) {
            trie.put(text, code, alternatives[index])
          }
        })

      console.log(trie.root.id)
      db.codings.put(trie.root).then(() => {
        console.log('Done.')
      })
    }

    reader.readAsText(files[0])
  }
}
</script>

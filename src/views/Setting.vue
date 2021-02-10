<template>
  <el-form :model="form" label-suffix=":" label-width="8rem">
    <el-tabs>
      <el-tab-pane label="基本设置">
        <el-form-item label="未打颜色">
          <el-color-picker v-model="form.pending"></el-color-picker>
        </el-form-item>
        <el-form-item label="已打颜色">
          <el-color-picker v-model="form.typed"></el-color-picker>
        </el-form-item>
        <el-form-item label="正确颜色">
          <el-color-picker v-model="form.correct"></el-color-picker>
        </el-form-item>
        <el-form-item label="错误颜色">
          <el-color-picker v-model="form.error"></el-color-picker>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="词语提示设置">
        <el-form-item label="词语提示">
          <el-switch v-model="form.hint"></el-switch>
        </el-form-item>
        <el-form-item v-if="form.hint" label="提示选项">
          <el-checkbox-group v-model="form.hintOptions">
            <el-checkbox-button v-for="o in hintOptions" :label="o.label" :key="o.label" :disabled="o.label === 'phrase'">{{ o.text }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="form.hint" label="选重键">
          <el-input v-model="form.select"/>
          <span class="el-upload__tip">修改选重键需要重新上传码表文件</span>
        </el-form-item>
        <el-form-item v-if="form.hint" label="码表文件">
          <el-upload drag action="#"
            accept=".txt,.yaml,.yml"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="loadPhrase">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">文本格式文件，UTF8编码，多多格式，即`字  编码`，每行一条记录</div>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="form.hint" label="一码颜色">
          <el-color-picker v-model="form.code1"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="form.hint" label="二码颜色">
          <el-color-picker v-model="form.code2"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="form.hint" label="三码颜色">
          <el-color-picker v-model="form.code3"></el-color-picker>
        </el-form-item>
        <el-form-item v-if="form.hint" label="全码颜色">
          <el-color-picker v-model="form.code4"></el-color-picker>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="成绩设置">
        <el-form-item label="理论码长">
          <el-switch v-model="form.ideal"></el-switch>
        </el-form-item>
        <el-form-item label="文章字数">
          <el-switch v-model="form.length"></el-switch>
        </el-form-item>
        <el-form-item label="退格数量">
          <el-switch v-model="form.backspace"></el-switch>
        </el-form-item>
        <el-form-item label="回改数量">
          <el-switch v-model="form.replace"></el-switch>
        </el-form-item>
        <el-form-item label="击键数量">
          <el-switch v-model="form.keys"></el-switch>
        </el-form-item>
        <el-form-item label="选重数量">
          <el-switch v-model="form.selective"></el-switch>
        </el-form-item>
        <el-form-item label="选重率">
          <el-switch v-model="form.selectiveRate"></el-switch>
        </el-form-item>
        <el-form-item label="打词数量">
          <el-switch v-model="form.phrase"></el-switch>
        </el-form-item>
        <el-form-item label="打词率">
          <el-switch v-model="form.phraseRate"></el-switch>
        </el-form-item>
        <el-form-item label="键准">
          <el-switch v-model="form.accuracy"></el-switch>
        </el-form-item>
        <el-form-item label="键法">
          <el-switch v-model="form.balance"></el-switch>
        </el-form-item>
        <el-form-item label="重打次数">
          <el-switch v-model="form.retry"></el-switch>
        </el-form-item>
        <el-form-item label="版本号">
          <el-switch v-model="form.version"></el-switch>
        </el-form-item>
        <el-form-item label="输入法">
          <el-switch v-model="form.inputMethod"></el-switch>
          <el-input maxlength="10" v-if="form.inputMethod" v-model="form.inputMethodName"></el-input>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-switch v-model="form.signature"></el-switch>
          <el-input maxlength="20" v-if="form.signature" v-model="form.signatureText"></el-input>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="载文设置">
        <el-form-item label="去除空格">
          <el-switch v-model="form.replaceSpace"></el-switch>
        </el-form-item>
        <el-form-item label="替换符号">
          <el-switch v-model="form.replacePunctuation"></el-switch>
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TrieTree } from '../store/util/TrieTree'
import db from '../store/util/Database'
import punctuation from '../store/util/punctuation'
import { SettingState } from '../store/types'
import { namespace } from 'vuex-class'

const setting = namespace('setting')

@Component
export default class Setting extends Vue {
  private hintOptions = [
    { label: 'phrase', text: '词语' },
    { label: 'color', text: '颜色' },
    { label: 'select', text: '选重' },
    { label: 'code', text: '编码' }
  ]

  private form = new SettingState()

  @setting.State('loaded')
  private loaded!: boolean

  @setting.Getter('state')
  private setting!: SettingState

  @setting.Mutation('update')
  private updateSetting!: Function

  loadPhrase (file: { raw: File }): void {
    const reader = new FileReader()
    const alternatives = this.form.select
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
        this.$message({ message: '码表处理完成', type: 'success', showClose: true })
      })
    }

    reader.readAsText(file.raw)
  }

  submitForm (): void {
    db.configs.put(this.form).then(() => {
      this.$message({ message: '保存成功', type: 'success', showClose: true })
      this.updateSetting(this.form)
    })
  }

  @Watch('loaded')
  resetForm (): void {
    Object.assign(this.form, this.setting)
  }

  created (): void {
    this.resetForm()
  }
}
</script>

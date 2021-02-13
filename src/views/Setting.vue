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
            <el-checkbox-button v-for="o in hintOptions" :label="o.value" :key="o.value" :disabled="o.disabled">{{ o.text }}</el-checkbox-button>
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
        <el-form-item label="选项">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="form.resultOptions" @change="handleCheckedResultChange">
            <el-checkbox v-for="o in resultOptions" :label="o.value" :key="o.value" :disabled="o.disabled">{{ o.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="输入法">
          <el-switch v-model="form.inputMethod"></el-switch>
          <el-input maxlength="20" v-if="form.inputMethod" v-model="form.inputMethodName"></el-input>
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

const HINT_OPTIONS = [
  { value: 'phrase', text: '词语', disabled: true },
  { value: 'color', text: '颜色' },
  { value: 'select', text: '选重' },
  { value: 'code', text: '编码' }
]

const RESULT_OPTIONS = [
  { value: 'identity', text: '标识', disabled: true },
  { value: 'typeSpeed', text: '速度', disabled: true },
  { value: 'hitSpeed', text: '击键', disabled: true },
  { value: 'codeLength', text: '码长', disabled: true },
  { value: 'idealCodeLength', text: '理论码长' },
  { value: 'contentLength', text: '字数' },
  { value: 'usedTime', text: '用时' },
  { value: 'accuracy', text: '键准' },
  { value: 'balance', text: '键法' },
  { value: 'leftHand', text: '左' },
  { value: 'rightHand', text: '右' },
  { value: 'phrase', text: '打词' },
  { value: 'phraseRate', text: '打词率' },
  { value: 'selective', text: '选重' },
  { value: 'replace', text: '回改' },
  { value: 'keys', text: '键数' },
  { value: 'backspace', text: '退格' },
  { value: 'enter', text: '回车' },
  { value: 'retry', text: '重打' },
  { value: 'version', text: '版本' }
]

@Component
export default class Setting extends Vue {
  private hintOptions = HINT_OPTIONS

  private resultOptions = RESULT_OPTIONS

  private form = new SettingState()

  @setting.State('loaded')
  private loaded!: boolean

  @setting.Getter('state')
  private setting!: SettingState

  @setting.Mutation('update')
  private updateSetting!: Function

  private checkAll = false

  private isIndeterminate = true

  handleCheckAllChange (val: boolean) {
    this.form.resultOptions = val ? RESULT_OPTIONS.map(v => v.value) : ['identity', 'typeSpeed', 'hitSpeed', 'codeLength']
    this.isIndeterminate = !val
  }

  handleCheckedResultChange (value: string) {
    const checkedCount = value.length
    this.checkAll = checkedCount === this.resultOptions.length
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.resultOptions.length
  }

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

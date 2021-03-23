<template>
  <div id="practice">
    <el-container>
      <el-aside>
        <div id="indicator">
          <el-card class="time" shadow="never">
            <el-progress type="dashboard" :percentage="percentage" :width="200"/>
          </el-card>
          <el-card shadow="never">
            <el-row>
              <el-col :span="24" class="speed">
                66.66
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">5.00</span>
                  <span class="desc"><el-button type="text">击键</el-button></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">{{ current }}</span>
                  <span class="desc"><el-button type="text">已打</el-button></span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="hint-block">
                  <span class="number">{{ phrases.length }}</span>
                  <span class="desc"><el-button type="text">总数</el-button></span>
                </div>
              </el-col>
            </el-row>
          </el-card>
          <el-card class="code-hint" shadow="never">
            <div v-for="word in wordsHint" :key="word.text">
              <span type="info">{{ word.text }}：</span>
              <span v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</span>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-main>
        <el-row>
          <el-col :span="24" class="toolbar">
            <el-button-group>
              <el-button icon="el-icon-search" @click="drawer = true">抽取</el-button>
              <el-button icon="el-icon-refresh" @click="shuffleAndSave(true)">乱序</el-button>
              <el-button icon="el-icon-upload" @click="save">保存进度</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row class="stage">
          <el-col class="phrase active" :span="6" :offset="3" v-if="phrases.length > current">{{ this.option.phrases[current].text }}</el-col>
          <el-col class="phrase" :span="6" v-if="phrases.length > current + 1">{{ phrases[current + 1].text }}</el-col>
          <el-col class="phrase" :span="6" v-if="phrases.length > current + 2">{{ phrases[current + 2].text }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" :offset="9">
            <input class="el-input__inner" v-model="input" @input="checkInput" :placeholder="placeholder"/>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <el-drawer
      title="词库抽取"
      :visible.sync="drawer"
      :with-header="false">
      <el-form label-width="160px" label-suffix="：">
        <el-form-item label="编码长度">
          <div class="slider-container">
            <el-slider range v-model="option.codeRange" :max="4" :min="1" show-stops :format-tooltip="codeLengthFormatter"/>
          </div>
        </el-form-item>
        <el-form-item label="字词长度">
          <div class="slider-container">
            <el-slider range v-model="option.phraseRange" :max="20" :min="1" show-stops/>
          </div>
        </el-form-item>
        <el-form-item label="词条位置">
          <div class="slider-container">
            <el-slider range v-model="option.positionRange" :max="30" :min="1" show-stops/>
          </div>
        </el-form-item>
        <el-form-item label="乱序">
          <el-switch v-model="option.random"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="chooseFromCodings">确定</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Phrase, Word } from '@/store/types'
import { TrieNode } from '@/store/util/TrieTree'
import { Component, Vue } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'

const codeLengthText = ['一简', '二简', '三简', '全码']
const STORAGE_KEY = 'practice'
const setting = namespace('setting')

const shuffle = (array: Array<Phrase>) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex--)

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
}

class PracticeOption {
  // 一二简
  codeRange = [1, 2]
  phraseRange = [2, 10]
  positionRange = [1, 3]
  random = true
  phrases: Array<Phrase> = []
  current = 0
}

@Component
export default class Practice extends Vue {
  private option = new PracticeOption()

  @State('codings')
  private codings!: TrieNode

  @setting.Getter('getSelectChar')
  private getSelectChar!: Function

  private drawer = false

  private input = ''

  get percentage (): number {
    const { current, phrases } = this.option
    const total = phrases.length
    if (total < 1) {
      return 0
    }

    return parseFloat((current / total * 100).toFixed(2))
  }

  get phrases (): Array<Phrase> {
    return this.option.phrases
  }

  get current (): number {
    return this.option.current
  }

  get wordsHint (): Array<Word> {
    const { phrases, current } = this.option
    const phrase = phrases[current]
    if (!phrase) {
      return []
    }

    return [new Word(current, phrase.text, '', false, '', phrase.codings)]
  }

  get placeholder (): string {
    const { phrases, current } = this.option
    return phrases && phrases[current] && phrases[current].codings[0].code
  }

  chooseFromCodings () {
    if (this.codings) {
      this.option.phrases = []

      this.filter(this.codings)
      this.shuffleAndSave(this.option.random)
    }

    this.drawer = false
  }

  shuffleAndSave (random: boolean) {
    const { phrases } = this.option

    this.option.current = -1
    this.input = ''

    if (random) {
      shuffle(phrases)
    }

    this.option.current = 0
    this.save()
  }

  save () {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.option))
  }

  codeLengthFormatter (value: number): string {
    return codeLengthText[value - 1]
  }

  checkCodeLength (length: number) {
    const [min, max] = this.option.codeRange
    return length >= min && length <= max
  }

  checkTextLength (length: number) {
    const [min, max] = this.option.phraseRange
    return length >= min && length <= max
  }

  checkTextUnicode (text: string) {
    const unicode = text.charCodeAt(0)
    return unicode >= 0x4E00 && unicode <= 0x9FEF
  }

  checkPosition (position: number) {
    const [min, max] = this.option.positionRange
    return position >= min && position <= max
  }

  filter (node: TrieNode) {
    const { value, children } = node
    if (value) {
      const { text, codings } = value
      if (this.checkTextUnicode(text) && this.checkTextLength(text.length)) {
        const matched = codings.slice()
          .filter(v => this.checkCodeLength(v.code.length) && this.checkPosition(v.index + 1))
          .sort((a, b) => a.code.length - b.code.length)
        if (matched.length > 0) {
          this.option.phrases.push(value)
        }
      }
    }
    if (children) {
      children.forEach(v => this.filter(v))
    }
  }

  checkInput () {
    const { phrases, current, random } = this.option
    if (phrases[current].text === this.input) {
      this.input = ''
      this.option.current++
    }

    if (current === phrases.length) {
      this.shuffleAndSave(random)
    }
  }

  mounted () {
    const json = localStorage.getItem(STORAGE_KEY)
    if (json) {
      this.option = JSON.parse(json)
    }
  }

  beforeDestroy () {
    this.save()
  }
}
</script>
<style lang="scss">
#practice {
  .toolbar {
    text-align: right;
  }

  .slider-container {
    padding-right: 10px;
  }
  .stage {
    font-size: 4rem;
    color: #dfdfdf;
    margin: 10rem auto;
    .phrase {
      border-right: 1px dashed #ccc;
      text-align: center;
      height: 20rem;
      span {
        transform: translateY(50%);
      }
      &.active {
        color: var(--normal-color);
      }
      &:last-child {
        border: none;
      }
    }
  }
  .el-input__inner {
    margin-bottom: 1rem;
    height: 5rem;
    font-size: 4rem;
    color: var(--normal-color);
    width: 40rem;
    margin-left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }
}
</style>

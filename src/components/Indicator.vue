<template>
  <div class="indicator">
    <el-card class="time">
      <el-progress type="dashboard" :percentage="percentage" :width="200" :status="progressStatus"/>
      <span>{{ passTime }}</span>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24" class="speed">
          {{ typeSpeed }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <div class="hint-block">
            <span class="number">{{ hitSpeed }}</span>
            <span class="desc"><el-button type="text">击键</el-button></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="hint-block">
            <span class="number">{{ codeLength }}</span>
            <span class="desc"><el-button type="text" @click="showInputKeys">码长</el-button></span>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="hint-block">
            <span class="number">{{ idealCodeLength }}</span>
            <span class="desc"><el-button type="text" @click="showIdealCodes">理想</el-button></span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="status === 'init' || status === 'typing'">
      <dl class="code-hint" v-for="word in wordsHint" :key="word.text">
        <dt><el-tag>{{ word.text }}</el-tag></dt>
        <dd v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</dd>
      </dl>
    </el-card>
    <el-card>
      <div class="key-value">
        <span>退格</span>
        <span>{{ backspace }}</span>
      </div>
      <div class="key-value">
        <span>回车</span>
        <span>{{ enter }}</span>
      </div>
      <div class="key-value">
        <span>回改</span>
        <span>{{ replace }}</span>
      </div>
      <div class="key-value">
        <span>打词</span>
        <span>{{ phrase }}</span>
      </div>
      <div class="key-value">
        <span>选重</span>
        <span>{{ selective }}</span>
      </div>
      <div class="key-value">
        <span>均横</span>
        <span>{{ leftHand }}/{{ rightHand }}</span>
      </div>
    </el-card>
    <el-card>
      <div class="key-value">
        <span>词提</span>
        <span>
          <el-switch v-model="tempHint" @change="toggleHint(tempHint)"/>
        </span>
      </div>
      <div class="key-value">
        <span>替换空格</span>
        <span>
          <el-switch v-model="tempReplaceSpace" @change="toggleReplaceSpace(tempReplaceSpace)"/>
        </span>
      </div>
    </el-card>

    <el-drawer
      :title="drawer.title"
      :visible.sync="drawerVisiable"
      :with-header="false"
      size="100"
      direction="ttb">
      <p class="codes">{{ drawer.text }}</p>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { keyboard } from '@/store/util/keyboard'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')
const setting = namespace('setting')

@Component
export default class Indicator extends Vue {
  @racing.State('status')
  private status!: string

  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.Getter('idealCodeLength')
  private idealCodeLength!: string

  @racing.Getter('hint')
  private wordsHint!: Array<string>

  @racing.Getter('passTime')
  private passTime!: string

  @racing.State('phrase')
  private phrase!: number

  @racing.State('selective')
  private selective!: number

  @racing.Getter('enterCount')
  private enter!: number

  @racing.Getter('backspaceCount')
  private backspace!: string

  @racing.State('keyCount')
  private keyCount!: Map<string, number>

  @racing.State('replace')
  private replace!: number

  @racing.Getter('leftHand')
  private leftHand!: number

  @racing.Getter('rightHand')
  private rightHand!: number

  @racing.Getter('progress')
  private progress!: number

  @racing.State('keys')
  private keys!: Array<string>

  @racing.State('idealKeys')
  private idealKeys!: string

  @setting.Getter('hint')
  private hint!: boolean

  @setting.Getter('replaceSpace')
  private replaceSpace!: boolean

  @setting.Getter('getSelectChar')
  private getSelectChar!: Function

  @setting.Mutation('toggleHint')
  private toggleHint!: Function

  @setting.Mutation('toggleReplaceSpace')
  private toggleReplaceSpace!: Function

  private tempHint = false

  private tempReplaceSpace = false

  private drawerVisiable = false

  private drawer = { title: '', text: '' }

  get percentage (): number {
    const percentage = Math.min(this.progress || 0, 1) * 100
    return parseFloat(percentage.toFixed(2))
  }

  get progressStatus (): string | null {
    return this.status === 'finished' ? 'success' : null
  }

  get version (): string | undefined {
    return process.env.VUE_APP_VERSION
  }

  @Watch('hint')
  hintChange (hint: boolean) {
    if (this.tempHint !== hint) {
      this.tempHint = hint
    }
  }

  @Watch('replaceSpace')
  replaceSpaceChange (replaceSpace: boolean) {
    if (this.tempReplaceSpace !== replaceSpace) {
      this.tempReplaceSpace = replaceSpace
    }
  }

  showIdealCodes () {
    Object.assign(this.drawer, {
      title: '输入编码',
      text: this.idealKeys
    })
    this.drawerVisiable = true
  }

  showInputKeys () {
    Object.assign(this.drawer, {
      title: '输入编码',
      text: this.keys.map(v => keyboard.get(v)).map(v => (v && v.key) || '❓').join('')
    })
    this.drawerVisiable = true
  }

  created () {
    this.hintChange(this.hint)
    this.replaceSpaceChange(this.replaceSpace)
  }
}
</script>

<style lang="scss" scoped>
.indicator {
  padding: 5px 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  .el-card {
    color: #909399;
    margin-bottom: 1rem;
    text-align: center;
  }

  .time {
    font-family: 'Digital7 mono';
    font-size: 3rem;
    text-align: center;
    padding-top: 20px;

    span {
      position: relative;
      left: 70px;
      top: -50px;
      float: left;
    }
  }

  .speed {
    font-family: 'Digital7 mono';
    font-size: 4rem;
    text-align: center;
    border-bottom: 1px dashed #E4E7ED;
    padding: 1rem;
  }

  .hint-block {
    text-align: center;
    // font-family: 'Digital7 mono';
    padding-top: 1rem;

    span.number {
      font-size: 1.5rem;
      display: block;
      color: #909399;
    }
    span.desc {
      font-size: 12px;
      color: #C0C4CC;
    }
    .el-button {
      padding: 2px 0;
      font-size: 1rem;
    }
  }

  .code-hint {
    text-align: left;
    dd {
      font-size: 1.2rem;
      letter-spacing: 0.1rem;
      margin-left: 1rem;
    }
    dd::before {
      content: '-';
      color: #DCDFE6;
    }
  }

  .key-value {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: .5rem auto;
    span {
      z-index: 10;
      background-color: white;
    }

    span:first-child {
      padding-right: .5rem;
    }
    span:last-child {
      padding-left: .5rem;
    }
  }
  .key-value::before {
    z-index: 1;
    content: '';
    border-bottom: 1px dashed #E4E7ED;
    position: absolute;
    top: 50%;
    width: 100%;
  }
  .codes {
    font-size: 2rem;
    word-break: break-all;
    letter-spacing: .5rem;
    overflow: auto;
    padding: 1rem;
    color: #909399;
    min-height: 100px;
    max-height: 200px;
  }
}
</style>

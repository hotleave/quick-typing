<template>
  <div id="indicator">
    <el-card class="time" shadow="never">
      <el-progress type="dashboard" :percentage="percentage" :width="200" :status="progressStatus"/>
      <span>{{ passTime }}</span>
    </el-card>
    <el-card shadow="never">
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
    <el-card class="code-hint" v-if="status !== 'waiting' && status !== 'finished'" shadow="never">
      <div v-for="word in wordsHint" :key="word.text">
        <span type="info">{{ word.text }}：</span>
        <span v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</span>
      </div>
    </el-card>
    <el-card shadow="never">
      <div class="key-value">
        <span>字数</span>
        <span>{{ todayWords }} / {{ totalWords }}</span>
      </div>
      <div class="key-value">
        <span>天数</span>
        <span>{{ consecutiveDays }} / {{ totalDays }}</span>
      </div>
      <div class="key-value">
        <span>退格</span>
        <span>{{ backspace }}</span>
      </div>
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
    <el-card shadow="never">
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
    <el-card class="contribute" shadow="never">
      <p><i class="el-icon-info"/><a href="https://gitee.com/hotleave/quick-typing/issues">提Issue</a></p>
      <p><i class="el-icon-chat-dot-round"/><a href="tencent://Message/?Uin=81493192&websiteName=hotleave.gitee.io&Menu=yes">或QQ联系我</a></p>
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
const summary = namespace('summary')

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

  @summary.Getter('todayWords')
  private todayWords!: number

  @summary.Getter('totalWords')
  private totalWords!: string

  @summary.Getter('consecutiveDays')
  private consecutiveDays!: number

  @summary.Getter('totalDays')
  private totalDays!: number

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

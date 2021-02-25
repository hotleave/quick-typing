<template>
  <div class="indicator">
    <el-card class="time">
      <el-progress type="dashboard" :percentage="percentage" :width="200"/>
      <div>{{ passTime }}</div>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24" class="speed">
          {{ typeSpeed }}
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <div class="hint-block">
            <span class="number">{{ backspace }}</span>
            <span class="desc">退格</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="hint-block">
            <span class="number">{{ hitSpeed }}</span>
            <span class="desc">击键</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="hint-block">
            <span class="number">{{ codeLength }}</span>
            <span class="desc">码长</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="hint-block">
            <span class="number">{{ idealCodeLength }}</span>
            <span class="desc">理想</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card v-if="status === 'init' || status === 'typing'">
      <dl class="code-hint" v-for="word in hint" :key="word.text">
        <dt><el-tag>{{ word.text }}</el-tag></dt>
        <dd v-for="coding in word.codings" :key="coding.code">{{ coding.code + getSelectChar(coding.index, coding.length) }}</dd>
      </dl>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')
const setting = namespace('setting')

@Component
export default class Indicator extends Vue {
  @racing.State('status')
  private status!: string

  @racing.State('backspace')
  private backspace!: string

  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.Getter('idealCodeLength')
  private idealCodeLength!: string

  @racing.Getter('hint')
  private hint!: Array<string>

  @racing.Getter('passTime')
  private passTime!: string

  @setting.Getter('getSelectChar')
  private getSelectChar!: Function

  @racing.Getter('progress')
  private progress!: number

  get percentage (): number {
    return parseFloat(((this.progress || 0) * 100).toFixed(2))
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
}
</style>

<template>
  <el-form class="indicator" :inline="true" label-suffix=":">
    <el-card>
      <p class="code-hint">{{ hint }}</p>
    </el-card>
    <el-card>
      <span class="time">{{ passTime }}</span>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span="24" class="speed">
          {{ typeSpeed }}
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="8">
          <el-tag type="info">{{ status }}</el-tag>
        </el-col> -->
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
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')

@Component
export default class Indicator extends Vue {
  @racing.State('backspace')
  private backspace!: string

  @racing.Getter('statusText')
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
  private hint!: string

  @racing.Getter('passTime')
  private passTime!: string
}
</script>

<style lang="scss" scoped>
.indicator {
  padding: 5px 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  color: #303133;

  .el-form-item {
    margin-bottom: auto;
  }

  .code-hint {
    font-size: 2rem;
    text-align: center;
  }

  .time {
    font-family: 'Digital7 mono';
    font-size: 3rem;
  }

  .speed {
    font-family: 'Digital7 mono';
    font-size: 3rem;
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
      color: #606266;
    }
    span.desc {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>

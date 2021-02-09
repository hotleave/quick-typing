<template>
  <el-form class="indicator" :inline="true" label-suffix=":">
    <el-form-item label="状态">
      <el-tag type="info">{{ status }}</el-tag>
    </el-form-item>
    <el-form-item label="速度">
      <el-tag type="info">{{ typeSpeed }}</el-tag>
    </el-form-item>
    <el-form-item label="击键">
      <el-tag type="info">{{ hitSpeed }}</el-tag>
    </el-form-item>
    <el-form-item label="码长">
      <el-tag type="info">{{ codeLength }}</el-tag>
    </el-form-item>
    <el-form-item label="理论码长">
      <el-tag type="info">{{ idealCodeLength }}</el-tag>
    </el-form-item>
    <el-form-item label="编码提示">
      <el-tag type="info">{{ hint }}</el-tag>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')

@Component
export default class Indicator extends Vue {
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
}
</script>

<style lang="scss" scoped>
.indicator {
  padding: 5px 15px;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;

  .el-form-item {
    margin-bottom: auto;
  }
}
</style>

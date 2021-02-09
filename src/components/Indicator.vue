<template>
  <el-form :inline="true" label-suffix=":">
    <el-form-item label="状态">
      <el-tag>{{ status }}</el-tag>
    </el-form-item>
    <el-form-item label="速度">
      <el-tag>{{ typeSpeed }}</el-tag>
    </el-form-item>
    <el-form-item label="击键">
      <el-tag>{{ hitSpeed }}</el-tag>
    </el-form-item>
    <el-form-item label="码长">
      <el-tag>{{ codeLength }}</el-tag>
    </el-form-item>
    <el-form-item label="理论码长">
      <el-tag>{{ idealCodeLength }}</el-tag>
    </el-form-item>
    <el-form-item label="编码提示">
      <el-tag>{{ hint }}</el-tag>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')

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
  private hint!: string
}
</script>

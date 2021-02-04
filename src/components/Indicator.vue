<template>
  <div class="indicator">
    <label>速度：<span>{{ typeSpeed }}</span></label>
    <label>击键：<span>{{ hitSpeed }}</span></label>
    <label>码长：<span>{{ codeLength }}</span></label>
    <label>理论码长：<span>{{ idealCodeLength }}</span></label>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'

const racing = namespace('racing')

@Component
export default class Indicator extends Vue {
  @racing.Getter('typeSpeed')
  private typeSpeed!: string

  @racing.Getter('hitSpeed')
  private hitSpeed!: string

  @racing.Getter('codeLength')
  private codeLength!: string

  @racing.Getter('idealCodeLength')
  private idealCodeLength!: string
}
</script>

<style lang="scss" scoped>
.indicator {
  width: 100%;
  padding: .5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: .5rem;
  color: #999;

  label {
    font-size: 1.5rem;
    margin-right: 1rem;
    padding: .5rem;

    span {
      color: #f66;
    }
  }
}
</style>

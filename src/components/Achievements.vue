<template>
  <div>
    <el-table :data="achievements" stripe="stripe" style="width:100%;">
      <el-table-column prop="title" type="expand" label="标题">
        <template slot-scope="props">
          第{{ props.row.identity }}段 速度{{ props.row.typeSpeed }} 击键{{ props.row.hitSpeed }} 码长{{ props.row.codeLength }} 字数{{ props.row.contentLength }} 错字{{ props.row.error }}
          用时{{ formatTime(props.row.usedTime) }}秒 暂停{{ props.row.pauseCount }}次{{ formatTime(props.row.pauseTime) }}秒 键准{{ props.row.accuracy }}% 键法{{ props.row.balance }}% 左{{ props.row.leftHand }}
          右{{ props.row.rightHand }} 理论码长{{ props.row.idealCodeLength }} 打词{{ props.row.phrase }} 打词率{{ props.row.phraseRate }}% 选重{{ props.row.selective }} 回改{{ props.row.replace }}
          键数{{ props.row.keys }} 退格{{ props.row.backspace }} 回车{{ props.row.enter }} 第{{ props.row.retry }}次跟打
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" :formatter="titleFormatter"/>
      <el-table-column prop="typeSpeed" label="速度" width="80"/>
      <el-table-column prop="hitSpeed" label="击键" width="60"/>
      <el-table-column prop="codeLength" label="码长" width="60"/>
      <el-table-column prop="idealCodeLength" label="理想" width="60"/>
      <el-table-column prop="finishedTime" label="结束时间" :formatter="timeFormatter" width="180"/>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Achievement } from '@/store/types'
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class Achievements extends Vue {
  @State('achievements')
  private achievements!: Array<Achievement>

  titleFormatter (row: Achievement, column: number, value: number) {
    return value || '未知'
  }

  timeFormatter (row: Achievement, column: number, value: number) {
    return new Date(value).toLocaleString()
  }

  formatTime (total: number, mill = 3): string {
    total = total / 1000
    if (total < 60) {
      return `${total.toFixed(mill)}`
    }

    const seconds = total % 60
    const minutes = (total - seconds) / 60
    return `${minutes.toFixed(0)}:${seconds.toFixed(mill)}`
  }
}
</script>

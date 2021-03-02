<template>
  <div class="summary">
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="keyboard"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <div id="balance-chart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div id="rows-chart"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div id="fingers-chart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import h337 from 'heatmap.js'
import { keyboard } from '@/store/util/keyboard'
import { LooseObject } from '@/store/types'
import { State } from 'vuex-class'

import * as echarts from 'echarts/core'
import { BarChart, BarSeriesOption, PieChart, PieSeriesOption } from 'echarts/charts'
import { TitleComponent, TitleComponentOption, TooltipComponent, TooltipComponentOption, GridComponent, GridComponentOption } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

type ECOption = echarts.ComposeOption<BarSeriesOption | PieSeriesOption | TitleComponentOption | GridComponentOption | TooltipComponentOption>
echarts.use([TitleComponent, TooltipComponent, GridComponent, BarChart, PieChart, CanvasRenderer])

type DataPoints = Array<{ x: number; y: number; value: number }>

type StatisticData = {
  hands: Array<number>;
  fingers: Array<number>;
  rows: Array<number>;
}

interface HeatmapData {
  min: number;
  max: number;
  data: DataPoints;
}

const getHeatmapData = (keyCount: LooseObject<number>): HeatmapData => {
  const min = 0
  let max = 0
  const data: DataPoints = []
  for (const key in keyCount) {
    if (key === 'Space') {
      continue
    }

    const node = keyboard.get(key)
    if (node && node.coord) {
      const [x, y] = node.coord
      const value = keyCount[key]
      if (max < value) {
        max = value
      }
      data.push({ x, y, value })
    }
  }

  return { min, max, data }
}

@Component
export default class Summary extends Vue {
  @State('overallKeyCount')
  private keyCount!: LooseObject<number>

  get statisticData (): StatisticData {
    const hands = [0, 0]
    const rows: Array<number> = [0, 0, 0, 0, 0, 0]
    const fingers: Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    for (const key in this.keyCount) {
      const node = keyboard.get(key)
      if (!node) {
        continue
      }

      const { finger, row } = node
      const value = this.keyCount[key]
      rows[row] += value
      fingers[finger] += value
      if (finger <= 3) {
        hands[0] += value
      } else if (finger >= 4 && finger <= 7) {
        hands[1] += value
      }
    }

    return { hands, rows, fingers }
  }

  mounted () {
    const { hands, rows, fingers } = this.statisticData
    fingers.splice(8, 1)
    console.log(rows)

    const config = {
      container: document.getElementById('keyboard')
    }
    const heatmap = h337.create(config)
    const data = getHeatmapData(this.keyCount)
    heatmap.setData(data)

    const balanceOption: ECOption = {
      series: [
        {
          type: 'pie',
          data: [
            { name: '左手', value: hands[0] },
            { name: '左手', value: hands[1] }
          ]
        }
      ]
    }
    const balanceChart = echarts.init(document.getElementById('balance-chart') as HTMLElement)
    balanceChart.setOption(balanceOption)

    const rowsOption: ECOption = {
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['下排', '中排', '上排', '数字']
      },
      series: [
        {
          type: 'bar',
          data: rows.slice(1, 5).reverse()
        }
      ]
    }
    const rowsChart = echarts.init(document.getElementById('rows-chart') as HTMLElement)
    rowsChart.setOption(rowsOption)

    const fingersOption: ECOption = {
      xAxis: {
        type: 'category',
        data: ['小指', '无名指', '中指', '食指', '拇指', '食指', '中指', '无名指', '小指']
      },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: fingers
        }
      ]
    }
    const fingersChart = echarts.init(document.getElementById('fingers-chart') as HTMLElement)
    fingersChart.setOption(fingersOption)
  }
}
</script>

<style lang="scss" scoped>
.summary .el-row {
  margin: 2rem auto;
}

#keyboard {
  background-image: url(/img/layouts/QWERTY.png);
  width: 800px;
  height: 373px;
  margin: auto;
}

#balance-chart {
  width: 100%;
  height: 200px;
}

#rows-chart {
  width: 100%;
  height: 200px;
}

#fingers-chart {
  width: 100%;
  height: 300px;
}
</style>

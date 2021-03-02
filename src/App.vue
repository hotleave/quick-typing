<template>
  <el-container id="app">
    <el-header>
      <el-menu
        :router="true"
        :default-active="pathname"
        active-text-color="#409EFF"
        mode="horizontal">
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">主界面</span>
        </el-menu-item>
        <el-menu-item index="/setting">
          <i class="el-icon-setting"></i>
          <span slot="title">设置</span>
        </el-menu-item>
        <el-menu-item index="/summary">
          <i class="el-icon-s-data"></i>
          <span slot="title">统计</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <i class="el-icon-question"></i>
          <span slot="title">关于</span>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TrieNode } from './store/util/TrieTree'
import db from './store/util/Database'
import { Action, namespace } from 'vuex-class'
import { LooseObject } from './store/types'

const setting = namespace('setting')

@Component
export default class Setting extends Vue {
  @Action('updateCodings')
  private updateCodings!: Function

  @Action('summaryKeyCount')
  private summaryKeyCount!: Function

  @setting.Action('load')
  private loadSetting!: Function

  private pathname = location.pathname

  created () {
    // 读取配置
    db.configs.get('setting').then(setting => {
      if (setting) {
        this.loadSetting(setting)
        console.log('Settings loaded')
      }
    })
    // 读取数据库中的码表
    db.configs.get('codings').then(root => {
      if (root) {
        const node = TrieNode.convert(root)
        this.updateCodings(node)
        console.log('Trie tree loaded')
      }
    })
    // 读取按键统计信息
    db.summary.get('keyCount').then(keyCount => {
      if (keyCount) {
        delete keyCount.id
        this.summaryKeyCount(keyCount as LooseObject<number>)
        console.log('Key count summary loaded')
      }
    })
  }
}
</script>

<style lang="scss">
:root {
  font-size: 12px;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}

@font-face {
  font-family: "Digital7 mono";
  src: url("/font/digital-7-mono.ttf") format("truetype");
}

html,body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  height: 100%;
}

.main {
  padding-top: 0;
}

.middle {
  margin: 2rem auto;
}

.toolbar {
  text-align: right;
  padding: 1rem;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div id="app">
    <el-container>
      <el-header>
        <el-menu
          :router="true"
          :default-active="pathname"
          mode="horizontal">
          <el-menu-item index="/">
            <i class="el-icon-s-home"></i>
            <span slot="title">主界面</span>
          </el-menu-item>
          <el-menu-item index="/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TrieNode } from './store/util/TrieTree'
import db from './store/util/Database'
import { Action, namespace } from 'vuex-class'

const setting = namespace('setting')

@Component
export default class Setting extends Vue {
  @Action('updateCodings')
  private updateCodings!: Function

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
  }
}
</script>

<style lang="scss">
:root {
  font-size: 16px;
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

#app{
  width: 100%;
  height: 100%;
}
</style>

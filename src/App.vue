<template>
  <div id="app">
    <el-container>
      <el-aside width="64px">
        <el-avatar size="large" class="logo" :src="require('@/assets/logo.png')"/>
        <el-menu
          :router="true"
          :collapse="true"
          :default-active="pathname"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">主界面</span>
          </el-menu-item>
          <el-menu-item index="/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main><router-view/></el-main>
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
}
html,body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #545c64;
  color: #FFFFFF;
}
.logo {
  margin: 5px 12px;
}

#app{
  width: 100%;
  height: 100%;
}
</style>

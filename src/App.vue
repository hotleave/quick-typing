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
        <el-menu-item index="/changelog">
          <i class="el-icon-time"></i>
          <span slot="title">版本历史</span>
        </el-menu-item>
        <el-menu-item index="/about">
          <i class="el-icon-question"></i>
          <span slot="title">关于</span>
        </el-menu-item>
      </el-menu>
      <div class="profile">
        <el-button v-if="!authenticated" type="text" @click="loginFormVisible = true">登录</el-button>
        <el-dialog title="用户登录" :visible.sync="loginFormVisible">
          <el-form :model="auth" label-width="80">
            <el-form-item label="用户名">
              <el-input v-model="auth.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="auth.password" autocomplete="off" show-password></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="loginFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="doLogin">确 定</el-button>
          </div>
        </el-dialog>
        <el-dropdown v-if="authenticated">
          <el-avatar :size="30" :src="loginUser.avatar"></el-avatar>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-lock" @click.native="doLogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
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
import { LoginUser, LooseObject } from './store/types'
import xcapi from './api/xc.cool'

const setting = namespace('setting')
const login = namespace('login')

@Component
export default class Setting extends Vue {
  @Action('updateCodings')
  private updateCodings!: Function

  @Action('summaryKeyCount')
  private summaryKeyCount!: Function

  @setting.Action('load')
  private loadSetting!: Function

  private pathname = location.pathname

  private loginFormVisible = false

  @login.State('user')
  private loginUser!: LoginUser | null

  @login.State('authenticated')
  private authenticated!: boolean

  @login.Action('login')
  private login!: Function

  @login.Action('logout')
  private logout!: Function

  private auth = {
    username: '',
    password: ''
  }

  doLogin () {
    xcapi.login(this.auth).then(data => {
      const { token, user } = data
      localStorage.token = token
      localStorage.user = JSON.stringify(user)

      this.login(data)
      this.loginFormVisible = false
    }, error => {
      this.$message.error(error.message)
    })
  }

  doLogout () {
    xcapi.logout().then(() => {
      this.logout()
      this.$message.success('注销成功')
    }, error => {
      this.$message.error(error.message)
    })
  }

  created () {
    if (localStorage.user && localStorage.token) {
      const { token, user } = localStorage
      this.login({ token, user: JSON.parse(user) })
    }

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

#groups {
  text-align: left;
}

.profile {
  position: absolute;
  right: 1rem;
  top: 1rem;
}
</style>

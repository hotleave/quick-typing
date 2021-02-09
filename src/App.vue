<template>
  <div id="app">
    <el-container>
      <el-aside width="64px">
        <el-menu
          :router="true"
          :collapse="true"
          default-active="/"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">主界面</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <i class="el-icon-setting"></i>
            <span slot="title">设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </div>
</template>

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

#app{
  width: 100%;
  height: 100%;
}
</style>

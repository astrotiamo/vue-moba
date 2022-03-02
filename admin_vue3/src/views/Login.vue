<template>
  <el-card header="请先登录" class="login-card">
    <el-form @submit.prevent="login" label-position="top">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="model.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="model.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getCurrentInstance, reactive } from 'vue'
export default {
  name: "Login",
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let model = reactive({
      username: '',
      password: ''
    })

    const login = async() => {
      const res = await app.$http.post('login', model)
      // console.log(res.data);
      // 关闭页面后token消失
      // sessionStorage.token = res.data.token
      // 关闭页面后token仍存在
      localStorage.token = res.data.token
      app.$router.push('/')
      app.$message({
        message: '登录成功',
        type: 'success'
      })
    }
    return {
      appContext,
      app,
      model,
      login
    }
  }
}
</script>

<style>
  .login-card {
    width: 25rem;
    margin: 10rem auto;
  }
</style>
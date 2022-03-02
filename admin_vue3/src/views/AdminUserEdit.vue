<template>
  <h1>{{id ? '编辑' : '新建'}}管理员</h1>
  <!-- @submit-native-prevent="save" -->
  <el-form label-width="120px"> 
    <el-form-item label="用户名">
      <el-input v-model="adminUserModel.username"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input type="text" v-model="adminUserModel.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
export default {
  name: "AdminUserEdit",
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let id = ref(app.$route.params.id)

    let adminUserModel = reactive({})

    id.value && fetch()

    async function save() {
      if(id.value) {
        // 编辑
        await app.$http.put(`rest/admin_users/${id.value}`, adminUserModel)
      } else {
        // 新建
        await app.$http.post('rest/admin_users', adminUserModel)
      }
      app.$router.push('/admin_users/list')
      app.$message.success('保存成功！')
    }

    async function fetch() {
      const res = await app.$http.get(`rest/admin_users/${id.value}`)
      // adminUserModel = res.data
      Object.keys(res.data).forEach(key => {
        adminUserModel[key] = res.data[key]
      })
    }

    return {
      app,
      id,
      adminUserModel,
      save,
      fetch
    }
  }
}
</script>

<style>

</style>
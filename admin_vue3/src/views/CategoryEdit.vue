<template>
  <h1>{{id ? '编辑' : '新建'}}分类</h1>
  <!-- @submit-native-prevent="save" -->
  <el-form label-width="120px"> 
    <el-form-item label="上级分类">
      <el-select v-model="categoryModel.parent">
        <el-option v-for="item in parents" :key="item._id" :value="item._id" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称">
      <el-input v-model="categoryModel.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
export default {
  name: "CategoryEdit",
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let id = ref(app.$route.params.id)

    let categoryModel = reactive({})
    let parents = reactive([])

    id.value && fetch()
    fetchParents()

    async function save() {
      if(id.value) {
        // 编辑
        await app.$http.put(`rest/categories/${id.value}`, categoryModel)
      } else {
        // 新建
        await app.$http.post('rest/categories', categoryModel)
      }
      app.$router.push('/categories/list')
      app.$message.success('保存成功！')
    }

    async function fetch() {
      const res = await app.$http.get(`rest/categories/${id.value}`)
      Object.keys(res.data).forEach(key => {
        categoryModel[key] = res.data[key]
      })
    }

    async function fetchParents() {
      const res = await app.$http.get(`rest/categories`)
      res.data.forEach(item => {
        parents.push(item)
      })
    }

    return {
      app,
      id,
      categoryModel,
      parents,
      save,
      fetch
    }
  }
}
</script>

<style>

</style>
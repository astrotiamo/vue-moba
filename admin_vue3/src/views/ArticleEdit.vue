<template>
  <h1>{{id ? '编辑' : '新建'}}文章</h1>
  <!-- @submit-native-prevent="save" -->
  <el-form label-width="120px"> 
    <el-form-item label="所属分类">
      <el-select v-model="articleModel.categories" multiple>
        <el-option v-for="item in cate" :key="item._id" :value="item._id" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="articleModel.title"></el-input>
    </el-form-item>
    <el-form-item label="详情">
      <vue-editor 
        v-model="articleModel.body" 
        useCustomImageHandler 
        @image-added="handleImageAdded">
      </vue-editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCurrentInstance, ref, reactive } from 'vue'
import { VueEditor } from 'vue3-editor'
export default {
  name: "ArticleEdit",
  components: {
    VueEditor
  },
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let id = ref(app.$route.params.id)
    let articleModel = reactive({}) 
    let categories = reactive([])
    let cate = reactive([])

    id.value && fetch()
    fetchCategories()

    function type() {
      categories.forEach(item => {
        if(item.parent) {
          if(item.parent.name == "新闻分类"){
            cate.push(item)
          }
        }
      })
    }

    async function save() {
      if(id.value) {
        await app.$http.put(`rest/articles/${id.value}`, articleModel)
      } else {
        await app.$http.post('rest/articles', articleModel)
      }
      app.$router.push('/articles/list')
      app.$message.success('保存成功！')
    }

    async function fetch() {
      const res = await app.$http.get(`rest/articles/${id.value}`)
      // articleModel = res.data
      Object.keys(res.data).forEach(key => {
        articleModel[key] = res.data[key]
      })
    }

    async function fetchCategories() {
      const res = await app.$http.get(`rest/categories`)
      categories = res.data
      type()
    }

    async function handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // An example of using FormData
      // NOTE: Your key could be different such as:
      // formData.append('file', file)

      const formData = new FormData();
      formData.append("file", file);

      const res = await app.$http.post('upload', formData)
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();

      // axios({
      //   url: "https://fakeapi.yoursite.com/images",
      //   method: "POST",
      //   data: formData
      // }).then(result => {
      //     const url = result.data.url; // Get url from response
      //     Editor.insertEmbed(cursorLocation, "image", url);
      //     resetUploader();
      // }).catch(err => {
      //     console.log(err);
      // });
    }

    return {
      id,
      articleModel,
      categories,
      cate,
      type,
      save,
      fetch,
      fetchCategories,
      handleImageAdded
    }
  }
}
</script>

<style>

</style>
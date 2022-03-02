<template>
  <h1>{{id ? '编辑' : '新建'}}广告位</h1>
  <!-- @submit-native-prevent="save" -->
  <el-form label-width="120px">
    <el-form-item label="名称">
      <el-input v-model="adModel.name"></el-input>
    </el-form-item>
    <el-form-item label="广告">
      <el-button size="small" @click="adModel.items.push({})">
        <el-icon><plus /></el-icon>添加广告
      </el-button>
      <el-row type="flex" style="flex-wrap: wrap;">
        <el-col :md="24" v-for="(item, index) in adModel.items" :key="index">
          <el-form-item label="跳转链接(URL)">
            <el-input v-model="item.url"></el-input>
          </el-form-item>
          <el-form-item label="图片" style="margin-top: 0.5rem;">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :headers="getAuthHeaders()"
              :on-success="res => $set(item, 'image', res.url)"
            >
              <img v-if="item.image" :src="item.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="danger" @click="adModel.items.splice(index, 1)">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue' // eslint-disable-line no-unused-vars
export default {
  name: "AdEdit",
  components: {
    plus: Plus
  },
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let id = ref(app.$route.params.id)

    let adModel = reactive({
      items: []
    })

    id.value && fetch();

    async function save() {
      if (id.value) {
        // 编辑
        await app.$http.put(`rest/ads/${this.id}`, adModel);
      } else {
        // 新建
        await app.$http.post("rest/ads", adModel);
      }
      app.$router.push("/ads/list");
      app.$message.success("保存成功！");
    }

    async function fetch() {
      const res = await app.$http.get(`rest/ads/${id.value}`)
      // adModel = Object.assign({}, adModel, res.data);
      Object.keys(res.data).forEach(key => {
        adModel[key] = res.data[key]
      })
    }

    return {
      app,
      id,
      adModel,
      save,
      fetch
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.avatar {
  /* width: 178px;
  height: 178px; */
  display: block;
}
</style>
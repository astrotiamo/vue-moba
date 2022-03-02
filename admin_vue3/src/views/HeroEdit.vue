<template>
  <h1>{{id ? '编辑' : '新建'}}英雄</h1>
  <!-- @submit-native-prevent="save" -->
  <el-form label-width="120px"> 
    <!-- <el-form-item label="上级分类">
      <el-select v-model="model.parent">
        <el-option v-for="item in parents" :key="item._id" :value="item._id" :label="item.name"></el-option>
      </el-select>
    </el-form-item> -->
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="基础信息" name="basic">
        <el-form-item label="名称">
          <el-input v-model="model.name"></el-input>
        </el-form-item>
        <el-form-item label="称号">
          <el-input v-model="model.title"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="res => model.avatar = res.url">
            <img v-if="model.avatar" :src="model.avatar" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="Banner">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="getAuthHeaders()"
            :show-file-list="false"
            :on-success="res => model.banner = res.url">
            <img v-if="model.banner" :src="model.banner" class="avatar">
            <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="model.categories" multiple>
            <el-option v-for="item in cate" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-rate style="margin-top: 0.6rem;" :max="9" show-score v-model="model.scores.difficult"></el-rate>
        </el-form-item>
        <el-form-item label="技能">
          <el-rate style="margin-top: 0.6rem;" :max="9" show-score v-model="model.scores.skills"></el-rate>
        </el-form-item>
        <el-form-item label="攻击">
          <el-rate style="margin-top: 0.6rem;" :max="9" show-score v-model="model.scores.attack"></el-rate>
        </el-form-item>
        <el-form-item label="生存">
          <el-rate style="margin-top: 0.6rem;" :max="9" show-score v-model="model.scores.survive"></el-rate>
        </el-form-item>
        <el-form-item label="顺风出装">
          <el-select v-model="model.items1" multiple>
            <el-option v-for="item in items" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="逆风出装">
          <el-select v-model="model.items2" multiple>
            <el-option v-for="item in items" :key="item._id" :value="item._id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用技巧">
          <el-input type="textarea" v-model="model.usageTips"></el-input>
        </el-form-item>
        <el-form-item label="对抗技巧">
          <el-input type="textarea" v-model="model.battleTips"></el-input>
        </el-form-item>
        <el-form-item label="团战思路">
          <el-input type="textarea" v-model="model.teamTips"></el-input>
        </el-form-item>
      </el-tab-pane>

      <el-tab-pane label="技能" name="skills">
        <el-button size="small" @click="model.skills.push({})">
          <el-icon><plus /></el-icon>添加技能
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap;">
          <el-col :md="12" v-for="(item, index) in model.skills" :key="index">
            <el-form-item label="名称">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="图标">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="getAuthHeaders()"
                :show-file-list="false"
                :on-success="res => $set(item, 'icon', res.url)">
                <img v-if="item.icon" :src="item.icon" class="avatar">
                <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="冷却值">
              <el-input v-model="item.delay"></el-input>
            </el-form-item>
            <el-form-item label="消耗">
              <el-input v-model="item.cost"></el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="item.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="小提示">
              <el-input v-model="item.tips" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="danger" @click="model.skills.splice(index, 1)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="最佳搭档" name="partners">
        <el-button size="small" @click="model.partners.push({})">
          <el-icon><plus /></el-icon>
          添加英雄
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap;">
          <el-col :md="12" v-for="(item, index) in model.partners" :key="index">
            <el-form-item label="英雄">
              <el-select filterable v-model="item.hero">
                <el-option v-for="hero in heroes" :key="hero._id" :value="hero._id" :label="hero.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="item.description" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="small" type="danger" @click="model.partners.splice(index, 1)">删除</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-form-item style="margin-top: 1rem;">
      <el-button type="primary" native-type="submit" @click="save">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getCurrentInstance, reactive, ref } from 'vue'
import { Plus } from '@element-plus/icons-vue' // eslint-disable-line no-unused-vars
export default {
  name: "HeroEdit",
  components: {
    plus: Plus
  },
  setup() {
    const { appContext } = getCurrentInstance()
    const app = appContext.config.globalProperties

    let activeName = ref('basic')
    
    let id = ref(app.$route.params.id)
    let categories = reactive([])
    let cate = reactive([])
    let items = reactive([])
    let heroes = reactive([])
    let model = reactive({
      name: '',
      avatar: '',
      skills: [],
      partners: [],
      scores: {
        difficult: 0
      }
    })
    
    id.value && fetch()
    fetchCategories()
    fetchItems()
    fetchHeroes()

    function type() {
      categories.forEach(item => {
        if(item.parent) {
          if(item.parent.name == "英雄分类"){
            cate.push(item)
          }
        }
      })
    }

    async function save() {
      if(id.value) {
        await app.$http.put(`rest/heroes/${id.value}`, model)
      } else {
        await app.$http.post(`rest/heroes`, model)
      }
      app.$router.go(-1)
      app.$message({
        message: '保存成功！',
        type: 'success'
      })
    } 

    async function fetch() {
      const res = await app.$http.get(`rest/heroes/${id.value}`)
      // model = Object.assign({}, model, res.data)
      Object.keys(res.data).forEach(key => {
        model[key] = res.data[key]
      })
    }

    async function fetchCategories() {
      const res = await app.$http.get(`rest/categories`)
      categories = res.data
      type()
      cate = [...cate]
    }

    async function fetchItems() {
      const res = await app.$http.get(`rest/items`)
      res.data.forEach(item => {
        items.push(item)
      })
    }

    async function fetchHeroes() {
      const res = await app.$http.get(`rest/heroes`)
      res.data.forEach(item => {
        heroes.push(item)
      })
    }

    return {
      app,
      activeName,
      id,
      categories,
      cate,
      items,
      heroes,
      model,
      type,
      save,
      fetch,
      fetchCategories,
      fetchItems,
      fetchHeroes
    }
  }
}
</script>

<style scoped>
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
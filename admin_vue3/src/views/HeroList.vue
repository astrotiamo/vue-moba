<template>
  <h1>英雄列表</h1>
  <el-table :data="items">
    <el-table-column prop="_id" label="ID" width="240"></el-table-column>
    <el-table-column prop="name" label="英雄名称"></el-table-column>
    <el-table-column prop="title" label="称号"></el-table-column>
    <el-table-column prop="avatar" label="头像">
      <template v-slot="scope">
        <img :src="scope.row.avatar" style="height: 3rem" />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="180">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="$router.push(`/heroes/edit/${scope.row._id}`)"
          >编辑</el-button
        >
        <el-button type="primary" size="small" @click="remove(scope.row)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getCurrentInstance, reactive } from "vue";
export default {
  name: "HeroList",
  setup() {
    const { appContext } = getCurrentInstance();
    const app = appContext.config.globalProperties;

    let items = reactive([]);

    fetch();

    async function fetch() {
      const res = await app.$http.get("rest/heroes");
      // console.log(res);
      res.data.forEach((item) => {
        items.push(item);
      });
    }

    async function remove(row) {
      app
        .$confirm(`是否确定删除英雄 "${row.name}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await app.$http.delete(`rest/heroes/${row._id}`);
          app.$message({
            type: "success",
            message: "删除成功!",
          });
          while (items.length) {
            items.pop();
          }
          fetch();
        })
        .catch(() => {
          app.$message({
            type: "info",
            message: "取消删除",
          });
        });
    }

    return {
      app,
      items,
      fetch,
      remove,
    };
  },
};
</script>

<style>
</style>
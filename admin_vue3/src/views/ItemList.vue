<template>
  <h1>物品列表</h1>
  <el-table :data="items.item">
    <el-table-column prop="_id" label="ID" width="240"></el-table-column>
    <el-table-column prop="name" label="物品名称"></el-table-column>
    <el-table-column prop="icon" label="图标">
      <template v-slot="scope">
        <img :src="scope.row.icon" style="height: 3rem" />
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="180">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="$router.push(`/items/edit/${scope.row._id}`)"
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
import { reactive, getCurrentInstance } from "vue";
export default {
  name: "ItemList",
  setup() {
    const { appContext } = getCurrentInstance();
    const app = appContext.config.globalProperties;

    let items = reactive({
      item: [],
    });

    fetch();

    async function fetch() {
      let res = await app.$http.get("rest/items");
      items.item = res.data;
    }
    async function remove(row) {
      app
        .$confirm(`是否确定删除分类 "${row.name}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await app.$http.delete(`rest/items/${row._id}`);
          app.$message({
            type: "success",
            message: "删除成功!",
          });
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
<template>
  <h1>分类列表</h1>
  <el-table :data="items">
    <el-table-column prop="_id" label="ID" width="240"></el-table-column>
    <el-table-column prop="parent.name" label="上级分类"></el-table-column>
    <el-table-column prop="name" label="分类名称"></el-table-column>
    <el-table-column fixed="right" label="操作" width="180">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="$router.push(`/categories/edit/${scope.row._id}`)"
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
  name: "CategoryList",
  setup() {
    const { appContext } = getCurrentInstance();
    const app = appContext.config.globalProperties;

    let items = reactive([]);

    fetch();

    async function fetch() {
      const res = await app.$http.get("rest/categories");
      // console.log(res)
      res.data.forEach((item) => {
        items.push(item);
      });
    }

    async function remove(row) {
      app
        .$confirm(`是否确定删除分类 "${row.name}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await app.$http.delete(`rest/categories/${row._id}`);
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
      items,
      fetch,
      remove,
    };
  },
};
</script>

<style>
</style>
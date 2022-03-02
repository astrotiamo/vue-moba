<template>
  <h1>管理员列表</h1>
  <el-table :data="items">
    <el-table-column prop="_id" label="ID" width="240"></el-table-column>
    <el-table-column prop="username" label="用户名"></el-table-column>
    <el-table-column fixed="right" label="操作" width="180">
      <template v-slot="scope">
        <el-button
          type="primary"
          size="small"
          @click="$router.push(`/admin_users/edit/${scope.row._id}`)"
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
  name: "AdminUserList",
  setup() {
    const { appContext } = getCurrentInstance();
    const app = appContext.config.globalProperties;

    let items = reactive([]);

    fetch();

    async function fetch() {
      const res = await app.$http.get("rest/admin_users");
      res.data.forEach((item) => {
        items.push(item);
      });
    }

    async function remove(row) {
      app
        .$confirm(`是否确定删除 "${row.name}"`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          await app.$http.delete(`rest/admin_users/${row._id}`);
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
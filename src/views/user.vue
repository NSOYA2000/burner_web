<template>
  <div class="user-content">
    <el-container class="user-container">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template
              slot="title"
            ><i class="el-icon-user"></i>用户管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1">用户管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 14px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item><span
                class="logout"
                @click="logout()"
              >注销</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ userName }}</span>
        </el-header>
        <!-- table -->
        <el-main>
          <el-row type="flex" justify="start" class="create-row">
            <el-button
              type="primary"
              @click="createUserFun()"
            >创建用户</el-button>
          </el-row>
          <!-- TABLE -->
          <el-table v-loading="loading" :data="tableData">
            <el-table-column type="index" width="50" />
            <el-table-column prop="loginName" label="账户名称" />
            <el-table-column prop="name" label="用户姓名" />
            <el-table-column label="公司">
              <template slot-scope="scope">
                <span v-if="scope.row.companyInfoList">{{
                  scope.row["companyInfoList"][0]["name"]
                }}</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" />
            <el-table-column label="操作" width="300px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row, 'info')"
                >编辑</el-button>
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row, 'password')"
                >修改密码</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            class="my-pagination"
            background
            :current-page="pageNum"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="pageSize"
            layout="prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-main>
      </el-container>
    </el-container>

    <!-- 新增&编辑 用户 -->
    <el-dialog
      :title="type == 'create' ? '创建用户' : '编辑用户'"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item
          v-if="isShowInfo()"
          label="账户名称"
          :label-width="formLabelWidth"
          prop="loginName"
        >
          <el-input
            v-model="form.loginName"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入账户名称"
          />
        </el-form-item>
        <el-form-item
          v-if="isShowInfo()"
          label="用户姓名"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入用户姓名"
          />
        </el-form-item>
        <el-form-item
          v-if="isShowPassword()"
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="form.password"
            autocomplete="off"
            style="width: 100%"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item
          v-if="isShowInfo()"
          label="公司"
          :label-width="formLabelWidth"
          prop="companyInfoList"
        >
          <el-select
            v-model="form.companyInfoList"
            value-key="id"
            placeholder="请选择公司"
            style="width: 100%"
          >
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item['name']"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelFun()">取 消</el-button>
        <el-button type="primary" @click="submitFun()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getCompanyList,
  addUser,
  updateUser,
  updatePassword,
  deleteUser
} from '@/api/user'
import { removeToken, getUserName } from '@/utils/auth'
const Base64 = require('js-base64').Base64
export default {
  data() {
    return {
      fullscreenLoading: false,
      loading: false,
      tableData: [],
      companyList: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      dialogFormVisible: false,
      form: {
        loginName: '',
        name: '',
        password: '',
        companyInfoList: {},
        status: 1, // 状态 1 启用 0 禁用
        type: 2 // 1 管理员 2 普通用户
      },
      formLabelWidth: '120px',
      type: 'create',
      editType: 'info',
      rules: {
        loginName: [
          {
            required: true,
            message: '请输入账户名称',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          }
        ],
        companyInfoList: [
          {
            required: true,
            message: '请选择公司',
            trigger: ['blur', 'change']
          }
        ]
      },
      editRow: {},
      userName: ''
    }
  },
  created() {
    this.userName = getUserName()
    this.getUserListFun()
    this.getCompanyListFun()
  },
  methods: {
    // 获取用户列表
    getUserListFun() {
      var params = {
        page: this.pageNum,
        limit: this.pageSize,
        loginName: null,
        nickName: null,
        type: 2
      }
      this.loading = true
      getUserList(params)
        .then(res => {
          console.log(res)
          this.loading = false
          if (res['success']) {
            this.tableData = res['data']['list']
            this.total = res['data']['total']
          } else {
            this.$message.error(res['message'])
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 页面大小改变
    handleSizeChange(val) {
      this.pageSize = val
      this.getUserListFun()
    },
    // 当前页改变
    handleCurrentChange(val) {
      this.pageNum = val
      this.getUserListFun()
    },
    // 获取公司列表
    getCompanyListFun() {
      var params = {
        page: 1,
        limit: 200,
        name: null,
        code: null
      }
      getCompanyList(params)
        .then(res => {
          console.log(res)
          if (res['success']) {
            this.companyList = res['data']['list']
          } else {
            this.$message.error(res['message'])
          }
        })
        .catch(() => {})
    },
    // 创建用户
    createUserFun() {
      this.type = 'create'
      this.form = {
        loginName: '',
        name: '',
        password: '',
        companyInfoList: null,
        status: 1, // 状态 1 启用 0 禁用
        type: 2 // 1 管理员 2 普通用户
      }
      this.dialogFormVisible = true
    },
    // 提交操作
    submitFun() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          var params = {}

          if (this.type === 'create') {
            // 新增用户提交操作
            params = {
              loginName: this.form['loginName'],
              name: this.form['name'],
              password: Base64.encode(this.form['password']),
              status: this.form['status'],
              type: this.form['type'],
              companyInfoList: [this.form['companyInfoList']]
            }
            console.error(params)
            this.showFullScreenLoading(20000)
            addUser(params)
              .then(res => {
                console.log(res)
                this.closeFullScreenLoading()
                if (res['success']) {
                  this.$message({
                    message: '创建用户成功！',
                    type: 'success'
                  })
                  this.cancelFun()
                } else {
                  this.$message.error(res['message'])
                }
              })
              .catch(() => {
                this.closeFullScreenLoading()
              })
          } else if (this.type === 'edit') {
            // 编辑用户提交操作
            if (this.editType === 'info') {
              params = {
                id: this.editRow['id'],
                loginName: this.form['loginName'],
                name: this.form['name'],
                status: this.form['status'],
                type: this.form['type'],
                companyInfoList: [this.form['companyInfoList']]
              }
              console.error(params)
              this.showFullScreenLoading(20000)
              updateUser(params)
                .then(res => {
                  console.log(res)
                  this.closeFullScreenLoading()
                  if (res['success']) {
                    this.$message({
                      message: '用户信息更新成功！',
                      type: 'success'
                    })
                    this.cancelFun()
                  } else {
                    this.$message.error(res['message'])
                  }
                })
                .catch(() => {
                  this.closeFullScreenLoading()
                })
            } else if (this.editType === 'password') {
              params = {
                id: this.editRow['id'],
                password: Base64.encode(this.form['password'])
              }
              console.error(params)
              this.showFullScreenLoading(20000)
              updatePassword(params)
                .then(res => {
                  console.log(res)
                  this.closeFullScreenLoading()
                  if (res['success']) {
                    this.$message({
                      message: '用户密码更新成功！',
                      type: 'success'
                    })
                    this.cancelFun()
                  } else {
                    this.$message.error(res['message'])
                  }
                })
                .catch(() => {
                  this.closeFullScreenLoading()
                })
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消操作
    cancelFun() {
      this.$refs['ruleForm'].resetFields()
      this.dialogFormVisible = false
      this.getUserListFun()
    },
    // 编辑操作
    handleEdit(row, type) {
      console.log(row)
      this.type = 'edit'
      this.editType = type
      this.editRow = row
      this.form = {
        loginName: row['loginName'],
        name: row['name'],
        password: row['password'],
        companyInfoList: row['companyInfoList']
          ? row['companyInfoList'][0]
          : null,
        status: row['status'], // 状态 1 启用 0 禁用
        type: row['type'] // 1 管理员 2 普通用户
      }
      this.dialogFormVisible = true
    },
    // 删除操作
    handleDelete(index, row) {
      console.log(index, row)
      // 新增用户提交操作
      var params = {
        idList: [row['id']]
      }
      console.error(params)
      this.$confirm('是否删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.showFullScreenLoading(20000)
          deleteUser(params)
            .then(res => {
              console.log(res)
              this.closeFullScreenLoading()
              if (res['success']) {
                this.$message({
                  message: '删除用户成功！',
                  type: 'success'
                })
                this.getUserListFun()
              } else {
                this.$message.error(res['message'])
              }
            })
            .catch(() => {
              this.closeFullScreenLoading()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // loading显示函数
    showFullScreenLoading(time = 10000) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.fullscreenLoading = loading
      setTimeout(() => {
        loading.close()
      }, time)
    },
    // loading关闭函数
    closeFullScreenLoading() {
      this.fullscreenLoading.close()
    },
    isShowPassword() {
      if (this.type === 'create') {
        return true
      } else {
        if (this.editType === 'info') {
          return false
        } else {
          return true
        }
      }
    },
    isShowInfo() {
      if (this.type === 'create') {
        return true
      } else {
        if (this.editType === 'info') {
          return true
        } else {
          return false
        }
      }
    },
    // 注销
    logout() {
      console.warn('注销')
      removeToken()
      this.$router.push({
        path: '/',
        query: {}
      })
    }
  }
}
</script>
<style>
.el-header {
  background: linear-gradient(258deg, #3998ba 0%, #40af9a 100%);
  color: #fff;
  line-height: 60px;
}
.el-dropdown {
  color: #fff;
  font-size: 24px;
}
.el-aside {
  color: #333;
}
.user-container {
  height: 100vh;
}
.create-row {
  margin-bottom: 20px;
}
</style>

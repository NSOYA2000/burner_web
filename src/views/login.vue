<template>
  <div class="login">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      class="login-form"
    >
      <p class="admin-title">后台管理系统</p>
      <!-- 账号 -->
      <el-form-item prop="accountName">
        <el-input
          v-model="ruleForm.accountName"
          placeholder="请输入账号"
          prefix-icon="el-icon-user"
          size="large"
        />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          v-model="ruleForm.password"
          placeholder="请输入密码"
          type="password"
          show-password
          prefix-icon="el-icon-view"
          size="large"
        />
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="captcha">
        <el-row class="row-bg" justify="space-between">
          <el-col :span="16">
            <el-input
              v-model="ruleForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="el-icon-bank-card"
              size="large"
            /></el-col>
          <el-col
            :span="8"
          ><div class="captcha-div">
            <ValidCode
              v-if="validCode"
              ref="validcode"
              :value="validCode"
              @refresh="refreshFun"
            /></div></el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="submitForm('ruleFormRef')"
        >登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ValidCode from '@/components/validCode/index.vue'
import { getCapcha, loginFun } from '@/api/user'
import { setToken, setUserName } from '@/utils/auth'
const Base64 = require('js-base64').Base64
export default {
  components: {
    ValidCode
  },
  data() {
    return {
      fullscreenLoading: false,
      ruleForm: {
        accountName: '',
        password: '',
        captcha: '',
        clientType: 'PC',
        key: ''
      },
      rules: {
        accountName: [
          {
            required: true,
            message: '请输入账号',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          }
        ],
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['change', 'blur']
          },
          {
            validator: (rule, value, callback) => {
              if (value.toUpperCase() !== this.validCode.toUpperCase()) {
                // if (value !== this.validCode) {
                callback(new Error('请输入正确的验证码'))
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ]
      },
      validCode: '',
      loading: false
    }
  },
  created() {
    this.getCaptchaFun()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },
    // 获取验证码
    getCaptchaFun() {
      this.showFullScreenLoading()
      var params = {}
      getCapcha(params)
        .then(res => {
          console.log(res)
          this.closeFullScreenLoading()
          if (res['success']) {
            this.validCode = Base64.decode(res['data']['captcha'])
            this.ruleForm['key'] = res['data']['key']
          }
        })
        .catch(() => {
          this.closeFullScreenLoading()
        })
    },
    refreshFun(val) {
      this.getCaptchaFun()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var params = {
            accountName: this.ruleForm['accountName'],
            captcha: this.ruleForm['captcha'],
            clientType: this.ruleForm['clientType'],
            key: this.ruleForm['key'],
            password: Base64.encode(this.ruleForm['password'])
          }
          this.loading = true
          loginFun(params)
            .then(res => {
              console.log(res)
              this.loading = false
              if (res['success']) {
                console.log('登录成功')
                setToken(res['data']['token'])
                setUserName(res['data']['nickName'])
                this.$router.push({
                  path: '/user',
                  query: {}
                })
              } else {
                this.$message.error(res['message'])
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
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
    }
  }
}
</script>

<style scoped>
.admin-title {
  color: #fff;
  font-size: 34px;
  text-align: center;
}
.login {
  width: 100%;
  height: 100vh;
  background: #262b41;
  overflow: hidden;
}
.login-form {
  width: 400px;
  margin: 30vh auto;
}
.login-btn {
  width: 100%;
  /* background: #08c4e1; */
  /* color: #fff; */
}
.row-bg {
  width: 100%;
  align-items: center;
}
.captcha-div {
  background: #fff;
  height: 40px;
  margin-left: 10px;
  border-radius: 4px;
  text-align: center;
  line-height: 40px;
}
</style>

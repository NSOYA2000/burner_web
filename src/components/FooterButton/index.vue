<template>
  <div class="footer flex-center-center">
    <div class="return btn-basic btn-return flex-center-center" @click="back">
      返回
    </div>
    <div
      v-if="$route.query.operationType !== 'view'"
      class="publish btn-basic btn-publish flex-center-center"
      @click="addOrEdit"
    >
      创建
    </div>
  </div>
</template>
<script>
export default {
  name: "FootButton",
  props: {
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      addForm: this.form
    };
  },
  created() {
    console.log(this.addForm);
  },
  methods: {
    // 返回
    back() {
      this.$router.go(-1);
    },
    formatDate(val) {
      console.error(val);
      if (val) {
        var date = new Date(val);
        var y = 1900 + date.getYear();
        var m = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        var _val =
          y +
          "-" +
          m.substring(m.length - 2, m.length) +
          "-" +
          d.substring(d.length - 2, d.length);
        console.log(_val);
        return _val;
      } else {
        return "";
      }
    },
    // 添加或编辑问卷调查
    addOrEdit() {
      console.log(this.addForm);
      const params = {
        content: this.addForm.content,
        messageType: this.addForm.messageType,
        remindTypeList: [this.addForm.remindTypeList],
        sendDepartment: this.addForm.publishedBy,
        summary: this.addForm.summary,
        title: this.addForm.title,
        //新增循环参数
        cycleStartDate: this.formatDate(
          this.addForm.date_value != null ? this.addForm.date_value[0] : ""
        ),
        cycleEndDate: this.formatDate(
          this.addForm.date_value != null ? this.addForm.date_value[1] : ""
        ),
        cycleInterval: this.addForm.num,
        cyclePushFlag: this.addForm.cycleFlag === true
      };
      if (this.addForm.publishType === "1") {
        params["departmentList"] =
          this.addForm.departmentList.map(item => {
            return item.value;
          }) || [];
      } else {
        params["gidList"] = this.addForm.gidList;
        params["emailList"] = this.addForm.emailList;
      }
      if (this.addForm.publishTimeType === "1") {
        params["immediatePublishFlag"] = true;
      } else {
        params["immediatePublishFlag"] = false;
        params["publishTime"] = this.addForm.publishTime;
      }

      if (this.addForm.cycleFlag) {
        params["immediatePublishFlag"] = null;
        params["publishTime"] = null;
      }
      const operationType = this.$route.query.operationType;
      console.error(params);
      this.$refs["form"].validate(valid => {
        const defineValid = this.defineValidate();
        if (valid && defineValid && this.validateFormContent) {
          this.showFullScreenLoading();
          if (operationType === "add") {
            addNotification(params)
              .then(res => {
                if (res.success) {
                  this.closeFullScreenLoading();
                  this.$message({
                    message: "Notification Add Successfully",
                    type: "success"
                  });
                  this.back();
                } else {
                  this.closeFullScreenLoading();
                }
              })
              .catch(() => {
                this.closeFullScreenLoading();
              });
          } else if (operationType === "edit") {
            params.notificationId = this.$route.query.notificationId;
            if (this.addForm.cycleFlag) {
              updateCycleNotification(params).then(res => {
                if (res.success) {
                  this.closeFullScreenLoading();
                  this.$message({
                    message: "Notification Edit Successfully",
                    type: "success"
                  });
                  this.back();
                }
              });
            } else {
              updateNotification(params)
                .then(res => {
                  if (res.success) {
                    this.closeFullScreenLoading();
                    this.$message({
                      message: "Notification Edit Successfully",
                      type: "success"
                    });
                    this.back();
                  } else {
                    this.closeFullScreenLoading();
                  }
                })
                .catch(() => {
                  this.closeFullScreenLoading();
                });
            }
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.footer {
  width: 100%;
  height: 123px;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  opacity: 1;
  border-radius: 0 0 5px 5px;
  //   position: sticky;
  //   bottom: 20px;
}
.btn-return {
  background: linear-gradient(91deg, #b7e3e5 0%, #8ac4c6 100%);
}

.publish {
  margin-left: 206px;
}
.btn-basic {
  width: 300px;
  height: 60px;
  opacity: 1;
  border-radius: 30px;
  font-size: 16px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  font-weight: bold;
  line-height: 27px;
  color: #ffffff;

  &:hover {
    cursor: pointer;
  }
}
.btn-publish {
  background: linear-gradient(225deg, #3998ba 0%, #40af9a 100%);
}
</style>

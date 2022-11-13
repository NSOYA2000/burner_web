<template>
  <div class="preview-dialog-container">
    <el-dialog
      v-if="currentDialog"
      :title="title"
      custom-class="preview-list-dialog"
      :append-to-body="true"
      :width="elConfig.dialog.width"
      :top="elConfig.dialog.top"
      :visible.sync="currentDialog"
      @close="close"
    >
      <el-carousel type="card" :height="elConfig.carousel.height" :initial-index="showIndex" @change="change">
        <el-carousel-item v-for="(item, index) in fileList" :key="index">
          <div
            :style="{'backgroundImage': 'url(' + item.url + ')'}"
            style="background: no-repeat center;background-size: contain;width: 100%;height: 100%;"
          />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    value: {
      type: Boolean
    },
    showIndex: {
      type: Number,
      default: 0
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    elConfig: { // elementUI配置
      type: Object,
      default() {
        return {
          dialog: {
            width: '80%',
            top: '8vh'
          },
          carousel: {
            height: '500px'
          }
        }
      }
    }
  },
  data() {
    return {
      currentDialog: false,
      title: '预览图片'
    }
  },
  mounted() {
    this.title = this.fileList
    this.currentDialog = this.value
    if (this.fileList && this.fileList.length) {
      this.title = this.fileList[0].name || '预览图片'
    }
  },
  methods: {
    close() {
      this.currentDialog = false
      this.$emit('input', false)
    },
    change(currentIndex) {
      this.title = this.fileList[currentIndex].name
    }
  }
}
</script>

<style lang="scss">
  .preview-list-dialog{
    .el-dialog__header{
      padding: 16px !important;
      background-color: #009AA2 !important;

      .el-dialog__title{
        color: white;
      }

      .el-dialog__close{
        color: white;
      }
    }

    .el-dialog__body{
      padding: 30px !important;
    }
  }
</style>

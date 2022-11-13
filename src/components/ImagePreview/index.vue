<template>
  <div class="image-preview-container">
    <img class="pointer" :src="url" alt="" :style="{width: width + 'px', height: height + 'px'}" @click="imageDialog = true">
    <el-dialog
      custom-class="my-image-preview"
      title="Preview"
      width="80%"
      top="8vh"
      center
      :append-to-body="true"
      :visible.sync="imageDialog"
    >
      <div class="img-container">
        <div
          :style="{'backgroundImage': 'url(' + url + ')', height: 70 + 'vh'}"
          style="background: no-repeat center;background-size: contain;width: 100%;height: 100%;"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    url: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 120
    },
    height: {
      type: Number,
      default: 120
    }
  },
  data() {
    return {
      imageDialog: false
    }
  }
}
</script>

<style lang="scss">
  .my-image-preview{
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

<template>
  <div class="common-div">
    <!-- 燃烧罐情况 -->
    <div class="pot_info">
      <div class="info">
        <div class="left">
          <p>燃烧罐 12 <span>正常</span></p>
        </div>
        <div class="right">均温: 1300℃</div>
      </div>
      <div class="btn_array">
        <div
          v-for="(item, index) in btnArray"
          :key="index"
          class="btn"
          :class="{ active_btn: activeIndex == index }"
          @click="selectItem(item, index)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <!-- 燃烧罐图表 -->
    <div class="pot_chart"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: 0,
      btnArray: [
        {
          name: '温度'
        },
        {
          name: '压力'
        }
      ]
    }
  },
  methods: {
    selectItem(item, index) {
      this.activeIndex = index
    }
  }
}
</script>

<style lang="scss" scoped>
.common-div {
  padding: 20px;
  .pot_info {
    background: #242424;
    border-radius: 4px;
    padding: 15px;
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 11px;
      border-bottom: 1px solid #1c1c1c;
      .left {
        display: flex;
        align-items: center;
        p {
          font-size: 18px;
          color: #fff;
          margin: 0 !important;
          padding: 0 !important;
          span {
            padding: 1px 10px;
            background: rgba(18, 207, 120, 0.1);
            border: 1px solid #12cf78;
            opacity: 1;
            font-size: 11px;
            border-radius: 9px;
            color: #12cf78;
          }
        }
      }
      .right {
        font-size: 14px;
        color: #fff;
      }
    }
    .btn_array {
      margin-top: 27px;
      display: flex;
      justify-content: space-between;
      .btn {
        border: 1px solid #1e71e3;
        opacity: 1;
        border-radius: 4px;
        font-size: 14px;
        color: #1e71e3;
        padding: 6px 57px;
      }
      .active_btn {
        background: #1e71e3;
        color: #fff !important;
      }
    }
  }
}
</style>

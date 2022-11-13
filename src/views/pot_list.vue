<template>
  <div class="common-div">
    <div class="pot_list">
      <div
        v-for="(item, index) in pot_list"
        :key="index"
        class="pot_list_item"
        :class="{ active_item: activeIndex == index }"
        @click="gotoPotDeatil(item, index)"
      >
        <div class="pot_list_item_circle">
          <span>{{ index }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pot_list: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      activeIndex: 5
    }
  },
  methods: {
    gotoPotDeatil(item, index) {
      this.$router.push({
        path: '/potdetail'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.common-div {
  padding: 20px;
  .pot_list {
    display: flex;
    flex-wrap: wrap;
    .pot_list_item {
      display: flex;
      margin-right: 18px;
      margin-bottom: 18px;
      width: 70px;
      height: 70px;
      background: #242424;
      border: 1px solid rgba(255, 255, 255, 0.05);
      opacity: 1;
      border-radius: 4px;
      &:nth-child(4n) {
        margin-right: 0px;
      }
      .pot_list_item_circle {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 17px auto;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #1c1c1c;
        span {
          font-size: 18px;
          color: #fff;
        }
      }
    }
  }
}
.active_item {
  border: 1px solid #f9433d !important;
  .pot_list_item_circle {
    background: #f9433d !important;
  }
}
</style>

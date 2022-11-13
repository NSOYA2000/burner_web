<template>
  <div class="common-div">
    <div class="burner_list">
      <div
        v-for="(item, index) in burner_list"
        :key="index"
        class="burner_list_item"
        :class="{ active_item: activeIndex == index }"
        @click="gotoPotList(item, index)"
      >
        <div class="burner_list_item_left">
          <div class="fire">
            <template v-if="activeIndex == index">
              <img src="@/assets/fire_un.png" alt="" />
            </template>
            <template v-else>
              <img src="@/assets/fire.png" alt="" />
            </template>
          </div>
          <div class="value">
            <span class="name">燃烧炉01</span>
            <p class="dec">
              均温: 1800℃
              <span>{{ activeIndex == index ? "异常" : "正常" }}</span>
            </p>
          </div>
        </div>
        <span class="move">
          <img src="@/assets/move.png" alt="" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      burner_list: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      activeIndex: 3
    }
  },
  methods: {
    gotoPotList(item, index) {
      this.$router.push({
        path: '/potlist'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.burner_list {
  padding: 20px;
  .burner_list_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #242424;
    border: 1px solid rgba(255, 255, 255, 0.05);
    opacity: 1;
    border-radius: 4px;
    padding: 14px;
    margin-bottom: 14px;
    .burner_list_item_left {
      display: flex;
      .fire {
        flex-grow: 0;
        width: 36px;
        margin-right: 10px;
        height: 36px;
        border-radius: 50%;
        background: rgba(28, 28, 28, 1);
        padding: 8px 10px;
        img {
          display: block;
          width: 100%;
        }
      }
      .value {
        .name {
          font-size: 16px;
          color: white;
        }
        .dec {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          margin: 5px 0;
          span {
            color: rgba(18, 207, 120, 1);
          }
        }
      }
    }

    .move {
      width: 24px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.active_item {
  border: 1px solid #fa4338 !important;
  .value {
    .dec {
      span {
        color: #fa4338 !important;
      }
    }
  }
}
</style>

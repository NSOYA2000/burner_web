<template>
  <div>
    <div class="flex-start-center">
      <div
        v-for="(item, index) in currentList"
        :key="changeObj['code'] ? item[changeObj['code']] : item['code']"
        class="width-150 btn-radio-basic btn-radio-default"
        :class="[index > 0 ? 'margin-left-34' : '', !!item['selected'] ? 'btn-radio-active' : className, item['disabled'] === true ? 'btn-radio-disabled' : '']"
        @click="purviewToggle(item)"
      >
        <span>{{ changeObj['value'] ? item[changeObj['value']] : item['value'] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyLabelSelect',
  props: {
    value: {
      type: [Object, Array],
      default: () => {
        return null
      }
    },
    list: {
      type: Array,
      default: () => {
        return []
      }
    },
    multiple: {
      type: [Boolean],
      default: true
    },
    className: {
      type: String,
      default: ''
    },
    changeObj: {
      type: Object,
      default: () => {
        return {
          code: 'code',
          value: 'value'
        }
      }
    }
  },
  data: function() {
    return {
      currentList: []
    }
  },
  mounted() {
    this.currentList = JSON.parse(JSON.stringify(this.list))
    if (this.multiple) {
      this.currentList.forEach((item) => {
        this.$set(item, 'selected', this.value.some((valueItem) => {
          return valueItem.code === item.code
        }))
      })
    } else {
      this.currentList.forEach((item) => {
        this.$set(item, 'selected', this.value.code === item.code)
      })
    }
  },
  methods: {
    // 权限状态切换
    purviewToggle(item) {
      if (item.disabled) {
        return
      }
      if (!this.multiple) {
        this.setAllStatusFalse()
      }
      this.$set(item, 'selected', !item['selected'])
      this.$emit('toggle', item, this.currentList)
      if (this.multiple) {
        this.$emit('input', this.currentList.filter((item) => {
          return item['selected']
        }))
      } else {
        this.$emit('input', item)
      }
    },
    // 设置所有状态为false
    setAllStatusFalse() {
      this.currentList.forEach((item) => {
        this.$set(item, 'selected', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-radio-basic {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    border-radius: 5px;
    font-size: 14px;
    font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    font-weight: bold;
    line-height: 25px;
    color: #FFFFFF;
    opacity: 1;

    &:hover {
      cursor: pointer;
    }
  }

  .btn-radio-default {
    background: #FFFFFF;
    border: 1px solid #E4EAF0;
    opacity: 1;
    color: #879BAB;
  }

  .btn-radio-active {
    background: #2387AB;
    color: #FFFFFF;
    opacity: 0.98;
  }

  .btn-radio-disabled {
    opacity: 0.7;

    &:hover {
      cursor: not-allowed;
    }
  }
</style>

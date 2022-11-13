<template>
  <div
    class="ValidCode disabled-select"
    :style="`width:100px; height:40px`"
    @click="refreshCode"
  >
    <span
      v-for="(item, index) in codeList"
      :key="index"
      :style="getStyle(item)"
    >{{ item.code }}</span>
  </div>
</template>

<script>
export default {
  name: 'ValidCode',
  props: ['value'],

  data() {
    return {
      codeList: []
    }
  },
  watch: {
    value: {
      handler(newValue, oldValue) {
        console.error(newValue)
        this.createdCode()
      },
      deep: true
    }
  },

  mounted() {
    this.createdCode()
  },
  methods: {
    refreshCode() {
      this.$emit('refresh', this.codeList.map(item => item.code).join(''))
    },
    createdCode() {
      const len = this.value.length
      const codeList = []
      // 生成
      for (let i = 0; i < len; i++) {
        const rgb = [
          Math.round(Math.random() * 220),
          Math.round(Math.random() * 240),
          Math.round(Math.random() * 200)
        ]
        codeList.push({
          code: this.value[i],
          color: `rgb(${rgb})`,
          fontSize: `1${[Math.floor(Math.random() * 10)]}px`,
          padding: `${[Math.floor(Math.random() * 10)]}px`,
          transform: `rotate(${Math.floor(Math.random() * 90) -
            Math.floor(Math.random() * 90)}deg)`
        })
      }
      // 指向
      this.codeList = codeList
      // 将当前数据派发出去
      // this.$emit('refresh', codeList.map(item => item.code).join(''))
    },
    getStyle(data) {
      return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
    }
  }
}
</script>

<style scoped>
.ValidCode {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.ValidCode span {
  display: inline-block;
}
</style>

<template>
  <div class="flex">
    <div class="flex-1">
      <el-form-item :label="startDateLabel">
        <el-date-picker
          v-model="form.startDateTime"
          type="date"
          format="yyyy-MM-dd"
          :value-format="valueFormat"
          :placeholder="startDatePlaceholder"
          :picker-options="pickerOptionsStart"
          @change="changeStart"
        />
      </el-form-item>
    </div>
    <div
      v-if="isShowSeparator"
      class="separator flex-center-center"
      :class="separatorClass"
    >
      ---
    </div>
    <div class="flex-1">
      <el-form-item :label="endDateLabel">
        <el-date-picker
          v-model="form.endDateTime"
          type="date"
          format="yyyy-MM-dd"
          :value-format="valueFormat"
          :placeholder="endDatePlaceholder"
          :picker-options="pickerOptionsEnd"
          @change="changeEnd"
        />
      </el-form-item>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    startDateLabel: {
      type: String,
      default: '',
    },
    endDateLabel: {
      type: String,
      default: '',
    },
    startDatePlaceholder: {
      type: String,
      default: '',
    },
    endDatePlaceholder: {
      type: String,
      default: '',
    },
    isShowSeparator: {
      type: Boolean,
      default: true,
    },
    separatorClass: {
      type: String,
      default: 'width-50',
    },
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    valueFormat: {
      type: String,
      default: () => {
        return 'yyyy-MM-dd HH:mm:ss'
      },
    },
  },
  data() {
    return {
      form: {
        startDateTime: '',
        endDateTime: '',
      },
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() < new Date().setHours(0, 0, 0, 0)
        },
      },
      pickerOptionsEnd: {},
    }
  },
  mounted() {
    this.form.startDateTime = this.value[0]
    this.form.endDateTime = this.value[1]
  },
  methods: {
    changeStart() {
      this.$emit('input', [this.form.startDateTime, this.form.endDateTime])
      this.$emit('timeChange', [this.form.startDateTime, this.form.endDateTime])
      this.pickerOptionsEnd = {
        disabledDate: (time) => {
          return (
            time.getTime() <
            new Date(this.form.startDateTime.replace(/-/g, '/')).getTime()
          )
        },
      }
    },
    changeEnd() {
      this.$emit('input', [this.form.startDateTime, this.form.endDateTime])
      this.$emit('timeChange', [this.form.startDateTime, this.form.endDateTime])
      this.pickerOptionsStart = {
        disabledDate: (time) => {
          return this.form.endDateTime
            ? time.getTime() >
                new Date(this.form.endDateTime.replace(/-/g, '/')).getTime()
            : false
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.separator {
  color: rgba(214, 214, 214, 1);
}
</style>

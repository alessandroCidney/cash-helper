<template>
  <v-text-field
    v-model="datetimeComputed"
    type="datetime-local"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
const modelValue = defineModel<number>({ required: true })

const datetimeComputed = computed({
  get() {
    const datetimeStr = getInputDatetimeFromDate(unixTimestampToDate(modelValue.value))

    return datetimeStr
  },

  set(datetimeStr: string) {
    const datetimeRegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/

    if (datetimeRegExp.test(datetimeStr)) {
      modelValue.value = dateToUnixTimestamp(inputDatetimeToDate(datetimeStr))
    }
  },
})
</script>

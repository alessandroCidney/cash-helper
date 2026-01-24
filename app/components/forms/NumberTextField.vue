<template>
  <v-text-field
    :model-value="modelValue"
    type="number"
    lang="pt"
    v-bind="$attrs"
    @update:model-value="handleUpdateValue"
  />
</template>

<script setup lang="ts">
const modelValue = defineModel<string | number>({ required: true })

function handleUpdateValue(newValue: string | number) {
  modelValue.value = isValidNumber(newValue)
    ? stringToNumber(newValue)
    : newValue
}
</script>

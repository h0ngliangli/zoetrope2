<template>
  <UFormField :label="props.label">
    <template #label>
      {{ props.label }}
      <UKbd :value="props.focuskey" />
    </template>
    <div v-if="props.type === 'readonly'" class="text-xl font-semibold p-2">
      {{ model }}
    </div>
    <UInput
      v-if="props.type === 'input'"
      ref="refInput"
      v-model="model"
      size="xl"
      class="w-full"
      :placeholder="props.placeholder"
      @keydown.esc="onEscape"
    />
    <UTextarea
      v-if="props.type === 'textarea'"
      ref="refInput"
      v-model="model"
      autoresize
      size="xl"
      class="w-full"
      :placeholder="props.placeholder"
      @keydown.esc="onEscape"
    />
  </UFormField>
</template>

<script setup lang="ts">
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: "",
  },

  placeholder: {
    type: String,
    required: false,
    default: "",
  },

  type: {
    type: String,
    required: false,
    default: "input",
    validator: (value: string) =>
      ["readonly", "input", "textarea"].includes(value),
  },

  focuskey: {
    type: String,
    required: false,
    default: "",
  },
})

const refInput = ref<{
  inputRef?: HTMLInputElement
  textareaRef?: HTMLTextAreaElement
}>({})

// 用户按下esc键时，取消输入框的焦点
const onEscape = () => {
  refInput.value?.inputRef?.blur()
  refInput.value?.textareaRef?.blur()
}

// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: "",
})

// 焦点设置到input输入框
const onFocus = () => {
  refInput.value?.inputRef?.focus()
  refInput.value?.textareaRef?.focus()
}

defineShortcuts({
  [props.focuskey]: onFocus,
})
</script>

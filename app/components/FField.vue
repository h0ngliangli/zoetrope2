<template>
  <UFormField :label="props.label">
    <div v-if="props.type === 'readonly'" class="text-xl font-semibold">
      {{ model }}
    </div>
    <UInput
      v-if="props.type === 'input'"
      v-model="model"
      size="xl"
      class="w-full"
      :placeholder="props.placeholder"
      @keydown.esc="onEscape"
    />
    <UTextarea
      v-if="props.type === 'textarea'"
      v-model="model"
      autoresize
      size="xl"
      class="w-full"
      :placeholder="props.placeholder"
      @keydown.esc="onEscape"
    />
  </UFormField>
</template>

<script setup>
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
    validator: (value) => ["readonly", "input", "textarea"].includes(value),
  },
})

// 用户按下esc键时，取消输入框的焦点
const onEscape = () => {
  document.activeElement.blur()
}

// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: "",
})
</script>

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
    />
    <UTextarea
      v-if="props.type === 'textarea'"
      v-model="model"
      autoresize
      size="xl"
      class="w-full"
      :placeholder="props.placeholder"
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

// eslint-disable-next-line vue/require-prop-types
const model = defineModel({
  default: "",
})
</script>

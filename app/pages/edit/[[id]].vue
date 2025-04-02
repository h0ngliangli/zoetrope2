<template>
  <div class="p-4 grid grid-cols-1 gap-4">
    <UFormField label="提问(q)" class="mb-4">
      <UInput
        ref="refInputQ"
        v-model="refModel.q"
        placeholder="你的问题是什么?"
        class="w-full"
      />
    </UFormField>
    <UFormField label="标签(t)" class="mb-4">
      <UInput
        ref="refInputTags"
        v-model="refModel.tags"
        placeholder="标签1 标签2 ..."
        class="w-full"
      />
    </UFormField>
    <UFormField label="答案(a)" class="mb-4">
      <MonacoTextArea ref="refInputA" v-model="refModel.a" />
    </UFormField>
    <UFormField label="附注(n)" class="mb-4">
      <MonacoTextArea ref="refInputNote" v-model="refModel.note" />
    </UFormField>

    <div class="flex flex-row gap-4">
      <UButton :loading="refModel.loading" color="secondary" @click="save">
        保存(shift+s)
      </UButton>
      <UButton @click="newFlashcard"> 新建(shift+n) </UButton>
    </div>

    <!-- Debug Info -->
    <DebugInfo v-model="refModel" />
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const refModel = reactive({
  id: "",
  q: "",
  a: "",
  alang: "plaintext",
  tags: "",
  note: "",
  loading: false,
})
const refInputQ = ref(null)
const refInputTags = ref(null)
const refInputA = ref(null)
const refInputNote = ref(null)

const save = async () => {
  refModel.loading = true
  const response = await $fetch("/api/save", {
    method: "POST",
    body: {
      id: refModel.id,
      q: refModel.q,
      a: refModel.a,
      tags: refModel.tags,
      note: refModel.note,
    },
  })
  if (response.ok) {
    refModel.id = response.data.id
    showSuccessToast(`卡片 ${refModel.id} 保存成功`)
  } else {
    showErrorToast(response.message)
  }
  // 延期1秒关闭loading状态, 以便用户看到保存成功的提示
  setTimeout(() => {
    refModel.loading = false
  }, 1000)
}

const newFlashcard = () => {
  refModel.id = "new"
  refModel.q = ""
  refModel.a = ""
  refModel.tags = ""
  refModel.note = ""
}

// 根据refModel.id的变化，自动跳转到url
watch(
  () => refModel.id,
  (newId, oldId) => {
    console.log("id changed", oldId, newId)
    router.replace(`/edit/${newId}`)
  }
)

// vue中无法直接在<script setup>z中调用async函数, 这样会导致ref无法显示，
// 在mounted钩子中调用
onMounted(async () => {
  if (Number.isInteger(Number.parseInt(route.params.id))) {
    const response = await $fetch(`/api/get/${route.params.id}`)
    if (response.ok) {
      console.log(response.data)
      refModel.id = response.data.id
      refModel.q = response.data.q
      refModel.a = response.data.a
      refModel.tags = response.data.tags
      refModel.note = response.data.note
    } else {
      showErrorToast(`没有找到id为${refModel.id}的卡片，你可以创建一个新的`)
      refModel.id = "new"
    }
  } else {
    // 如果是新建卡片，直接赋值
    refModel.id = "new"
  }
})
// workaround 确保defineShotcuts在production模式下不被优化掉
const _ = defineShortcuts({
  q: () => {
    refInputQ.value.inputRef.focus()
  },
  t: () => {
    refInputTags.value.inputRef.focus()
  },
  a: () => {
    refInputA.value.focus()
  },
  n: () => {
    console.log("n")
    refInputNote.value.focus()
  },
  shift_s: save,
  shift_n: newFlashcard,
  escape: {
    usingInput: true,
    // 取消当前元素的焦点
    handler: () => document.activeElement.blur(),
  },
})
console.log("shortcuts", _)
</script>

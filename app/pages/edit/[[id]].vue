<template>
  <div id="a" class="flex flex-col gap-4">
    <UFormField size="md">
      <template #label>
        <div class="text-lg">
          提问<ShortcutHere
            keys="q"
            @keydown="
              () => {
                refInputQ.textareaRef.focus()
              }
            "
          />
        </div>
      </template>
      <UTextarea
        ref="refInputQ"
        v-model="refModel.q"
        :rows="1"
        autoresize
        placeholder="你的问题是什么?"
        class="w-full"
      />
    </UFormField>
    <UFormField>
      <template #label>
        <div class="text-lg">
          标签<ShortcutHere
            keys="t"
            @keydown="
              () => {
                refInputTags.inputRef.focus()
              }
            "
          />
        </div>
      </template>

      <UInput
        ref="refInputTags"
        v-model="refModel.tags"
        placeholder="标签1 标签2 ..."
        class="w-full"
      />
    </UFormField>
    <UFormField>
      <template #label>
        <div class="text-lg">
          答案<ShortcutHere
            keys="a-a"
            @keydown="
              () => {
                refInputAaa.focus()
              }
            "
          />
        </div>
      </template>
      <MonacoTextArea
        ref="refInputA"
        v-model:text="refModel.a"
        v-model:language="refModel.alang"
        maxrows="5"
      />
    </UFormField>
    <UButton
      :loading="refModel.loading"
      class="w-24"
      color="secondary"
      @click="save"
    >
      保存(alt+s)
    </UButton>
    <UFormField>
      <template #label>
        <div class="text-lg">
          附注<ShortcutHere
            keys="n-n"
            @keydown="
              () => {
                refInputNote.focus()
              }
            "
          />预览<ShortcutHere
            keys="y-y"
            @keydown="
              () => {
                refModel.showNotePreview = !refModel.showNotePreview
              }
            "
          />
        </div>
      </template>
      <div class="flex flex-row gap-4">
        <MonacoTextArea
          ref="refInputNote"
          v-model:text="refModel.note"
          language="markdown"
          maxrows="15"
          class="flex-1"
        />
        <div
          ref="refElePreview"
          class="flex-1 p-4 overflow-auto border border-(--ui-border) rounded-2xl max-h-100"
        >
          <MarkdownPreview v-model="refModel.note" />
        </div>
      </div>
    </UFormField>

    <!--预览窗口 -->
    <UModal v-model:open="refModel.showNotePreview" fullscreen>
      <template #content>
        <div class="p-4 overflow-auto">
          <MarkdownPreview v-model="refModel.note" />
        </div>
      </template>
    </UModal>
    <!-- Debug Info -->
    <!-- <DebugInfo v-model="refModel" /> -->
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
  showNotePreview: false,
})
const refInputQ = ref(null)
const refInputTags = ref(null)
const refInputA = ref(null)
const refInputNote = ref(null)
const refElePreview = ref(null)

const save = async () => {
  refModel.loading = true
  const response = await $fetch("/api/save", {
    method: "POST",
    body: {
      id: refModel.id,
      q: refModel.q,
      a: refModel.a,
      alang: refModel.alang,
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

// 根据refModel.id的变化，自动跳转到url
watch(
  () => refModel.id,
  (newId, _) => {
    router.replace(`/edit/${newId}`)
  }
)

// 根据refInputNote高的变化，自动调整预览容器refElePreview的高度
// watch(
//   () => {
//     if (refInputNote.value) {
//       return refInputNote.value.style.height
//     }
//     return 0
//   },
//   (newHeight, _) => {
//     console.log("newHeight", newHeight)
//     refElePreview.value.style.height = `${newHeight}px`
//   }
// )

// vue中无法直接在<script setup>z中调用async函数, 这样会导致ref无法显示，
// 在mounted钩子中调用
onMounted(async () => {
  if (Number.isInteger(Number.parseInt(route.params.id))) {
    const response = await $fetch(`/api/get/${route.params.id}`)
    if (response.ok) {
      refModel.id = response.data.id
      refModel.q = response.data.q
      refModel.a = response.data.a
      refModel.alang = response.data.alang || "plaintext"
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
  alt_s: save,
  escape: {
    usingInput: true,
    // 取消当前元素的焦点
    handler: () => {
      // 如果当前显示的是note预览，则关闭预览
      if (refModel.showNotePreview) {
        refModel.showNotePreview = false
        return
      }
      // 否则取消当前元素的焦点
      document.activeElement.blur()
    },
  },
})
</script>

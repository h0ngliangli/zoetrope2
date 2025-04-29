<template>
  <div class="flex flex-col gap-4">
    <UFormField>
      <template #label>
        <div class="text-lg">
          提问<ShortcutHere
            keys="q"
            @keydown="
              () => {
                refInputQ.focus()
              }
            "
          />
        </div>
      </template>
      <div class="grid grid-cols-2 gap-4">
        <MonacoTextArea
          ref="refInputQ"
          v-model:text="refModel.q"
          language="markdown"
          hide-language
          maxrows="15"
        />
        <div
          class="p-4 overflow-auto border border-(--ui-border) rounded-2xl max-h-100"
        >
          <MarkdownPreview v-model="refModel.q" />
        </div>
      </div>
    </UFormField>
    <div class="flex flex-row gap-2">
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
      <UInput
        ref="refInputTags"
        v-model="refModel.tags"
        placeholder="标签1 标签2 ..."
      />
    </div>
    <UFormField>
      <template #label>
        <div class="text-lg">
          <!--@keydown="refInputA.focus"这条语句会产生问题,因为此时refInputA可能还是null. -->
          答案<ShortcutHere
            keys="a"
            @keydown="
              () => {
                refInputA.focus()
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
    <div class="flex flex-row gap-2">
      <UButton :loading="refModel.loading" color="secondary" @click="save">
        <!-- TODO alt键似乎没有作用, 如果写成alt_s, 那么按s就可以触发了. -->
        保存(shift+s)
        <ShortcutHere keys="shift_s" hidden @keydown="save" />
      </UButton>
      <!-- 删除按钮 -->
      <UModal
        title="确认删除"
        description="删除后无法恢复，请谨慎操作。"
        :close="{
          color: 'primary',
          class: 'rounded-full',
        }"
      >
        <UButton v-if="refModel.id !== 'new'" color="error"> 删除 </UButton>
        <template #body>
          <div class="flex flex-row gap-2 justify-center">
            <UButton color="error" @click="del">确认删除</UButton>
          </div>
        </template>
      </UModal>
    </div>
    <UFormField>
      <template #label>
        <div class="text-lg">
          附注<ShortcutHere
            keys="n"
            @keydown="
              () => {
                refInputNote.focus()
              }
            "
          />预览<ShortcutHere
            keys="y"
            @keydown="
              () => {
                refModel.showNotePreview = !refModel.showNotePreview
              }
            "
          />
        </div>
      </template>
      <div class="grid grid-cols-2 gap-4">
        <MonacoTextArea
          ref="refInputNote"
          v-model:text="refModel.note"
          language="markdown"
          hide-language
          maxrows="15"
        />
        <div
          ref="refElePreview"
          class="p-4 overflow-auto border border-(--ui-border) rounded-2xl max-h-100"
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

const del = async () => {
  const response = await $fetch(`/api/delete/${refModel.id}`, {
    method: "DELETE",
  })
  if (response.ok) {
    showSuccessToast(`卡片 ${refModel.id} 删除成功`)
    router.replace("/edit/new")
  } else {
    showErrorToast(response.message)
  }
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
const shortcuts = defineShortcuts({
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
console.log("defined shortcuts", shortcuts)
</script>

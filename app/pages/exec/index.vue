<template>
  <div :id="route.hash.substring(1)" class="flex flex-col gap-2">
    <div class="text-lg m-auto" style="max-width: 80%">
      <MarkdownPreview v-model="refModel.q" />
    </div>
    <div class="m-auto"><TagsText :text="refModel.tags" /></div>
    <div>答案<ShortcutHere keys="a" @keydown="onFocus" /></div>
    <div>
      <MonacoTextArea
        ref="refEditor"
        v-model:text="refModel.userA"
        v-model:language="refModel.alang"
        maxrows="15"
        hide-language
      />
    </div>
    <div v-if="refResult === true" class="text-(--ui-success)">回答正确</div>
    <div v-else-if="refResult === false" class="text-(--ui-error)">
      回答错误<ShortcutHere keys="h" @keydown="refShowA = null" />
    </div>
    <MonacoTextArea
      v-show="refShowA"
      v-model:text="refModel.a"
      v-model:language="refModel.alang"
      hide-language
      maxrows="15"
      readonly
    />
    <div class="flex flex-row gap-2">
      <UButton @click="onCheckA"
        >提交
        <ShortcutHere keys="s" @keydown="onCheckA" />
      </UButton>
      <UButton @click="loadNext">
        下一题<ShortcutHere keys="d" @keydown="loadNext" />
      </UButton>

      <UButton trailing-icon="i-lucide-arrow-right" @click="onEdit">
        编辑 {{ refModel.id }}
        <ShortcutHere keys="e" @keydown="onEdit" />
      </UButton>
    </div>
    <div>
      <div @click="toggleRefShowNote">
        附注:
        <ShortcutHere keys="n" @keydown="toggleRefShowNote" />
      </div>
      <UCollapsible v-model:open="refShowNote" :unmount-on-hide="false">
        <template #content>
          <div ref="refNote" class="markdown">&nbsp;</div>
        </template>
      </UCollapsible>
    </div>

    <!-- <DebugInfo v-model="refModel" /> -->
  </div>
</template>

<script setup>
import markdownit from "markdown-it"

// vars
const md = markdownit()
const route = useRoute()
const router = useRouter()
const refModel = reactive({
  id: route.params.id,
  q: "",
  a: "",
  alang: "plaintext",
  userA: "",
  tags: "",
  note: "",
})
const refResult = ref(null) // null表示没有结果，true表示正确，false表示错误
const refShowA = ref(false)
const refShowNote = ref(false)
const refNote = ref(null)
const refEditor = useTemplateRef("refEditor")

const onCheckA = () => {
  if (refModel.userA.trim() === refModel.a.trim()) {
    refResult.value = true
  } else {
    refResult.value = false
  }
  refShowA.value = true
  refShowNote.value = true
}

const onFocus = () => {
  refEditor.value.focus()
}

const toggleRefShowNote = () => {
  refShowNote.value = !refShowNote.value
}

const onEdit = () => {
  if (refModel.id === 0) {
    return
  }
  router.push(`/edit/${refModel.id}`)
}

/*
load current(if no current, load next).
load next.
*/

const loadHash = async () => {
  const id = Number.parseInt(route.hash.substring(1))
  if (Number.isInteger(id)) {
    const response = await $fetch(`/api/get/${id}`)
    if (!response.ok) {
      showErrorToast(response.message)
      return
    }
    parseResponse(response)
  } else {
    loadNext()
  }
}

const loadNext = async () => {
  let response = await $fetch(`/api/get/random-id`)
  if (!response.ok) {
    showErrorToast(response.message)
    return
  }
  router.replace(`/exec#${response.data.id}`)
  response = await $fetch(`/api/get/${response.data.id}`)
  parseResponse(response)
}

const parseResponse = (response) => {
  refResult.value = null
  refShowA.value = false
  refShowNote.value = false
  console.log(response.data)
  refModel.id = response.data.id
  refModel.q = response.data.q
  refModel.userA = ""
  refModel.alang = response.data.alang || "plaintext"
  refModel.a = response.data.a
  refModel.tags = response.data.tags
  refModel.note = response.data.note
  if (refModel.note) {
    console.log("refNote", refNote)
    refNote.value.innerHTML = md.render(refModel.note)
  } else {
    refNote.value.innerHTML = "(空)"
    refShowNote.value = true
  }
}

onMounted(async () => {
  loadHash()
})
</script>

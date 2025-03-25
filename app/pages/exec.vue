<template>
  <div class="p-4 flex flex-col gap-2">
    <div>提问: {{ state.q }}</div>
    <div>标签: {{ state.tags }}</div>
    <div>
      <UFormField>
        <template #label>
          答案
          <UKbd>Ctrl</UKbd>+<UKbd>Enter</UKbd>
        </template>
        <UTextarea
          ref="refA"
          v-model="state.a"
          class="w-full"
          autofocus
          @keydown="onCheckA"
          @keydown.esc="onBlur"
        />
        <template v-if="refResult === false" #error>
          正确答案
          <UTextarea v-model="a" class="w-full" readonly autoresize />
        </template>
        <template v-if="refResult === true" #help>
          <span>答对了</span>
        </template>
      </UFormField>
    </div>

    <div>
      <UButton
        class="m-2"
        :loading="refLoading"
        @click="onNext({ reload: false })"
      >
        下一题
        <UKbd>enter</UKbd>
      </UButton>

      <UButton class="m-2" trailing-icon="i-lucide-arrow-right" @click="onEdit">
        编辑 {{ state.id }}
        <UKbd>E</UKbd>
      </UButton>
    </div>
    <div>
      <UCollapsible v-model:open="refShowNote">
        <div>附注: <UKbd>N</UKbd></div>
        <template #content>
          <div v-if="!state.note">(空)</div>
          <UTextarea
            v-else
            v-model="state.note"
            class="w-full"
            readonly
            autoresize
          />
        </template>
      </UCollapsible>
    </div>

    <div>
      <UCollapsible v-model:open="refShowDebug">
        <div>debug info<UKbd>D</UKbd></div>
        <template #content>
          <div>state = {{ state }}</div>
        </template>
      </UCollapsible>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const stateid = "exec"
const state = useState(stateid, () => ({
  id: 0,
  q: "",
  a: "",
  realA: "",
  tags: "",
  note: "",
}))
const refA = useTemplateRef("refA")
const refResult = ref(null)
const refLoading = ref(false)
const refShowNote = ref(false)
const refShowDebug = ref(false)

//
const onNext = async ({ reload = false }) => {
  refLoading.value = true
  refShowNote.value = false
  refResult.value = null
  let response = null
  if (reload && state.value.id !== 0) {
    console.log("reloading ", state.value.id)
    response = await $fetch(`/api/get/${state.value.id}`)
  } else {
    console.log("getting random")
    response = await $fetch("/api/get/random")
  }
  if (response.ok) {
    console.log(response.data)
    state.value.id = response.data.id
    state.value.q = response.data.q
    state.value.a = ""
    state.value.realA = response.data.a
    state.value.tags = response.data.tags
    state.value.note = response.data.note
    onFocus()
    if (!state.value.note) {
      refShowNote.value = true
    }
  } else {
    showErrorToast(response.message)
  }
  setTimeout(() => {
    refLoading.value = false
  }, 1000)
}

const onCheckA = async (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    console.log("ctrl + enter pressed")
    // effect of checking answer
    await playCheckEffect()
    if (state.value.realA === state.value.a) {
      console.log("correct")
      refResult.value = true
    } else {
      console.log("wrong")
      refResult.value = false
    }
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const playCheckEffect = async () => {
  for (let i = 0; i < 2; i++) {
    onFocus()
    await wait(100)
    onBlur()
    await wait(100)
  }
}

const onBlur = () => {
  refA.value.textareaRef.blur()
}

const onFocus = () => {
  console.log("focus")
  if (refA.value && refA.value.textareaRef) {
    refA.value.textareaRef.focus()
  }
}

const onEdit = () => {
  if (state.value.id === 0) {
    return
  }
  router.push(`/edit-${state.value.id}`)
}

defineShortcuts({
  enter: () => {
    onNext({ reload: false })
  },
  a: () => {
    // TODO 这里为何不能调用onFocus？
    console.log("focus")
    refA.value.textareaRef.focus()
  },
  n: () => {
    refShowNote.value = !refShowNote.value
  },
  d: () => {
    refShowDebug.value = !refShowDebug.value
  },
  e: () => {
    onEdit()
  },
})

onMounted(() => {
  onNext({ reload: true })
})
</script>

<!--
    查询页面,拥有输入框,查询按钮,查询结果展示区域
    * 输入框: 用于输入查询内容
    * 查询按钮: 点击后触发查询
    * 查询结果展示区域: 显示查询结果
    * 结果列表: 显示查询结果的列表
    * 点击结果:跳转到edit页面
-->
<template>
  <div>
    <div id="查询栏" class="flex flex-row gap-2">
      <UFormField class="flex-1">
        <template #label>
          查询
          <UKbd>Enter</UKbd>
        </template>
        <UInput
          v-model="state.query"
          class="w-full"
          autofocus
          @keydown.enter="onSearch"
        />
        <template v-if="state.queryStatus === false" #error>
          <div class="text-red-500">{{ state.queryMessage }}</div>
        </template>
        <template v-if="state.queryStatus === true" #help>
          <span class="text-(--ui-success)">查询成功!</span>
        </template>
      </UFormField>
      <UButton class="m-2" :loading="state.loading" @click="onSearch">
        查询
      </UButton>
      <!-- <UButton
              class="m-2"
              trailing-icon="i-lucide-arrow-right"
              @click="onEdit"
            >
              编辑 {{ refModel.id }}
              <UKbd>E</UKbd>
            </UButton> -->
    </div>
    <div id="查询结果">
      <UPagination
        v-model:page="state.page"
        :total="state.queryDataLength"
        :items-per-page="state.pageSize"
      />
      <div
        id="查询结果grid"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        <UCard
          v-for="(item, index) in computedPagedResult"
          :key="index"
          class="cursor-pointer"
          @click="onEdit(item.id)"
        >
          <template #default>
            {{ item.q }}
          </template>
        </UCard>
      </div>
    </div>
    <div>
      <!-- <DebugInfo v-model="refModel" /> -->
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const state = useState(() => ({
  query: "",
  loading: false,
  queryStatus: null, // null, true, false
  queryMessage: "",
  queryData: [],
  queryDataLength: 0,
  page: 1,
  pageSize: 10,
}))
const refModel = state.value
const computedPagedResult = computed(() => funcGeneratePagedResult())

const onSearch = async () => {
  if (!refModel.query) {
    return
  }
  refModel.loading = true
  refModel.queryStatus = null
  refModel.queryMessage = ""
  refModel.queryData = []
  try {
    const response = await $fetch(`/api/search/${refModel.query}`)
    if (response.ok) {
      refModel.queryData = response.data
      refModel.queryDataLength = response.data.length
      console.log("response.queryDateLength", refModel.queryDataLength)
      refModel.queryStatus = true
      refModel.page = 1
    } else {
      refModel.queryStatus = false
      refModel.queryMessage = response.message
    }
  } catch (error) {
    console.error("Error:", error)
    refModel.queryStatus = false
  } finally {
    refModel.loading = false
  }
}

const onEdit = (id) => {
  router.push(`/edit/${id}`)
}

const funcGeneratePagedResult = () => {
  const startIndex = (refModel.page - 1) * refModel.pageSize
  const endIndex = startIndex + refModel.pageSize
  return refModel.queryData.slice(startIndex, endIndex)
}

onMounted(() => {
  if (route.params.keyword) {
    refModel.query = route.params.keyword
    onSearch()
  }
})
</script>

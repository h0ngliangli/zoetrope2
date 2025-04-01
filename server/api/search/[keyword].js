export default defineEventHandler(async (event) => {
  const keyword = getRouterParam(event, "keyword")
  logger.debug("search %s", keyword)
  if (!keyword) {
    return {
      statusCode: 400,
      ok: false,
      message: "请输入搜索关键字",
    }
  }
  const flashcards = await utilDbSearch(keyword)
  if (flashcards.length === 0) {
    return {
      statusCode: 404,
      ok: false,
      message: "没有找到对应的卡片",
    }
  }
  return {
    statusCode: 200,
    ok: true,
    data: flashcards,
  }
})

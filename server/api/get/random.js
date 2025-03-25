export default defineEventHandler(async () => {
  // eslint-disable-next-line no-undef
  const flashcard = await utilDbGetRandom()
  if (!flashcard) {
    return {
      statusCode: 404,
      ok: false,
      message: "没有找到任何卡片",
    }
  }
  return {
    statusCode: 200,
    ok: true,
    data: flashcard,
  }
})

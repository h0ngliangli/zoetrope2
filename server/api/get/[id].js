import { utilDbGet } from "~~/server/utils/db-sqlite"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  logger.debug(event.toString())
  const flashcard = await utilDbGet(id)
  if (!flashcard) {
    // setResponseStatus(event, 404, "没有找到对应的卡片")
    return {
      statusCode: 404,
      ok: false,
      message: "没有找到对应的卡片",
    }
  }
  logger.debug("成功读取flashcard id: %s q: %s...", flashcard.id, flashcard.q.substring(0, 10))
  return {
    statusCode: 200,
    ok: true,
    data: flashcard,
  }
})

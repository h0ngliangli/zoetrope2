import { utilDbDelete, utilDbGet } from "~~/server/utils/db-sqlite"

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  const flashcard = await utilDbGet(id)
  if (!flashcard) {
    // setResponseStatus(event, 404, "没有找到对应的卡片")
    return {
      statusCode: 404,
      ok: false,
      message: "没有找到对应的卡片",
    }
  }
  const result = await utilDbDelete(id)
  if (result.successful) {
    return {
      statusCode: 200,
      ok: true,
      message: "删除成功",
    }
  } else {
    return {
      statusCode: 500,
      ok: false,
      message: result.message,
    }
  }
})

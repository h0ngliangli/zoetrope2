import { utilDbSave } from "../utils/db-sqlite"

// save a flashcard to database
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  logger.debug("body %o", body)
  let {
    id = "",
    q = "",
    a = "",
    alang = "plaintext",
    tags = "",
    note = "",
  } = body
  if (!q || !a) {
    return {
      ok: false,
      statusCode: 400,
      message: "问题和答案不能为空哦～",
    }
  }
  try {
    id = await utilDbSave({ id, q, a, alang, tags, note })
    return {
      ok: true,
      statusCode: 200,
      message: "保存成功",
      data: {
        id: id,
      },
    }
  } catch (e) {
    const message = "保存时出错了……"
    logger.error("%s %o", message, e)
    return {
      ok: false,
      statusCode: 500,
      message: message,
    }
  }
})

/* eslint-disable no-undef */
import { utilDbSave } from "../utils/db-sqlite"

// save a flashcard to database
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  logger.debug("body %o", body)
  let { q = "", a = "", tags = "", note = "" } = body
  if (!q || !a) {
    return {
      ok: false,
      statusCode: 400,
      message: "Question and answer cannot be empty",
    }
  }
  const id = await utilDbSave({ q, a, tags, note })
  return {
    ok: true,
    statusCode: 200,
    message: "Flashcard saved",
    data: {
      id: id,
    }
  }
})

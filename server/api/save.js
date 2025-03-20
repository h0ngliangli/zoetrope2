/* eslint-disable no-undef */
import { utilDbSave } from "../utils/db-sqlite"

// save a flashcard to database
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  logger.debug("body %o", body)
  let { q = "", a = "", tags = "", note = "" } = body
  if (!q || !a) {
    throw new Error("Question and answer cannot be empty")
  }
  // convert tags to array
  if (tags) {
    tags = tags.split(" ").filter((tag) => tag)
  }

  const id = await utilDbSave({ q, a, tags, note })
  return { id }
})

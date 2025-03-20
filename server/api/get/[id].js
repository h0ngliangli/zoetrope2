import { utilDbGet } from "~~/server/utils/db-sqlite"

/* eslint-disable no-undef */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")
  logger.debug(event.toString())
  const flashcard = await utilDbGet(id)
  if (!flashcard) {
    setResponseStatus(event, 404, "Flashcard not found")
  }
  logger.debug("flashcard %o", flashcard)
  return flashcard
})

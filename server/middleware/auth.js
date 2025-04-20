export default defineEventHandler(async (event) => {
  logger.debug("server端auth: %s", event.path)
  const session = await getUserSession(event)
  logger.debug("server端auth: %o", session)
  let checkUser = false
  if (event.path.startsWith("/exec") || event.path.startsWith("/edit")) {
    checkUser = true
  }
  if (event.path.startsWith("/api")) {
    checkUser = true
    if (
      event.path.startsWith("/api/auth/") ||
      event.path.startsWith("/api/_")
    ) {
      checkUser = false
    }
  }

  if (checkUser && !session.user) {
    return sendRedirect(event, "/")
  }
})

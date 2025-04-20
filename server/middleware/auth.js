export default defineEventHandler(async (event) => {
  logger.debug("server端auth: %s", event.path)
  const session = await getUserSession(event)
  logger.debug("server端auth: %o", session)
  if (
    !session.user &&
    event.path !== "/" &&
    !event.path.startsWith("/api/auth/") &&
    !event.path.startsWith("/api/_")
  ) {
    return sendRedirect(event, "/")
  }
  // if (!loggedIn) {
  //   return navigateTo("/")
  // }
})

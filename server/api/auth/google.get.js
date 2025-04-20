export default defineOAuthGoogleEventHandler({
  async onSuccess(event, { user }) {
    if (!(await utilDbUserExists(user.email))) {
      // 目前只支持预先存在的用户.
      throw createError({
        statusCode: 403,
        statusMessage: "抱歉,暂时只支持预先存在的用户",
      })
    }
    await setUserSession(event, { user })
    return sendRedirect(event, "/exec")
  },
})

export default defineEventHandler(async () => {
  // eslint-disable-next-line no-undef
  const id = await utilDbGetRandomId()
  // await sendRedirect(event, `/exec/${id}`, 302)
  return {
    statusCode: 200,
    ok: true,
    data: { id },
  }
})

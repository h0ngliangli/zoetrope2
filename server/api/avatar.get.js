export default defineEventHandler(async (event) => {
  const { user } = await getUserSession(event)
  if (!user?.picture) {
    throw createError({
      statusCode: 404,
      message: "Avatar not found",
    })
  }

  // Get the avatar from Google's servers
  logger.debug("user.picture %s", user.picture)
  try {
    // response是Blob对象
    const response = await $fetch(user.picture)
    console.log("type", response.type)
    // console.log("response", response)
    // console.log("response.headers", response.headers)
    // Set the appropriate headers
    setResponseHeaders(event, {
      "Content-Type": response.type,
      "Cache-Control": "public, max-age=86400", // Cache for 24 hours
    })
    return response
    // Return the image data
    //return response.arrayBuffer()
  } catch (error) {
    console.log("error", error)
    throw createError({
      statusCode: 500,
      message: "Failed to fetch avatar",
    })
  }
})

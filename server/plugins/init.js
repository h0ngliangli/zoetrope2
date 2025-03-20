/* eslint-disable no-undef */

export default defineNitroPlugin(async () => {
    console.log("plugin init")
  logger.info("Initializing database")
  await utilDbInit()
})

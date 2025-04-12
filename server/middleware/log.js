export default defineEventHandler((event) => {
  const { method, url } = event.node.req
//   const { headers } = event.node.req
//   const { statusCode } = event.node.res

  logger.debug(
    "%s %s",
    method,
    url,
    // statusCode,
    // JSON.stringify(headers, null, 2)
  )
})

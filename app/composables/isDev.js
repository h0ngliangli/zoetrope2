// 检测当前环境是否为开发环境
export const utilIsDev = () => {
  const isDev = import.meta.env.MODE === "development"
  return isDev
}

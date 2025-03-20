const _show = (color, icon, text) => {
  const toast = useToast()
  toast.add({
    title: text,
    color: color,
    icon: icon,
    duration: 3000,
    ui: {
      progress: "hidden",
    },
  })
}
export const showInfoToast = (text) =>
  _show("info", "i-material-symbols-info-outline", text)
export const showSuccessToast = (text) =>
  _show("success", "i-material-symbols-check-rounded", text)
export const showErrorToast = (text) =>
  _show("error", "i-mingcute-terror-line", text)
export const showWarningToast = (text) =>
  _show("warning", "i-tdesign-error-triangle", text)

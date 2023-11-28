import { useQuasar } from "quasar"

export function useClipboard() {
  const $q = useQuasar()
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    $q.notify({
      message: "Copied to clipboard",
      position: "top",
    })
  }
  return {
    copyToClipboard,
  }
}

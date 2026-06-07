export {}

declare global {
  interface Window {
    ZaliLoader?: {
      reveal: (attempt?: number) => void
      cover: (cb: () => void) => void
      go: (url: string) => void
      reset?: () => void
    }
  }
}

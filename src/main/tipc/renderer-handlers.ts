export type RendererHandlers = {
  showSetting: (tab?: string) => void
  importAnime: () => void
  updateProgress: (params: { progress: number; status: 'downloading' | 'installing' }) => void
}

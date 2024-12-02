export type RendererHandlers = {
  showSetting: (tab?: string) => void
  importAnime: (params?: { path: string }) => void
  getReleaseNotes: (text: string) => void
  updateProgress: (params: { progress: number; status: 'downloading' | 'installing' }) => void
}

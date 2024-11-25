export type RendererHandlers = {
  showSetting: (tab?: string) => void
  importAnime: () => void
  getReleaseNotes: (text: string) => void
  updateProgress: (params: { progress: number; status: 'downloading' | 'installing' }) => void
}

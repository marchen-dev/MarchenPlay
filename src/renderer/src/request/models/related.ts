interface Related {
  url: string
  shift: number
}

export interface relatedPlatformModel {
  relateds: Related[]
  errorCode: number
  success: boolean
  errorMessage: string
}

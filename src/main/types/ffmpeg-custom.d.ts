import 'fluent-ffmpeg';

declare module 'fluent-ffmpeg' {
  interface FfmpegCommand {
    _inputs: { source: string }[];
  }
}
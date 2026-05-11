export type RecordingState = "idle" | "requesting-permission" | "recording" | "paused" | "ready" | "error";

export type PronunciationScore = {
  intelligibility: number;
  rhythm: number;
  phonemeHints: string[];
  summary: string;
};

export function isAudioRecordingSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);
}

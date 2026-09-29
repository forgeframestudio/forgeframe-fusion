export interface VoiceTurn { transcript: string; sessionId: string; }
export interface VoiceResponse { text: string; speak: boolean; }

export function voiceTurnToGoal(turn: VoiceTurn): string {
  const text = turn.transcript.trim();
  if (!text) throw new Error("Voice turn contained no request.");
  return text;
}

export function resultToVoiceResponse(completed: boolean, summary: string): VoiceResponse {
  return { text: completed ? summary : `I am still working on it. ${summary}`, speak: true };
}

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null

// Each HTMLAudioElement can only have ONE MediaElementAudioSourceNode ever created for it.
// We reuse existing nodes via WeakMap instead of calling createMediaElementSource again.
const sourceNodes = new WeakMap<HTMLAudioElement, MediaElementAudioSourceNode>()

export function connectAudio(element: HTMLAudioElement): void {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  // Reuse existing source node if one was already created for this element
  let source = sourceNodes.get(element)
  if (!source) {
    source = audioContext.createMediaElementSource(element)
    sourceNodes.set(element, source)
  }

  // Fresh analyser each connection so frequency data is clean
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.82

  // Disconnect source from previous analyser before reconnecting
  try { source.disconnect() } catch (e) {}

  source.connect(analyser)
  analyser.connect(audioContext.destination)
}

export function getAnalyser(): AnalyserNode | null {
  return analyser
}

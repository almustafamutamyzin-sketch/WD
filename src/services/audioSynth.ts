/**
 * Audio Engine for Al-Wudd School Anthem:
 * 1. Supports Web Audio API orchestrated music synthesizer (plays immediately without external assets)
 * 2. Supports custom Audio element for user-uploaded MP3/M4A/WAV tracks
 * 3. Supports live AnalyserNode for audio waveform and frequency visualizers
 * 4. Supports microphone sing-along recording
 */

export class AnthemAudioEngine {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private gainNode: GainNode | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private isCustomAudio = false;

  private isPlaying = false;
  private currentTime = 0;
  private duration = 228; // 3:48
  private playbackRate = 1;
  private volume = 0.85;
  private isMuted = false;

  private timerId: number | null = null;
  private noteIntervalId: number | null = null;
  private onTimeUpdateCallback: ((time: number) => void) | null = null;
  private onStateChangeCallback: ((playing: boolean) => void) | null = null;

  // Sing-along recorder
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecordingMic = false;

  constructor() {
    // Lazy initialize on user interaction
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setCustomAudioFile(file: File | Blob | string) {
    this.stop();
    this.initAudioContext();

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
    }

    const audio = new Audio();
    if (typeof file === 'string') {
      audio.src = file;
    } else {
      audio.src = URL.createObjectURL(file);
    }

    audio.crossOrigin = 'anonymous';
    this.customAudio = audio;
    this.isCustomAudio = true;

    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        this.duration = audio.duration;
      }
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }
    });

    audio.addEventListener('ended', () => {
      this.stop();
    });

    try {
      if (this.audioCtx && this.gainNode) {
        const source = this.audioCtx.createMediaElementSource(audio);
        source.connect(this.gainNode);
      }
    } catch {
      // Media element source already connected or cors
    }
  }

  public play() {
    this.initAudioContext();
    this.isPlaying = true;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(true);
    }

    if (this.isCustomAudio && this.customAudio) {
      this.customAudio.currentTime = this.currentTime;
      this.customAudio.playbackRate = this.playbackRate;
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
      this.customAudio.play().catch(() => {});
      return;
    }

    // Synthesized Orchestral Mode
    this.startSynthPlayback();
  }

  public pause() {
    this.isPlaying = false;
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback(false);
    }

    if (this.isCustomAudio && this.customAudio) {
      this.customAudio.pause();
    }

    if (this.timerId) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.noteIntervalId) {
      window.clearInterval(this.noteIntervalId);
      this.noteIntervalId = null;
    }
  }

  public stop() {
    this.pause();
    this.currentTime = 0;
    if (this.customAudio) {
      this.customAudio.currentTime = 0;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(0);
    }
  }

  public seek(seconds: number) {
    this.currentTime = Math.max(0, Math.min(seconds, this.duration));
    if (this.isCustomAudio && this.customAudio) {
      this.customAudio.currentTime = this.currentTime;
    }
    if (this.onTimeUpdateCallback) {
      this.onTimeUpdateCallback(this.currentTime);
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(val, 1));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.setVolume(this.volume);
    return this.isMuted;
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.customAudio) {
      this.customAudio.playbackRate = rate;
    }
  }

  public onTimeUpdate(cb: (t: number) => void) {
    this.onTimeUpdateCallback = cb;
  }

  public onStateChange(cb: (p: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public getVisualizerData(array: Uint8Array): void {
    if (this.analyser && this.isPlaying) {
      this.analyser.getByteFrequencyData(array as unknown as Uint8Array<ArrayBuffer>);
    } else {
      array.fill(0);
    }
  }

  /**
   * Orchestral Anthem Synthesizer:
   * Generates joyful school anthem brass, strings, and chimes in F Major
   */
  private startSynthPlayback() {
    const tickInterval = 100; // ms
    this.timerId = window.setInterval(() => {
      this.currentTime += (tickInterval / 1000) * this.playbackRate;
      if (this.currentTime >= this.duration) {
        this.stop();
        return;
      }
      if (this.onTimeUpdateCallback) {
        this.onTimeUpdateCallback(this.currentTime);
      }
    }, tickInterval);

    // Rhythm step: 110 BPM -> beat = 60/110 = 0.545s
    const stepDuration = 272; // 8th note in ms
    let step = 0;

    // F Major chord progression notes (Hz)
    // Fmaj: F3 (174.6), A3 (220), C4 (261.6), F4 (349.2)
    // Cmaj: C3 (130.8), G3 (196), C4 (261.6), E4 (329.6)
    // Dmin: D3 (146.8), A3 (220), D4 (293.7), F4 (349.2)
    // Bbmaj: Bb2 (116.5), F3 (174.6), Bb3 (233), D4 (293.7)

    const chords = [
      [174.6, 261.6, 349.2, 440], // F
      [130.8, 196.0, 261.6, 329.6], // C
      [146.8, 220.0, 293.7, 349.2], // Dm
      [116.5, 174.6, 233.1, 349.2], // Bb
    ];

    const melodyF = [349.2, 392.0, 440.0, 523.3, 440.0, 392.0, 349.2, 329.6];

    this.noteIntervalId = window.setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || !this.gainNode) return;

      const chordIndex = Math.floor(step / 8) % chords.length;
      const currentChord = chords[chordIndex];
      const noteHz = currentChord[step % currentChord.length];
      const melodyHz = melodyF[step % melodyF.length];

      // Play bell/piano lead
      this.triggerTone(melodyHz, 0.22, 'triangle', 0.15);

      // Play warm strings pad on beat 0 and 4
      if (step % 4 === 0) {
        this.triggerTone(currentChord[0], 0.7, 'sawtooth', 0.08);
        this.triggerTone(currentChord[1], 0.7, 'sine', 0.12);
        // Kick
        this.triggerPercussion(120, 45, 0.12, 0.25);
      } else if (step % 4 === 2) {
        // Snare / clap
        this.triggerPercussion(280, 80, 0.1, 0.18);
      }

      // Gentle acoustic arpeggio
      this.triggerTone(noteHz * 1.5, 0.15, 'sine', 0.1);

      step++;
    }, stepDuration / this.playbackRate);
  }

  private triggerTone(freq: number, duration: number, type: OscillatorType, level: number) {
    if (!this.audioCtx || !this.gainNode) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const noteGain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const now = this.audioCtx.currentTime;
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.exponentialRampToValueAtTime(level, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(noteGain);
      noteGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // Audio context might be closing
    }
  }

  private triggerPercussion(startFreq: number, endFreq: number, duration: number, level: number) {
    if (!this.audioCtx || !this.gainNode) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const pGain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

      pGain.gain.setValueAtTime(level, now);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(pGain);
      pGain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore
    }
  }

  // Live Microphone Sing-Along Recording
  public async startMicRecording(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };

      this.mediaRecorder.start();
      this.isRecordingMic = true;
      this.play(); // Start backing track automatically
      return true;
    } catch (err) {
      console.warn('Microphone permission not granted or available:', err);
      return false;
    }
  }

  public stopMicRecording(): Blob | null {
    if (this.mediaRecorder && this.isRecordingMic) {
      this.mediaRecorder.stop();
      this.isRecordingMic = false;
      this.pause();
      const audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      return audioBlob;
    }
    return null;
  }

  public getIsRecording(): boolean {
    return this.isRecordingMic;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getIsCustom(): boolean {
    return this.isCustomAudio;
  }
}

export const anthemEngine = new AnthemAudioEngine();

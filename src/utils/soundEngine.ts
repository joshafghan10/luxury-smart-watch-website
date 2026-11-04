class HorologicalSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;
  private tickInterval: number | null = null;
  private roomGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);

      this.roomGain = this.ctx.createGain();
      this.roomGain.gain.value = 0.4;
      this.roomGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  enable() {
    this.isEnabled = true;
    this.ensureContext();
  }

  disable() {
    this.isEnabled = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    gainValue = 0.15,
    attack = 0.01,
    decay = 0.08
  ) {
    if (!this.isEnabled) return;
    const ctx = this.ensureContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.roomGain!);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.05);
  }

  playTick() {
    this.playTone(1800, 0.04, 'sine', 0.08, 0.005, 0.03);
  }

  playClick() {
    this.playTone(2400, 0.03, 'triangle', 0.12, 0.002, 0.02);
  }

  playChime() {
    if (!this.isEnabled) return;
    const ctx = this.ensureContext();
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.6, 'sine', 0.1, 0.02, 0.4);
      }, i * 180);
    });
  }

  playWhoosh() {
    if (!this.isEnabled) return;
    const ctx = this.ensureContext();
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.roomGain!);
    noise.start();
  }

  startAmbientTick(bpm = 60) {
    if (this.tickInterval) clearInterval(this.tickInterval);
    const interval = 60000 / bpm;
    this.tickInterval = window.setInterval(() => this.playTick(), interval);
  }

  stopAmbientTick() {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}

export const soundEngine = new HorologicalSoundEngine();

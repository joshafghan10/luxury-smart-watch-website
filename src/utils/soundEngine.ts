class HorologicalSoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled = false;
  private tickInterval: number | null = null;
  private roomGain: GainNode | null = null;
  private step = 0;
  private lastTick = 0;

  private ensureCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AC();
      this.roomGain = this.ctx.createGain();
      this.roomGain.gain.value = 0.22;
      this.roomGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  enable() {
    this.isEnabled = true;
    this.ensureCtx();
  }

  disable() {
    this.isEnabled = false;
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = 'sine',
    vol = 0.12,
    attack = 0.008
  ) {
    if (!this.isEnabled) return;
    const ctx = this.ensureCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + attack);
    g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + dur);
    osc.connect(g);
    g.connect(this.roomGain!);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.04);
  }

  tick() {
    const now = performance.now();
    if (now - this.lastTick < 80) return;
    this.lastTick = now;
    this.tone(1650 + (this.step % 2) * 120, 0.035, 'sine', 0.07, 0.004);
    this.step++;
  }

  click() {
    this.tone(2100, 0.028, 'triangle', 0.11, 0.003);
  }

  softChime() {
    if (!this.isEnabled) return;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, i) => {
      setTimeout(() => this.tone(f, 0.55, 'sine', 0.09, 0.02), i * 160);
    });
  }

  whoosh() {
    if (!this.isEnabled) return;
    const ctx = this.ensureCtx();
    const len = Math.floor(ctx.sampleRate * 0.38);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.28));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(900, ctx.currentTime);
    filt.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.32);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.14, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + 0.32);
    src.connect(filt);
    filt.connect(g);
    g.connect(this.roomGain!);
    src.start();
  }

  startAmbient(bpm = 58) {
    if (this.tickInterval !== null) clearInterval(this.tickInterval);
    const ms = 60000 / bpm;
    this.tickInterval = window.setInterval(() => this.tick(), ms);
  }

  stopAmbient() {
    if (this.tickInterval !== null) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  playConfigChange() {
    this.click();
    setTimeout(() => this.tone(880, 0.12, 'sine', 0.06), 40);
  }

  playReveal() {
    this.whoosh();
    setTimeout(() => this.softChime(), 220);
  }

  playSectionEnter() {
    this.tone(392, 0.25, 'sine', 0.05, 0.03);
    setTimeout(() => this.tone(523.25, 0.3, 'sine', 0.04, 0.04), 90);
  }
}

export const soundEngine = new HorologicalSoundEngine();

class AudioService {
  private context: AudioContext | null = null;

  private init() {
    if (!this.context) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContext();
    }
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  playCorrect() {
    this.init();
    if (!this.context) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(500, t);
    osc.frequency.exponentialRampToValueAtTime(1000, t + 0.1);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  playWrong() {
    this.init();
    if (!this.context) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);

    gain.gain.setValueAtTime(0.1, t);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.4);

    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  playClick() {
    this.init();
    if (!this.context) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  // Sound for wheel spinning (ticking)
  playTick() {
    this.init();
    if (!this.context) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    // Short, crisp wood-block style click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.05);
    
    gain.gain.setValueAtTime(0.2, t); 
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Sound for wheel stopping
  playWheelStop() {
    this.init();
    if (!this.context) return;

    const t = this.context.currentTime;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    // Low thud/ding
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.5);
    
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);

    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }
  
  playWin() {
      this.init();
      if (!this.context) return;
      
      const t = this.context.currentTime;
      // Arpeggio
      [0, 0.1, 0.2, 0.4].forEach((offset, i) => {
          const osc = this.context!.createOscillator();
          const gain = this.context!.createGain();
          osc.type = 'square';
          osc.frequency.value = 400 + (i * 100);
          gain.gain.setValueAtTime(0.05, t + offset);
          gain.gain.linearRampToValueAtTime(0, t + offset + 0.3);
          osc.connect(gain);
          gain.connect(this.context!.destination);
          osc.start(t + offset);
          osc.stop(t + offset + 0.3);
      });
  }
}

export const audioService = new AudioService();
export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.drone = null;
        this.heartbeat = null;
        this.isStarted = false;
    }

    init() {
        if (this.isStarted) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.isStarted = true;
    }

    startAtmosphere() {
        if (!this.ctx) this.init();
        
        // Low creepy drone
        this.drone = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        this.drone.type = 'sawtooth';
        this.drone.frequency.setValueAtTime(40, this.ctx.currentTime);
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        
        this.drone.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        this.drone.start();
        
        // Modulate frequency for creepiness
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(5, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(this.drone.frequency);
        lfo.start();
    }

    playHeartbeat(intensity = 1) {
        if (!this.ctx) this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.2 * intensity, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playJumpscareSound() {
        if (!this.ctx) this.init();
        const bufferSize = 2 * this.ctx.sampleRate;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(10, this.ctx.currentTime + 0.5);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        whiteNoise.start();
    }
}

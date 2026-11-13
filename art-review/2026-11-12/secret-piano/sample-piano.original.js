const sampleUrl = name => new URL(`assets/piano/${name}?v=correct-piano-2`, import.meta.url).href;

export function pianoKeyRegions(settings) {
  const {whiteEdges, blackBounds, artworkWidth, artworkHeight, keyTop, whiteBottom, blackBottom} = settings;
  const region = (color, index, left, right, bottom) => ({
    id: `${color}-${String(index + 1).padStart(2, '0')}`,
    color,
    index,
    left: left / artworkWidth * 100,
    width: (right - left) / artworkWidth * 100,
    top: keyTop / artworkHeight * 100,
    height: (bottom - keyTop) / artworkHeight * 100,
  });
  const white = whiteEdges.slice(0, -1).map((left, index) => region('white', index, left, whiteEdges[index + 1], whiteBottom));
  const black = settings.blackKeysEnabled
    ? blackBounds.map(([left, right], index) => region('black', index, left, right, blackBottom))
    : [];
  return [...white, ...black].sort((a, b) => (a.left + a.width / 2) - (b.left + b.width / 2))
    .map((key, index) => ({...key, available: index < settings.recordedNotes}));
}

export class SamplePiano {
  constructor({root, settings}) {
    this.root = root;
    this.settings = settings;
    this.enabled = false;
    this.generation = 0;
    this.voices = new Set();
    this.buffers = new Map();
    this.downloads = new Map();
    this.keys = [];
    this.status = document.getElementById('piano-status');

    for (const region of pianoKeyRegions(settings)) {
      const key = document.createElement('button');
      key.type = 'button';
      key.className = `sample-key sample-key-${region.color}`;
      key.dataset.sample = region.id;
      key.setAttribute('aria-label', `${region.color === 'white' ? 'White' : 'Black'} piano key ${region.index + 1}`);
      for (const property of ['left', 'width', 'top', 'height']) key.style[property] = `${region[property]}%`;
      key.disabled = true;
      key.dataset.available = String(region.available);
      key.addEventListener('pointerdown', event => {
        if (event.button !== 0) return;
        event.preventDefault();
        this.play(region.id, key);
      });
      key.addEventListener('click', event => {
        if (event.detail === 0) this.play(region.id, key);
      });
      root.append(key);
      this.keys.push(key);
      // Download samples early, while the prologue or initial poem is playing.
      if (region.available) this.download(region.id).catch(() => {});
    }
  }

  download(id) {
    if (!this.downloads.has(id)) {
      const request = fetch(sampleUrl(`${id}.wav`)).then(response => {
        if (!response.ok) throw new Error('Piano sample unavailable');
        return response.arrayBuffer();
      }).catch(error => {
        this.downloads.delete(id);
        throw error;
      });
      this.downloads.set(id, request);
    }
    return this.downloads.get(id);
  }

  async play(id, key) {
    if (!this.enabled) return;
    const generation = this.generation;
    try {
      this.context ??= new (window.AudioContext || window.webkitAudioContext)();
      await this.context.resume();
      if (this.context.state !== 'running') throw new Error('Audio is paused');
      if (!this.buffers.has(id)) {
        const bytes = await this.download(id);
        if (!this.buffers.has(id)) this.buffers.set(id, this.context.decodeAudioData(bytes.slice(0)));
      }
      const buffer = await this.buffers.get(id);
      if (!this.enabled || generation !== this.generation) return;
      if (this.voices.size >= 12) {
        const oldest = this.voices.values().next().value;
        this.voices.delete(oldest);
        oldest.stop();
      }
      const source = this.context.createBufferSource();
      const level = this.context.createGain();
      source.buffer = buffer;
      level.gain.value = this.settings.volume;
      source.connect(level);
      level.connect(this.context.destination);
      this.voices.add(source);
      source.onended = () => {
        this.voices.delete(source);
        source.disconnect();
        level.disconnect();
      };
      source.start();
      this.status.hidden = true;
    } catch {
      this.buffers.delete(id);
      this.status.hidden = false;
      this.status.textContent = 'That piano key could not play. Tap it again to retry.';
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    this.keys.forEach(key => { key.disabled = !enabled || key.dataset.available !== 'true'; });
    if (!enabled) this.stop();
  }

  stop() {
    this.generation++;
    for (const voice of this.voices) {
      try { voice.stop(); } catch {}
    }
    this.voices.clear();
  }
}

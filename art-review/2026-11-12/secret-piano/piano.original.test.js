import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pianoKeyRegions} from '../sample-piano.js';
import {config} from '../config.js';

test('every drawn piano key maps to a distinct supplied sample and valid hit region', () => {
  const regions = pianoKeyRegions(config.challenge.piano);
  assert.equal(regions.filter(key => key.color === 'white').length, 15);
  assert.equal(regions.filter(key => key.color === 'black').length, 10);
  assert.equal(new Set(regions.map(key => key.id)).size, 25);
  for (const key of regions) {
    assert.ok(key.left >= 0 && key.left + key.width <= 100);
    assert.ok(key.top >= 0 && key.top + key.height <= 100);
    if (!key.available) continue;
    const bytes = readFileSync(new URL(`../assets/piano/${key.id}.wav`, import.meta.url));
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WAVE');
    assert.equal(bytes.readUInt32LE(24), 44100);
    assert.ok(bytes.length > 44100, 'sample includes the note release');
  }
  const whiteOnly = pianoKeyRegions({...config.challenge.piano, blackKeysEnabled: false});
  assert.equal(whiteOnly.length, 15);
});

test('corrected recording follows all white and black keys in left-to-right order', () => {
  const samples = JSON.parse(readFileSync(new URL('../assets/piano/samples.json', import.meta.url)));
  const regions = pianoKeyRegions(config.challenge.piano);
  assert.equal(samples.length, 25);
  assert.equal(regions.filter(key => !key.available).length, 0);
  samples.forEach((sample, index) => {
    assert.equal(sample.source, index < 20 ? 'Correct_Piano.mp3' : 'Last_Five.mp3');
    assert.equal(sample.file, `${regions[index].id}.wav`);
    assert.equal(sample.noteInRecording, index < 20 ? index + 1 : index - 19);
    assert.ok(sample.duration > .5);
    if (index && index !== 20) assert.ok(samples[index - 1].end < sample.start);
  });
});

test('piano mixes notes without controlling stanza audio and remains silent while locked', async () => {
  const {SamplePiano} = await import('../sample-piano.js');
  const original = {document: globalThis.document, window: globalThis.window, fetch: globalThis.fetch};
  let starts = 0;
  const status = {hidden: true};
  const keys = [];
  const element = () => ({dataset: {}, style: {}, setAttribute(){}, addEventListener(){}});
  globalThis.document = {getElementById: () => status, createElement: element};
  globalThis.fetch = async () => ({ok: true, arrayBuffer: async () => new ArrayBuffer(8)});
  globalThis.window = {AudioContext: class {
    state = 'running'; destination = {};
    async resume() {} async decodeAudioData() { return {}; }
    createBufferSource() {return {connect(){}, disconnect(){}, start(){starts++;}, stop(){}};}
    createGain() {return {gain: {}, connect(){}, disconnect(){}};}
  }};
  try {
    const piano = new SamplePiano({root:{append(key){keys.push(key)}},settings:config.challenge.piano});
    await piano.play('white-01', keys[0]);
    assert.equal(starts, 0);
    piano.setEnabled(true);
    assert.equal(keys.filter(key => key.disabled).length, 0);
    await piano.play('white-01', keys[0]);
    await piano.play('black-01', keys[1]);
    assert.equal(starts, 2);
    assert.equal(piano.voices.size, 2, 'notes can ring concurrently');
    piano.setEnabled(false);
    assert.equal(piano.voices.size, 0);
    assert.equal(status.hidden, true);
  } finally { Object.assign(globalThis, original); }
});

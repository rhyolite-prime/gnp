import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createImagePanController } from '../utils/imagePan.ts';

function setup() {
  let enabled = true;
  let dragging = false;
  const captured = new Set();
  const viewport = {
    scrollLeft: 200, scrollTop: 300, scrollWidth: 1200, clientWidth: 400, scrollHeight: 1800, clientHeight: 600,
    focus() {}, setPointerCapture: id => captured.add(id), hasPointerCapture: id => captured.has(id), releasePointerCapture: id => captured.delete(id),
  };
  const event = (extra = {}) => ({ currentTarget: viewport, pointerId: 1, pointerType: 'mouse', button: 0, buttons: 1, isPrimary: true, clientX: 100, clientY: 100, preventDefault() {}, ...extra });
  return { viewport, event, pan: createImagePanController(() => enabled, value => { dragging = value; }), captured, enable: value => { enabled = value; }, dragging: () => dragging };
}

test('mouse drag pans in both axes and captures the pointer until released', () => {
  const state = setup();
  state.pan.start(state.event());
  assert.ok(state.dragging());
  assert.ok(state.captured.has(1));
  state.pan.move(state.event({ clientX: 150, clientY: 75 }));
  assert.equal(state.viewport.scrollLeft, 150);
  assert.equal(state.viewport.scrollTop, 325);
  state.pan.stop(state.event());
  assert.equal(state.dragging(), false);
  assert.equal(state.captured.size, 0);
});

test('fit mode, right clicks and touch keep native behaviour without starting mouse pan', () => {
  const state = setup();
  state.enable(false);
  state.pan.start(state.event());
  state.enable(true);
  for (const values of [{ button: 2 }, { pointerType: 'touch' }, { isPrimary: false }]) state.pan.start(state.event(values));
  assert.equal(state.dragging(), false);
  assert.equal(state.captured.size, 0);
});

test('pan clamps to image boundaries and ignores unrelated pointers', () => {
  const state = setup();
  state.pan.start(state.event());
  state.pan.move(state.event({ pointerId: 2, clientX: -999 }));
  assert.equal(state.viewport.scrollLeft, 200);
  state.pan.stop(state.event({ pointerId: 2 }));
  assert.ok(state.dragging());
  state.pan.move(state.event({ clientX: -9999, clientY: -9999 }));
  assert.equal(state.viewport.scrollLeft, 800);
  assert.equal(state.viewport.scrollTop, 1200);
  state.pan.move(state.event({ clientX: 9999, clientY: 9999 }));
  assert.equal(state.viewport.scrollLeft, 0);
  assert.equal(state.viewport.scrollTop, 0);
});

test('cancellation, lost capture, reset and released mouse buttons end dragging', () => {
  const state = setup();
  state.pan.start(state.event());
  state.pan.stop(); // Fit, document replacement, or component disposal.
  assert.equal(state.dragging(), false);
  state.pan.start(state.event());
  state.pan.move(state.event({ buttons: 0 }));
  assert.equal(state.dragging(), false);
  state.pan.start(state.event());
  state.enable(false);
  state.pan.move(state.event());
  assert.equal(state.dragging(), false);
  assert.equal(state.captured.size, 0);
});

test('viewer exposes new-tab only for PDFs and wires image drag cleanup', async () => {
  const component = await readFile(new URL('../components/ArchiveDocumentViewer.vue', import.meta.url), 'utf8');
  assert.match(component, /v-if="isPdf && blobUrl"/);
  assert.match(component, /@pointercancel="pan.stop"/);
  assert.match(component, /@lostpointercapture="pan.stop"/);
  assert.match(component, /:draggable="false"/);
  assert.match(component, /function release\(\) \{\s+pan.stop\(\)/);
});

/** Pointer-captured mouse dragging over a scrollable, zoomed image viewport. */
export function createImagePanController(canPan: () => boolean, setDragging: (value: boolean) => void) {
  let drag: { viewport: HTMLElement; pointerId: number; x: number; y: number; left: number; top: number } | null = null;

  function stop(event?: PointerEvent) {
    if (!drag || (event && event.pointerId !== drag.pointerId)) return;
    const { viewport, pointerId } = drag;
    drag = null;
    setDragging(false);
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
  }

  function start(event: PointerEvent) {
    if (!canPan() || event.pointerType !== 'mouse' || event.button !== 0 || !event.isPrimary || drag) return;
    const viewport = event.currentTarget as HTMLElement;
    event.preventDefault();
    viewport.focus({ preventScroll: true });
    viewport.setPointerCapture(event.pointerId);
    drag = { viewport, pointerId: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
    setDragging(true);
  }

  function move(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (!canPan() || !(event.buttons & 1)) { stop(event); return; }
    event.preventDefault();
    const { viewport, x, y, left, top } = drag;
    viewport.scrollLeft = Math.max(0, Math.min(viewport.scrollWidth - viewport.clientWidth, left - (event.clientX - x)));
    viewport.scrollTop = Math.max(0, Math.min(viewport.scrollHeight - viewport.clientHeight, top - (event.clientY - y)));
  }

  return { start, move, stop };
}

<template>
  <div class="reader" :data-theme="settings.theme" :class="{ immersive: !chromeVisible }">
    <!-- ══════════ TOP BAR ══════════ -->
    <header class="topbar" v-show="chromeVisible">
      <div class="brand">
        <span class="brand-mark">G</span>
        <div class="brand-text">
          <strong>NewsPlus Reader</strong>
          <span v-if="docTitle" class="brand-sub">{{ docTitle }}</span>
        </div>
      </div>
      <div class="topbar-actions">
        <span class="page-chip" v-if="pageCount">{{ currentPage }} / {{ pageCount }}</span>
        <div class="zoom-group" v-if="!liquid">
          <button class="icon-btn zg" title="Zoom out" :disabled="zoom <= 1" @click="zoomOut">−</button>
          <button class="zoom-pct" title="Reset zoom" @click="setZoom(1)">{{ Math.round(zoom * 100) }}%</button>
          <button class="icon-btn zg" title="Zoom in" :disabled="zoom >= MAX_ZOOM" @click="zoomIn">+</button>
        </div>
        <button v-if="false" class="icon-btn liquid-btn" :class="{ active: liquid }" title="Liquid Mode — reflow page into readable text" @click="toggleLiquid">
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.7s6.5 7.1 6.5 12a6.5 6.5 0 1 1-13 0c0-4.9 6.5-12 6.5-12z"/></svg>
          <span class="liquid-label">Liquid</span>
        </button>
        <button class="icon-btn aa-btn" title="Reading settings" @click.stop="settingsOpen = !settingsOpen">Aa</button>
        <button class="icon-btn headlines-btn" title="Headlines" @click="drawerOpen = true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h10M4 18h14"/></svg>
        </button>
      </div>
    </header>

    <!-- ══════════ SETTINGS POPOVER (Kindle-style "Aa") ══════════ -->
    <Transition name="pop">
      <div v-if="settingsOpen" class="settings-pop" @click.stop>
        <div class="set-row">
          <label>Theme</label>
          <div class="seg">
            <button v-for="t in themes" :key="t.id" :class="{ on: settings.theme === t.id }"
              :style="{ background: t.swatch, color: t.ink }" @click="settings.theme = t.id">{{ t.label }}</button>
          </div>
        </div>
        <div class="set-row">
          <label>Page turn</label>
          <div class="seg">
            <button v-for="m in turnModes" :key="m.id" :class="{ on: settings.pageTurn === m.id }"
              @click="settings.pageTurn = m.id">{{ m.label }}</button>
          </div>
        </div>
        <div class="set-row toggle-row">
          <label>Tap sides to turn pages</label>
          <button class="switch" :class="{ on: settings.tapZones }" @click="settings.tapZones = !settings.tapZones"><i /></button>
        </div>
        <div class="set-row toggle-row">
          <label>Show reading progress</label>
          <button class="switch" :class="{ on: settings.showProgress }" @click="settings.showProgress = !settings.showProgress"><i /></button>
        </div>
        <div v-if="false" class="set-divider"><span>Liquid Mode</span></div>
        <div v-if="false" class="set-row">
          <label>Text size</label>
          <div class="size-ctl">
            <button class="size-btn small-a" @click="settings.liquidSize = Math.max(15, settings.liquidSize - 1)">A</button>
            <input type="range" min="15" max="28" step="1" v-model.number="settings.liquidSize" />
            <button class="size-btn big-a" @click="settings.liquidSize = Math.min(28, settings.liquidSize + 1)">A</button>
          </div>
        </div>
        <div v-if="false" class="set-row">
          <label>Font</label>
          <div class="seg">
            <button :class="{ on: settings.liquidFont === 'serif' }" style="font-family: Georgia, serif" @click="settings.liquidFont = 'serif'">Serif</button>
            <button :class="{ on: settings.liquidFont === 'sans' }" @click="settings.liquidFont = 'sans'">Sans</button>
          </div>
        </div>
        <p class="set-hint">Tip: tap the centre of the page for distraction-free reading, double-tap or pinch to zoom, Ctrl+scroll on desktop, swipe to turn pages. Liquid Mode reflows the newsprint into readable text.</p>
      </div>
    </Transition>

    <!-- ══════════ MAIN AREA ══════════ -->
    <div class="main">
      <!-- Left headlines rail -->
      <aside class="side" v-show="chromeVisible">
        <div class="side-head">
          <h3>Top Stories</h3>
          <span v-if="extracting" class="mini-spin" title="Scanning pages…" />
        </div>
        <div class="side-scroll">
          <template v-if="leftHeadlines.length">
            <button v-for="h in leftHeadlines" :key="h.id" class="headline-card" @click="openArticle(h)">
              <span class="hl-page">P{{ h.page }}</span>
              <span class="hl-title">{{ h.title }}</span>
            </button>
          </template>
          <div v-else class="skeletons"><i v-for="n in 6" :key="n" /></div>
        </div>
      </aside>

      <!-- Page stage -->
      <div class="stage-wrap">
        <div v-show="!liquid" ref="stageEl" class="stage" :class="{ zoomed: zoom > 1 }"
          @click="onStageClick" @dblclick.prevent="onDblClick"
          @mousedown="onDragStart"
          @touchstart.passive="onTouchStart" @touchmove.passive="onTouchMove" @touchend.passive="onTouchEnd">
          <div class="canvas-holder" ref="holderEl">
            <canvas ref="canvasEl" class="page-canvas" />
            <div ref="overlayEl" class="turn-overlay" :class="overlayClass">
              <img ref="overlayImg" alt="" draggable="false" />
              <span class="turn-shade" />
            </div>
          </div>

          <div v-if="loading" class="loader">
            <div class="loader-ring" />
            <p>Fetching today's paper… {{ loadPct }}%</p>
          </div>
        </div>

        <!-- ══════════ LIQUID MODE (reflowed text, Acrobat-style) ══════════ -->
        <div v-if="liquid" ref="liquidEl" class="liquid-view"
          @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
          <div class="liquid-inner" :style="liquidStyle">
            <div class="lq-pagechip">
              <span class="lq-drop">💧</span> Liquid Mode · Page {{ currentPage }} of {{ pageCount }}
            </div>
            <template v-if="currentBlocks.length">
              <template v-for="(b, i) in currentBlocks" :key="currentPage + '-' + i">
                <h2 v-if="b.type === 'h'" class="lq-h">{{ b.text }}</h2>
                <p v-else-if="b.type === 'byline'" class="lq-byline">{{ b.text }}</p>
                <p v-else class="lq-p" :class="{ lede: b.lede }">{{ b.text }}</p>
              </template>
              <div class="lq-endmark">◼</div>
            </template>
            <div v-else class="lq-empty">
              <template v-if="extracting && !pageBlocks[currentPage]">
                <span class="mini-spin" /> Reflowing this page…
              </template>
              <template v-else>
                <p><strong>Nothing to reflow here.</strong></p>
                <p>This page appears to be a photo spread or advertisement with no extractable text.</p>
                <button class="solid-btn" @click="toggleLiquid">View original page</button>
              </template>
            </div>
          </div>
        </div>

        <!-- forward / backward arrows -->
        <button class="nav-arrow prev" :disabled="currentPage <= 1" @click.stop="go(-1)" aria-label="Previous page">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button class="nav-arrow next" :disabled="currentPage >= pageCount" @click.stop="go(1)" aria-label="Next page">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </button>
      </div>

      <!-- Right headlines rail -->
      <aside class="side" v-show="chromeVisible">
        <div class="side-head"><h3>More Inside</h3></div>
        <div class="side-scroll">
          <template v-if="rightHeadlines.length">
            <button v-for="h in rightHeadlines" :key="h.id" class="headline-card" @click="openArticle(h)">
              <span class="hl-page">P{{ h.page }}</span>
              <span class="hl-title">{{ h.title }}</span>
            </button>
          </template>
          <div v-else class="skeletons"><i v-for="n in 6" :key="n" /></div>
        </div>
      </aside>
    </div>

    <!-- ══════════ PROGRESS FOOTER (Kindle-style) ══════════ -->
    <footer class="progressbar" v-show="chromeVisible && settings.showProgress && pageCount">
      <div class="prog-track" @click="scrub">
        <div class="prog-fill" :style="{ width: progressPct + '%' }" />
        <div class="prog-knob" :style="{ left: progressPct + '%' }" />
      </div>
      <div class="prog-label">Page {{ currentPage }} of {{ pageCount }} · {{ progressPct }}%</div>
    </footer>

    <!-- ══════════ MOBILE HEADLINES DRAWER ══════════ -->
    <Transition name="fade"><div v-if="drawerOpen" class="scrim" @click="drawerOpen = false" /></Transition>
    <Transition name="sheet">
      <div v-if="drawerOpen" class="drawer">
        <div class="drawer-grip" />
        <div class="drawer-head">
          <h3>Story Headlines</h3>
          <button class="icon-btn" @click="drawerOpen = false">✕</button>
        </div>
        <div class="drawer-scroll">
          <button v-for="h in headlines" :key="h.id" class="headline-card" @click="openArticle(h); drawerOpen = false">
            <span class="hl-page">P{{ h.page }}</span>
            <span class="hl-title">{{ h.title }}</span>
          </button>
          <p v-if="!headlines.length" class="drawer-empty">{{ extracting ? 'Scanning pages for stories…' : 'No stories found.' }}</p>
        </div>
      </div>
    </Transition>

    <!-- ══════════ ARTICLE MODAL ══════════ -->
    <Transition name="fade"><div v-if="article" class="scrim modal-scrim" @click="article = null" /></Transition>
    <Transition name="modal">
      <div v-if="article" class="article-modal" role="dialog" aria-modal="true">
        <button class="modal-close" @click="article = null" aria-label="Close">✕</button>
        <div class="modal-scroll">
          <span class="art-kicker">Daily Graphic · Page {{ article.page }}</span>
          <h2 class="art-title">{{ article.title }}</h2>
          <p v-if="article.byline" class="art-byline">{{ article.byline }}</p>
          <hr class="art-rule" />
          <template v-if="article.paragraphs.length">
            <p v-for="(p, i) in article.paragraphs" :key="i" class="art-para" :class="{ lede: i === 0 }">{{ p }}</p>
          </template>
          <p v-else class="art-para dim">Full text for this story could not be extracted — jump to the page to read it in the paper.</p>
        </div>
        <div class="modal-foot">
          <button class="ghost-btn" @click="article = null">Dismiss</button>
          <button class="solid-btn" @click="jumpTo(article.page)">Open page {{ article.page }} →</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>

const props = defineProps({
  pdfUrl: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
})


/* ────────────────────────── state ────────────────────────── */
const canvasEl = ref(null)
const stageEl = ref(null)
const holderEl = ref(null)
const overlayEl = ref(null)
const overlayImg = ref(null)

const loading = ref(true)
const loadPct = ref(0)
const pageCount = ref(0)
const currentPage = ref(1)
const zoom = ref(1)
const MAX_ZOOM = 4
const liquid = ref(false)
const liquidEl = ref(null)
const pageBlocks = ref({})
const chromeVisible = ref(true)
const settingsOpen = ref(false)
const drawerOpen = ref(false)
const article = ref(null)
const overlayClass = ref('')
const extracting = ref(true)
const headlines = ref([])
const docTitle = computed(() => props.title)

const themes = [
  { id: 'light', label: 'White', swatch: '#ffffff', ink: '#222' },
  { id: 'sepia', label: 'Sepia', swatch: '#f2e3c2', ink: '#5b4636' },
  { id: 'dark', label: 'Dark', swatch: '#16181d', ink: '#ddd' }
]
const turnModes = [
  { id: 'flip', label: 'Flip' },
  { id: 'slide', label: 'Slide' },
  { id: 'fade', label: 'Fade' },
  { id: 'none', label: 'Off' }
]
const settings = reactive({
  theme: 'light', pageTurn: 'flip', tapZones: true, showProgress: true,
  liquidSize: 18, liquidFont: 'sans'
})

let pdfDoc = null
let renderToken = 0
let activeRenderTask = null
let resizeTimer = null
let clickTimer = null
let lastTouchNav = 0
let touchStart = null
let lastRenderedZoom = 1
let zoomTimer = null
let pinch = null
let drag = null

const progressPct = computed(() =>
  pageCount.value ? Math.round((currentPage.value / pageCount.value) * 100) : 0
)
const leftHeadlines = computed(() => headlines.value.filter((_, i) => i % 2 === 0))
const rightHeadlines = computed(() => headlines.value.filter((_, i) => i % 2 === 1))
const currentBlocks = computed(() => pageBlocks.value[currentPage.value] || [])
const liquidStyle = computed(() => ({
  fontSize: settings.liquidSize + 'px',
  fontFamily: settings.liquidFont === 'serif'
    ? "Georgia, 'Times New Roman', serif"
    : "'Sora', system-ui, sans-serif"
}))

/* ────────────────────────── boot ────────────────────────── */
onMounted(async () => {
  try {
    const saved = JSON.parse(localStorage.getItem('reader-settings') || 'null')
    if (saved) Object.assign(settings, saved)
  } catch {}
  watch(settings, (v) => localStorage.setItem('reader-settings', JSON.stringify(v)))

  window.addEventListener('keydown', onKey)
  document.addEventListener('click', closePopovers)

  const pdfjs = await import('pdfjs-dist')
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl

  const task = pdfjs.getDocument({ url: props.pdfUrl })
  task.onProgress = ({ loaded, total }) => {
    if (total) loadPct.value = Math.min(99, Math.round((loaded / total) * 100))
  }
  pdfDoc = await task.promise
  pageCount.value = pdfDoc.numPages
  loading.value = false

  await renderPage(1)
  new ResizeObserver(() => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => { if (!liquid.value) renderPage(currentPage.value) }, 150)
  }).observe(stageEl.value)

  // Ctrl/Cmd + scroll (and trackpad pinch) zoom — needs a non-passive listener
  stageEl.value.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)

  extractHeadlines()
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('click', closePopovers)
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
})

function closePopovers() {
  settingsOpen.value = false
}

/* ────────────────────────── rendering ────────────────────────── */
async function renderPage(num) {
  if (!pdfDoc || !canvasEl.value) return
  const token = ++renderToken
  if (activeRenderTask) { try { activeRenderTask.cancel() } catch {} }

  const page = await pdfDoc.getPage(num)
  if (token !== renderToken) return

  const stage = stageEl.value
  // remember where the user was looking while zoomed (centre ratios)
  const keepScroll = zoom.value > 1 && stage.scrollWidth > stage.clientWidth
  const rx = keepScroll ? (stage.scrollLeft + stage.clientWidth / 2) / stage.scrollWidth : 0.5
  const ry = keepScroll ? (stage.scrollTop + stage.clientHeight / 2) / stage.scrollHeight : 0

  const base = page.getViewport({ scale: 1 })
  const fit = Math.min(stage.clientWidth / base.width, stage.clientHeight / base.height)
  const scale = fit * zoom.value
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
  const vp = page.getViewport({ scale: scale * dpr })

  const canvas = canvasEl.value
  const ctx = canvas.getContext('2d')
  canvas.width = vp.width
  canvas.height = vp.height
  canvas.style.width = `${vp.width / dpr}px`
  canvas.style.height = `${vp.height / dpr}px`

  activeRenderTask = page.render({ canvasContext: ctx, viewport: vp })
  try { await activeRenderTask.promise } catch (e) { if (e?.name !== 'RenderingCancelledException') console.error(e) }
  activeRenderTask = null
  if (token !== renderToken) return

  // commit zoom: drop the temporary CSS scale now that the crisp render is in place
  lastRenderedZoom = zoom.value
  if (holderEl.value) holderEl.value.style.transform = ''
  await nextTick()
  if (zoom.value > 1) {
    stage.scrollLeft = rx * stage.scrollWidth - stage.clientWidth / 2
    stage.scrollTop = ry * stage.scrollHeight - stage.clientHeight / 2
  }
}

/* ────────────────────────── zoom ────────────────────────── */
function setZoom(z) {
  z = Math.min(MAX_ZOOM, Math.max(1, z))
  if (Math.abs(z - 1) < 0.08) z = 1
  zoom.value = z
  // instant visual feedback via CSS scale, then debounce a crisp re-render
  if (holderEl.value && lastRenderedZoom > 0) {
    holderEl.value.style.transformOrigin = 'center top'
    holderEl.value.style.transform = z === lastRenderedZoom ? '' : `scale(${z / lastRenderedZoom})`
  }
  clearTimeout(zoomTimer)
  zoomTimer = setTimeout(() => renderPage(currentPage.value), 220)
}
function zoomIn() { setZoom(zoom.value * 1.35) }
function zoomOut() { setZoom(zoom.value / 1.35) }
function onDblClick() {
  clearTimeout(clickTimer)
  setZoom(zoom.value > 1 ? 1 : 2.2)
}
function onWheel(e) {
  if (!e.ctrlKey && !e.metaKey) return
  e.preventDefault()
  setZoom(zoom.value * (e.deltaY < 0 ? 1.12 : 1 / 1.12))
}

/* drag-to-pan with the mouse while zoomed */
function onDragStart(e) {
  if (zoom.value <= 1 || e.button !== 0) return
  drag = { x: e.clientX, y: e.clientY, sl: stageEl.value.scrollLeft, st: stageEl.value.scrollTop, moved: false }
}
function onDragMove(e) {
  if (!drag) return
  const dx = e.clientX - drag.x
  const dy = e.clientY - drag.y
  if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true
  stageEl.value.scrollLeft = drag.sl - dx
  stageEl.value.scrollTop = drag.st - dy
}
function onDragEnd() {
  if (drag?.moved) lastTouchNav = Date.now() // suppress the click that follows a pan
  drag = null
}

/* ────────────────────────── navigation ────────────────────────── */
function go(dir) {
  const target = currentPage.value + dir
  if (target < 1 || target > pageCount.value) return
  if (!liquid.value) animateTurn(dir)
  currentPage.value = target
  if (liquid.value) liquidEl.value?.scrollTo({ top: 0 })
  else renderPage(target)
}

function jumpTo(page) {
  article.value = null
  if (page === currentPage.value) return
  const dir = page >= currentPage.value ? 1 : -1
  if (!liquid.value) animateTurn(dir)
  currentPage.value = page
  if (liquid.value) liquidEl.value?.scrollTo({ top: 0 })
  else renderPage(page)
}

function toggleLiquid() {
  liquid.value = !liquid.value
  settingsOpen.value = false
  if (!liquid.value) {
    zoom.value = 1
    lastRenderedZoom = 1
    nextTick(() => renderPage(currentPage.value))
  }
}

function animateTurn(dir) {
  const mode = settings.pageTurn
  if (mode === 'none' || !canvasEl.value?.width) return
  try {
    overlayImg.value.src = canvasEl.value.toDataURL('image/jpeg', 0.75)
  } catch { return }
  const ov = overlayEl.value
  ov.style.width = canvasEl.value.style.width
  ov.style.height = canvasEl.value.style.height
  overlayClass.value = ''
  // force reflow so the animation restarts cleanly
  void ov.offsetWidth
  overlayClass.value = `show turn-${mode}-${dir > 0 ? 'fwd' : 'back'}`
  clearTimeout(ov._t)
  ov._t = setTimeout(() => { overlayClass.value = '' }, 520)
}

function scrub(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
  const target = Math.max(1, Math.round(ratio * pageCount.value))
  jumpTo(target)
}

/* tap zones: left third = back, right third = forward, centre = immersive toggle */
function onStageClick(e) {
  if (Date.now() - lastTouchNav < 600) return
  clearTimeout(clickTimer)
  clickTimer = setTimeout(() => {
    if (zoom.value > 1) return           // panning mode — don't hijack taps
    const rect = stageEl.value.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    if (settings.tapZones && x < 0.3) go(-1)
    else if (settings.tapZones && x > 0.7) go(1)
    else chromeVisible.value = !chromeVisible.value
  }, 240)
}

function onTouchStart(e) {
  if (e.touches.length === 2 && !liquid.value) {
    // pinch begins
    const [a, b] = e.touches
    pinch = { d: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY), z: zoom.value, target: zoom.value }
    touchStart = null
    return
  }
  if (e.touches.length !== 1) { touchStart = null; return }
  touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() }
}
function onTouchMove(e) {
  if (!pinch || e.touches.length !== 2) return
  const [a, b] = e.touches
  const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
  pinch.target = Math.min(MAX_ZOOM, Math.max(1, pinch.z * (d / pinch.d)))
  // live preview via CSS scale; the crisp render happens on release
  if (holderEl.value && lastRenderedZoom > 0) {
    holderEl.value.style.transformOrigin = 'center top'
    holderEl.value.style.transform = `scale(${pinch.target / lastRenderedZoom})`
  }
}
function onTouchEnd(e) {
  if (pinch) {
    if (e.touches.length < 2) {
      lastTouchNav = Date.now()
      setZoom(pinch.target)
      pinch = null
      touchStart = null
    }
    return
  }
  if (!touchStart || (zoom.value > 1 && !liquid.value)) return
  const dx = e.changedTouches[0].clientX - touchStart.x
  const dy = e.changedTouches[0].clientY - touchStart.y
  const horizontal = liquid.value ? Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6 : Math.abs(dx) > 55 && Math.abs(dy) < 90
  if (horizontal && Date.now() - touchStart.t < 600) {
    lastTouchNav = Date.now()
    go(dx < 0 ? 1 : -1)
  }
  touchStart = null
}

function onKey(e) {
  if (e.key === 'Escape') {
    if (article.value) article.value = null
    else if (drawerOpen.value) drawerOpen.value = false
    else if (settingsOpen.value) settingsOpen.value = false
    return
  }
  if (article.value) return
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') go(1)
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1)
  if (!liquid.value && (e.key === '+' || e.key === '=')) zoomIn()
  if (!liquid.value && (e.key === '-' || e.key === '_')) zoomOut()
  if (e.key.toLowerCase() === 'l') toggleLiquid()
}

/* keep chrome usable: closing liquid mode re-fits the page */
watch(liquid, (on) => { if (on) settingsOpen.value = false })

/* ────────────────────────── headline extraction ────────────────────────── */
function openArticle(h) {
  article.value = h
}

async function extractHeadlines() {
  extracting.value = true
  const found = []
  const seen = new Set()

  const isJunk = (s) =>
    /daily graphic/i.test(s) || /^page \d+$/i.test(s) || /^\d{1,3}$/.test(s) ||
    /^(www\.|graphic online)/i.test(s)

  // turn a run of text items into byline + readable paragraphs (handles drop caps & hyphenation)
  const buildParas = (bodyItems) => {
    let byline = ''
    let raw = ''
    let dropCap = false
    for (const it of bodyItems) {
      if (/^[A-Z]$/.test(it.str) && it.size > 60) { // giant drop-cap letter, e.g. "T" of "THE"
        raw += (raw ? ' ' : '') + it.str
        dropCap = true
        continue
      }
      if (!byline && /^by [a-z]/i.test(it.str) && it.str.length < 60) { byline = it.str; continue }
      if (dropCap) { raw += it.str; dropCap = false }
      else if (raw.endsWith('-')) raw = raw.slice(0, -1) + it.str
      else raw += (raw ? ' ' : '') + it.str
      if (raw.length > 12000) break
    }
    raw = raw.replace(/\s+/g, ' ').trim()
    const sentences = raw.match(/[^.!?]+[.!?]+["””']?\s*/g) || (raw ? [raw] : [])
    const paragraphs = []
    for (let i = 0; i < sentences.length; i += 3) {
      const para = sentences.slice(i, i + 3).join('').trim()
      if (para.length > 2) paragraphs.push(para)
    }
    return { byline, paragraphs }
  }

  for (let p = 1; p <= pdfDoc.numPages; p++) {
    try {
      const page = await pdfDoc.getPage(p)
      const tc = await page.getTextContent()
      const items = tc.items
        .map((it) => ({ str: (it.str || '').trim(), size: Math.abs(it.transform[3]) || it.height || 0 }))
        .filter((it) => it.str.length > 0)
      if (!items.length) { pageBlocks.value = { ...pageBlocks.value, [p]: [] }; continue }

      const sizes = items.map((i) => i.size).filter((s) => s > 0).sort((a, b) => a - b)
      const median = sizes[Math.floor(sizes.length / 2)] || 9
      const thr = Math.max(14, median * 1.6)

      const isHeadlineItem = (it) =>
        it.size >= thr && it.size <= 64 &&
        /[a-zA-Z]{2,}/.test(it.str) && !isJunk(it.str)

      const bodyFilter = (it) =>
        (it.size < thr && it.size >= median * 0.6 && !isJunk(it.str)) ||
        (it.size > 60 && /^[A-Z]$/.test(it.str)) // keep drop caps

      // group consecutive headline items of similar size
      const groups = []
      let cur = null
      items.forEach((it, idx) => {
        if (isHeadlineItem(it)) {
          if (cur && Math.max(cur.size, it.size) / Math.min(cur.size, it.size) < 1.25 && idx - cur.lastIdx <= 2) {
            if (cur.text.endsWith('-')) cur.text = cur.text.slice(0, -1) + it.str
            else cur.text += ' ' + it.str
            cur.lastIdx = idx
          } else {
            if (cur) groups.push(cur)
            cur = { text: it.str, size: it.size, startIdx: idx, lastIdx: idx }
          }
        }
      })
      if (cur) groups.push(cur)

      const valid = groups.filter((g) => {
        const t = g.text.replace(/\s+/g, ' ').trim()
        return t.length >= 12 && t.length <= 160 && /[a-zA-Z]/.test(t) &&
          !/^\d+$/.test(t) && !/^[—–•\-]/.test(t)
      })

      /* ── build Liquid Mode blocks: [intro text] → (headline → byline → paragraphs)* ── */
      const blocks = []
      const ranges = []
      if (!valid.length) {
        ranges.push({ s: 0, e: items.length, g: null })
      } else {
        if (valid[0].startIdx > 0) ranges.push({ s: 0, e: valid[0].startIdx, g: null })
        valid.forEach((g, gi) =>
          ranges.push({ s: g.lastIdx + 1, e: gi + 1 < valid.length ? valid[gi + 1].startIdx : items.length, g })
        )
      }

      valid.forEach((g, gi) => {
        const title = g.text.replace(/\s+/g, ' ').trim()
        const dedupeKey = title.toLowerCase().slice(0, 60)
        if (seen.has(dedupeKey)) return
        seen.add(dedupeKey)
        const endIdx = gi + 1 < valid.length ? valid[gi + 1].startIdx : items.length
        const { byline, paragraphs } = buildParas(items.slice(g.lastIdx + 1, endIdx).filter(bodyFilter))
        found.push({ id: `${p}-${gi}`, page: p, title, byline, paragraphs })
      })

      for (const r of ranges) {
        if (r.g) blocks.push({ type: 'h', text: r.g.text.replace(/\s+/g, ' ').trim() })
        const { byline, paragraphs } = buildParas(items.slice(r.s, r.e).filter(bodyFilter))
        if (byline) blocks.push({ type: 'byline', text: byline })
        paragraphs.forEach((t, i) => blocks.push({ type: 'p', text: t, lede: r.g && i === 0 }))
      }
      pageBlocks.value = { ...pageBlocks.value, [p]: blocks }

      // publish progressively so the sidebar fills as we scan
      headlines.value = [...found]
    } catch (e) {
      console.warn('extract failed on page', p, e)
    }
    await new Promise((r) => setTimeout(r, 0))
  }
  extracting.value = false
}
</script>

<style scoped>
/* ═══════════════ THEMES ═══════════════ */
.reader {
  --bg: #efe7d3;
  --panel: #fbf6ea;
  --panel-2: #f4ecd8;
  --ink: #33291e;
  --ink-dim: #8a7d6a;
  --line: #e0d5bc;
  --accent: #dc2626;
  --accent-ink: #fff;
  --canvas-filter: sepia(0.28) brightness(0.99);
  --shadow: 0 10px 40px rgba(80, 60, 20, 0.25);
}
.reader[data-theme='light'] {
  --bg: #f9fafb;
  --panel: #ffffff;
  --panel-2: #f3f4f6;
  --ink: #111827;
  --ink-dim: #6b7280;
  --line: #e5e7eb;
  --accent: #dc2626;
  --accent-ink: #fff;
  --canvas-filter: none;
  --shadow: 0 10px 40px rgba(20, 30, 60, 0.18);
}
.reader[data-theme='dark'] {
  --bg: #0f1115;
  --panel: #191c22;
  --panel-2: #21252d;
  --ink: #e6e4df;
  --ink-dim: #8d919b;
  --line: #2c3038;
  --accent: #ef4444;
  --accent-ink: #1a1405;
  --canvas-filter: invert(0.92) hue-rotate(180deg) contrast(0.92) brightness(1.05);
  --shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
}

.reader {
  height: 100%;
  min-height: 800px;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--ink);
  overflow: hidden;
  transition: background 0.3s;
}

/* ═══════════════ TOP BAR ═══════════════ */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--panel);
  border-bottom: 1px solid var(--line);
  z-index: 30;
}
.brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
.brand-mark {
  width: 34px; height: 34px; border-radius: 8px;
  background: var(--accent); color: var(--accent-ink);
  display: grid; place-items: center;
  font-weight: 800; font-size: 19px; font-family: Georgia, serif;
  flex: none;
}
.brand-text { display: flex; flex-direction: column; line-height: 1.15; min-width: 0; }
.brand-text strong { font-size: 15px; letter-spacing: 0.2px; }
.brand-sub { font-size: 11.5px; color: var(--ink-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.topbar-actions { display: flex; align-items: center; gap: 8px; }
.page-chip {
  font-size: 12.5px; font-variant-numeric: tabular-nums;
  background: var(--panel-2); border: 1px solid var(--line);
  padding: 5px 10px; border-radius: 999px; color: var(--ink-dim);
}
.icon-btn {
  height: 36px; min-width: 36px; padding: 0 8px;
  border-radius: 9px; border: 1px solid var(--line);
  background: var(--panel-2); color: var(--ink);
  cursor: pointer; display: inline-flex; align-items: center; justify-content: center;
  font-size: 14px; transition: 0.15s;
}
.icon-btn:hover { border-color: var(--accent); color: var(--accent); }
.icon-btn.active { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); }
.aa-btn { font-family: Georgia, serif; font-weight: 700; letter-spacing: 1px; }
.headlines-btn { display: none; }

.zoom-group { display: flex; align-items: center; gap: 4px; }
.zoom-group .zg { min-width: 32px; height: 32px; font-size: 17px; font-weight: 700; padding: 0; }
.zoom-group .zg:disabled { opacity: 0.35; cursor: default; }
.zoom-pct {
  min-width: 52px; height: 32px; border-radius: 8px;
  border: 1px solid var(--line); background: transparent; color: var(--ink-dim);
  font-size: 12px; font-variant-numeric: tabular-nums; cursor: pointer;
}
.zoom-pct:hover { color: var(--accent); border-color: var(--accent); }
.liquid-btn { gap: 5px; }
.liquid-label { font-size: 12.5px; font-weight: 600; }

/* ═══════════════ SETTINGS POPOVER ═══════════════ */
.settings-pop {
  position: absolute; top: 58px; right: 14px; z-index: 60;
  width: 300px; max-width: calc(100vw - 24px);
  background: var(--panel); border: 1px solid var(--line);
  border-radius: 14px; box-shadow: var(--shadow);
  padding: 14px 16px;
}
.set-row { margin-bottom: 13px; }
.set-row > label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; color: var(--ink-dim); margin-bottom: 7px; }
.seg { display: flex; gap: 6px; flex-wrap: wrap; }
.seg button {
  flex: 1; min-width: 56px; padding: 7px 6px; font-size: 12.5px;
  border-radius: 8px; border: 1.5px solid var(--line);
  background: var(--panel-2); color: var(--ink); cursor: pointer;
}
.seg button.on { border-color: var(--accent); box-shadow: 0 0 0 1.5px var(--accent); font-weight: 700; }
.toggle-row { display: flex; align-items: center; justify-content: space-between; }
.toggle-row > label { margin: 0; text-transform: none; letter-spacing: 0; font-size: 13.5px; color: var(--ink); }
.switch {
  width: 42px; height: 24px; border-radius: 999px; border: none; cursor: pointer;
  background: var(--line); position: relative; transition: 0.2s; flex: none;
}
.switch i {
  position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
  background: #fff; border-radius: 50%; transition: 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.switch.on { background: var(--accent); }
.switch.on i { left: 21px; }
.set-hint { font-size: 11.5px; color: var(--ink-dim); line-height: 1.5; margin: 4px 0 0; }
.set-divider {
  display: flex; align-items: center; gap: 10px; margin: 14px 0 12px;
  font-size: 11px; letter-spacing: 1.4px; text-transform: uppercase;
  color: var(--accent); font-weight: 800;
}
.set-divider::before, .set-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
.size-ctl { display: flex; align-items: center; gap: 10px; }
.size-ctl input[type='range'] { flex: 1; accent-color: var(--accent); }
.size-btn {
  border: 1px solid var(--line); background: var(--panel-2); color: var(--ink);
  border-radius: 8px; cursor: pointer; font-family: Georgia, serif; font-weight: 700;
  width: 34px; height: 30px;
}
.size-btn:hover { border-color: var(--accent); color: var(--accent); }
.small-a { font-size: 12px; }
.big-a { font-size: 18px; }

/* ═══════════════ MAIN LAYOUT ═══════════════ */
.main { flex: 1; display: flex; min-height: 0; position: relative; }

.side {
  width: 250px; flex: none;
  background: var(--panel);
  display: flex; flex-direction: column; min-height: 0;
}
.side:first-child { border-right: 1px solid var(--line); }
.side:last-child { border-left: 1px solid var(--line); }
.side-head {
  padding: 13px 16px 9px; display: flex; align-items: center; gap: 8px;
  border-bottom: 1px solid var(--line);
}
.side-head h3 {
  margin: 0; font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase;
  color: var(--ink-dim); font-weight: 700;
}
.mini-spin {
  width: 12px; height: 12px; border-radius: 50%;
  border: 2px solid var(--line); border-top-color: var(--accent);
  animation: spin 0.8s linear infinite;
}
.side-scroll { flex: 1; overflow-y: auto; padding: 10px; scrollbar-width: thin; }

.headline-card {
  display: flex; gap: 9px; align-items: flex-start; width: 100%;
  text-align: left; background: var(--panel-2);
  border: 1px solid var(--line); border-radius: 10px;
  padding: 10px 11px; margin-bottom: 8px; cursor: pointer;
  color: var(--ink); transition: 0.15s;
}
.headline-card:hover { border-color: var(--accent); transform: translateY(-1px); }
.hl-page {
  flex: none; font-size: 10.5px; font-weight: 800;
  background: var(--accent); color: var(--accent-ink);
  border-radius: 6px; padding: 3px 6px; margin-top: 1px;
}
.hl-title {
  font-family: 'Sora', system-ui, sans-serif;
  font-size: 13.5px; line-height: 1.35; font-weight: 600;
}
.skeletons i {
  display: block; height: 52px; border-radius: 10px; margin-bottom: 8px;
  background: linear-gradient(100deg, var(--panel-2) 40%, var(--line) 50%, var(--panel-2) 60%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
@keyframes shimmer { to { background-position: -200% 0; } }

/* ═══════════════ STAGE ═══════════════ */
.stage-wrap { flex: 1; position: relative; min-width: 0; display: flex; }
.stage {
  flex: 1; display: flex; align-items: center; justify-content: center;
  overflow: hidden; position: relative; cursor: pointer; user-select: none;
  -webkit-user-select: none; touch-action: pan-x pan-y;
}
.stage.zoomed { overflow: auto; display: block; text-align: center; cursor: grab; }
.stage.zoomed .canvas-holder { margin: 0 auto; }
.canvas-holder { position: relative; display: inline-block; perspective: 1600px; }
.page-canvas {
  display: block; background: #fff;
  box-shadow: var(--shadow);
  border-radius: 3px;
  filter: var(--canvas-filter);
  transition: filter 0.3s;
}

/* page-turn overlay */
.turn-overlay {
  position: absolute; inset: 0; z-index: 5; display: none;
  transform-style: preserve-3d; pointer-events: none;
  border-radius: 3px; overflow: hidden;
}
.turn-overlay img { width: 100%; height: 100%; display: block; filter: var(--canvas-filter); }
.turn-shade { position: absolute; inset: 0; opacity: 0; }
.turn-overlay.show { display: block; }

.turn-flip-fwd { transform-origin: left center; animation: flipFwd 0.5s cubic-bezier(0.4, 0.1, 0.6, 1) forwards; }
.turn-flip-back { transform-origin: right center; animation: flipBack 0.5s cubic-bezier(0.4, 0.1, 0.6, 1) forwards; }
.turn-flip-fwd .turn-shade { background: linear-gradient(to right, rgba(0,0,0,0.45), transparent 60%); animation: shade 0.5s forwards; }
.turn-flip-back .turn-shade { background: linear-gradient(to left, rgba(0,0,0,0.45), transparent 60%); animation: shade 0.5s forwards; }
@keyframes flipFwd { 0% { transform: rotateY(0); } 100% { transform: rotateY(-105deg); opacity: 0.4; } }
@keyframes flipBack { 0% { transform: rotateY(0); } 100% { transform: rotateY(105deg); opacity: 0.4; } }
@keyframes shade { 0% { opacity: 0; } 60% { opacity: 1; } 100% { opacity: 1; } }

.turn-slide-fwd { animation: slideFwd 0.38s ease forwards; }
.turn-slide-back { animation: slideBack 0.38s ease forwards; }
@keyframes slideFwd { to { transform: translateX(-108%); } }
@keyframes slideBack { to { transform: translateX(108%); } }

.turn-fade-fwd, .turn-fade-back { animation: fadeOut 0.32s ease forwards; }
@keyframes fadeOut { to { opacity: 0; } }

/* loader */
.loader {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px;
  color: var(--ink-dim); font-size: 14px; z-index: 10; background: var(--bg);
}
.loader-ring {
  width: 44px; height: 44px; border-radius: 50%;
  border: 4px solid var(--line); border-top-color: var(--accent);
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ═══════════════ LIQUID MODE ═══════════════ */
.liquid-view {
  flex: 1; overflow-y: auto; overflow-x: hidden;
  scrollbar-width: thin; overscroll-behavior: contain;
}
.liquid-inner {
  max-width: 660px; margin: 0 auto;
  padding: 26px 26px 90px; color: var(--ink);
  animation: lqIn 0.35s ease;
}
@keyframes lqIn { from { opacity: 0; transform: translateY(10px); } }
.lq-pagechip {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 800; letter-spacing: 1.4px; text-transform: uppercase;
  color: var(--accent); border: 1px solid var(--line); background: var(--panel);
  border-radius: 999px; padding: 6px 13px; margin-bottom: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.lq-drop { font-size: 12px; }
.lq-h {
  font-size: 1.5em; line-height: 1.2; margin: 1.4em 0 0.4em;
  font-weight: 800; letter-spacing: -0.2px;
}
.lq-h:first-of-type { margin-top: 0.2em; }
.lq-byline { font-size: 0.78em; color: var(--ink-dim); font-style: italic; margin: 0 0 0.9em; }
.lq-p { line-height: 1.75; margin: 0 0 1em; }
.lq-p.lede::first-letter {
  font-size: 2.75em; float: left; line-height: 0.84;
  padding: 0.06em 0.12em 0 0; font-weight: 700; color: var(--accent);
}
.lq-endmark { color: var(--accent); font-size: 0.7em; margin-top: 2em; }
.lq-empty {
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  text-align: center; color: var(--ink-dim); padding: 15vh 20px 0;
  font-size: 15px; font-family: 'Segoe UI', system-ui, sans-serif;
}
.lq-empty .solid-btn { margin-top: 8px; }

/* arrows */
.nav-arrow {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 46px; height: 76px; z-index: 20;
  border: 1px solid var(--line); background: var(--panel);
  color: var(--ink); cursor: pointer;
  display: grid; place-items: center;
  box-shadow: var(--shadow); transition: 0.15s; opacity: 0.92;
}
.nav-arrow.prev { left: 10px; border-radius: 12px; }
.nav-arrow.next { right: 10px; border-radius: 12px; }
.nav-arrow:hover:not(:disabled) { color: var(--accent); border-color: var(--accent); opacity: 1; }
.nav-arrow:disabled { opacity: 0.25; cursor: default; }

/* ═══════════════ PROGRESS ═══════════════ */
.progressbar { padding: 8px 22px 12px; background: var(--panel); border-top: 1px solid var(--line); }
.prog-track { position: relative; height: 14px; display: flex; align-items: center; cursor: pointer; }
.prog-track::before { content: ''; position: absolute; left: 0; right: 0; height: 4px; border-radius: 4px; background: var(--line); }
.prog-fill { position: absolute; left: 0; height: 4px; border-radius: 4px; background: var(--accent); transition: width 0.25s; }
.prog-knob {
  position: absolute; width: 13px; height: 13px; border-radius: 50%;
  background: var(--accent); transform: translateX(-50%);
  box-shadow: 0 1px 4px rgba(0,0,0,0.35); transition: left 0.25s;
}
.prog-label { text-align: center; font-size: 11.5px; color: var(--ink-dim); margin-top: 5px; font-variant-numeric: tabular-nums; }

/* ═══════════════ DRAWER (mobile) ═══════════════ */
.scrim { position: fixed; inset: 0; background: rgba(10, 10, 14, 0.55); z-index: 80; backdrop-filter: blur(2px); }
.drawer {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
  background: var(--panel); border-radius: 18px 18px 0 0;
  max-height: 72vh; display: flex; flex-direction: column;
  box-shadow: 0 -12px 50px rgba(0,0,0,0.4);
}
.drawer-grip { width: 42px; height: 4.5px; border-radius: 4px; background: var(--line); margin: 10px auto 2px; }
.drawer-head { display: flex; align-items: center; justify-content: space-between; padding: 8px 18px; }
.drawer-head h3 { margin: 0; font-size: 15px; }
.drawer-scroll { overflow-y: auto; padding: 4px 14px 22px; }
.drawer-empty { text-align: center; color: var(--ink-dim); font-size: 13.5px; padding: 22px 0; }

/* ═══════════════ ARTICLE MODAL ═══════════════ */
.modal-scrim { z-index: 100; }
.article-modal {
  position: fixed; z-index: 110;
  top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: min(680px, calc(100vw - 28px));
  max-height: min(82vh, 780px);
  background: var(--panel); border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.45);
  display: flex; flex-direction: column; overflow: hidden;
}
.modal-close {
  position: absolute; top: 12px; right: 12px; z-index: 5;
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--line); background: var(--panel-2); color: var(--ink);
  cursor: pointer; font-size: 14px;
}
.modal-close:hover { color: var(--accent); border-color: var(--accent); }
.modal-scroll { overflow-y: auto; padding: 26px 30px 18px; scrollbar-width: thin; }
.art-kicker {
  font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase;
  color: var(--accent); font-weight: 800;
}
.art-title {
  font-family: 'Sora', system-ui, sans-serif;
  font-size: clamp(21px, 3.4vw, 30px); line-height: 1.18;
  margin: 8px 0 6px;
}
.art-byline { font-size: 13px; color: var(--ink-dim); font-style: italic; margin: 0 0 4px; }
.art-rule { border: none; border-top: 2px solid var(--accent); width: 64px; margin: 12px 0 16px; }
.art-para {
  font-family: 'Sora', system-ui, sans-serif;
  font-size: 16px; line-height: 1.72; margin: 0 0 14px;
}
.art-para.lede::first-letter {
  font-size: 2.9em; float: left; line-height: 0.85;
  padding: 4px 8px 0 0; font-weight: 700; color: var(--accent);
}
.art-para.dim { color: var(--ink-dim); font-style: italic; }
.modal-foot {
  display: flex; gap: 10px; justify-content: flex-end;
  padding: 13px 18px; border-top: 1px solid var(--line); background: var(--panel-2);
}
.ghost-btn {
  padding: 9px 16px; border-radius: 9px; font-size: 13.5px;
  border: 1px solid var(--line); background: transparent; color: var(--ink); cursor: pointer;
}
.solid-btn {
  padding: 9px 16px; border-radius: 9px; font-size: 13.5px; font-weight: 700;
  border: none; background: var(--accent); color: var(--accent-ink); cursor: pointer;
}
.solid-btn:hover, .ghost-btn:hover { filter: brightness(1.08); }

/* ═══════════════ TRANSITIONS ═══════════════ */
.fade-enter-active, .fade-leave-active { transition: opacity 0.22s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.sheet-enter-active, .sheet-leave-active { transition: transform 0.28s cubic-bezier(0.3, 0.9, 0.4, 1); }
.sheet-enter-from, .sheet-leave-to { transform: translateY(105%); }
.modal-enter-active, .modal-leave-active { transition: opacity 0.22s, transform 0.22s; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
.pop-enter-active, .pop-leave-active { transition: opacity 0.16s, transform 0.16s; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-8px); }

/* ═══════════════ RESPONSIVE ═══════════════ */
@media (max-width: 1100px) {
  .side { width: 212px; }
}
@media (max-width: 920px) {
  .side { display: none !important; }
  .headlines-btn { display: inline-flex; }
  .nav-arrow { width: 38px; height: 60px; opacity: 0.8; }
  .nav-arrow.prev { left: 6px; }
  .nav-arrow.next { right: 6px; }
  .brand-sub { display: none; }
  .page-chip { display: none; }
  .zoom-group { display: none; } /* pinch & double-tap cover zoom on touch */
  .liquid-label { display: none; }
  .modal-scroll { padding: 22px 20px 14px; }
  .liquid-inner { padding: 20px 18px 80px; }
}
</style>

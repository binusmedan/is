/* =====================================================================
   Deck Mini-Proyek Web Statis — helper wireframe & renderer bersama
   Dipakai oleh: mini-proyek.html (01–11) dan mini-proyek-12-21.html
   ===================================================================== */

/* ===================== Helper umum ===================== */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = n => String(n).padStart(2, '0');

const CURSOR = (style) => `<svg class="cursor" style="${style}" viewBox="0 0 16 16"><path d="M2 1l11 6.6-4.7 1.1L11 14l-2.1 1-2.6-5.3L3 12.6z" fill="#111827" stroke="#fff" stroke-width="1.2" stroke-linejoin="round"/></svg>`;

const HAND = (style) => `<svg class="cursor" style="${style}; width:17px; height:17px" viewBox="0 0 24 24"><path d="M9 11.5V4.6a1.6 1.6 0 0 1 3.2 0V10h.4V8.7a1.6 1.6 0 0 1 3.2 0v1.6h.3V9.6a1.6 1.6 0 0 1 3.2 0V15c0 3.4-2.6 6.2-6 6.2h-1.1c-2 0-3.5-.9-4.6-2.5L4.5 14.3a1.5 1.5 0 0 1 2.3-1.9L9 14.6z" fill="#fff" stroke="#111827" stroke-width="1.5" stroke-linejoin="round"/></svg>`;

/* Mockup jendela browser */
const browser = (url, inner, vpStyle = '') => `
  <div class="browser">
    <div class="bbar"><i></i><i></i><i></i><div class="url">${url}</div></div>
    <div class="vp" style="${vpStyle}">${inner}</div>
  </div>`;

/* Tabel wireframe. o: { cls, sticky, hover (index baris), padCell: [baris, kolom] } */
const T = (cols, rows, o = {}) => `
  <table class="wf-table ${o.cls || ''}">
    <thead><tr>${cols.map(c => `<th class="${o.sticky ? 'sticky' : ''}">${c}</th>`).join('')}</tr></thead>
    <tbody>${rows.map((r, i) => `<tr class="${o.hover === i ? 'is-hover' : ''}">${r.map((c, j) => `<td class="${o.padCell && o.padCell[0] === i && o.padCell[1] === j ? 'pad' : ''}">${c}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;

/* Form wireframe.
   field: { l: label, v: nilai, sel, area, err, ok, hint, w: lebar input (mis. '60%') }
   o: { cls, grid (field 2 kolom), btnHtml (ganti markup tombol) } */
const F = (title, fields, btn, o = {}) => {
  const fieldHTML = fields.map(f => `
      <div class="field ${f.err ? 'err' : ''} ${f.ok ? 'ok' : ''}">
        <label>${f.l}</label>
        <div class="input ${f.sel ? 'select' : ''} ${f.area ? 'area' : ''}" style="${f.w ? `width:${f.w}` : ''}">${f.v || ''}</div>
        ${f.hint ? `<small>${f.hint}</small>` : ''}
      </div>`).join('');
  return `
  <div class="wf-form ${o.cls || ''}">
    <div class="wf-title">${title}</div>
    ${o.grid ? `<div class="grid2">${fieldHTML}</div>` : fieldHTML}
    ${o.btnHtml !== undefined ? o.btnHtml : `<div class="btn">${btn}</div>`}
  </div>`;
};

/* Mockup dialog browser: alert / confirm / prompt */
const D = (type, msg, cap, o = {}) => `
  <div style="${o.style || ''}">
    ${cap ? `<div class="cap">${cap}</div>` : ''}
    <div class="dialog">
      <div class="dlg-head"><span>Halaman ini menyatakan</span><code>${type}()</code></div>
      <p>${msg}</p>
      ${type === 'prompt' ? `<div class="input">${o.val || ''}</div>` : ''}
      <div class="dlg-btns">${type === 'alert' ? '<span class="ok">OK</span>' : '<span>Batal</span><span class="ok">OK</span>'}</div>
    </div>
  </div>`;

/* ===================== Kategori (aksen pastel) ===================== */
const CATS = {
  akademik: { name: 'Akademik & Kampus',   acc: '#1F8A5B', bg: '#E2F3E9', soft: '#F4FAF6' },
  booking:  { name: 'Booking & Penyewaan', acc: '#C8612B', bg: '#FCE9DB', soft: '#FFF8F3' },
  event:    { name: 'Event & Komunitas',   acc: '#B83F6B', bg: '#FAE5EE', soft: '#FFF6F9' },
  sosial:   { name: 'Sosial & Keuangan',   acc: '#1A7C93', bg: '#DDF0F5', soft: '#F3FAFC' },
  jasa:     { name: 'Jasa & Konsumsi',     acc: '#4F6D8A', bg: '#E3EAF2', soft: '#F5F8FB' },
};

/* ===================== Renderer ===================== */
const stepBasic = (kind, label, s) => `
  <div class="step ${kind}">
    <div class="step-head"><span class="badge">${label}</span><h3>${s.title}</h3></div>
    <p>${s.desc}</p>
    <div class="chips">${s.chips.map(c => `<code>${esc(c)}</code>`).join('')}</div>
  </div>`;

const stepJS = s => `
  <div class="step js">
    <div class="step-head"><span class="badge">JS</span><h3>${s.title}</h3></div>
    <div class="fields"><span>Form</span>${s.fields.map(f => `<em>${f}</em>`).join('')}</div>
    <div class="rules">${s.rules.map(([w, t]) => `<div class="when">${w}</div><div class="arrow">→</div><div class="then">${esc(t)}</div>`).join('')}</div>
    ${s.tip ? `<div class="tip"><div>${s.tip}</div></div>` : ''}
  </div>`;

/**
 * Render seluruh deck ke #app.
 * @param {object}  cfg
 * @param {Array}   cfg.projects  data proyek
 * @param {number}  cfg.start     nomor modul pertama (mis. 12)
 * @param {number}  cfg.total     total modul di seluruh seri (untuk penanda "12 / 21")
 * @param {string}  cfg.series    judul seri di top bar
 */
function renderDeck({ projects, start = 1, total = projects.length, series }) {
  const dots = cur => projects.map((p, i) =>
    `<i class="${i === cur ? 'on' : ''}" style="--d:${CATS[p.cat].acc}"></i>`).join('');

  const renderPage = (p, i) => {
    const c = CATS[p.cat];
    const no = pad(start + i);
    return `
    <section class="page" id="p${i + 1}" style="--acc:${c.acc}; --acc-bg:${c.bg}; --acc-soft:${c.soft}">
      <header class="topbar">
        <span class="brand"><i></i>COSC6146064 · Programming for Business</span>
        <span>${series}</span>
      </header>
      <article class="card">
        <div class="card-head">
          <div class="num">${no}</div>
          <div>
            <div class="eyebrow">Modul ${no} · Studi Kasus</div>
            <h1 class="title">${p.title}</h1>
            <p class="subtitle">${p.sub}</p>
          </div>
          <span class="cat"><i></i>${c.name}</span>
        </div>
        <div class="card-body">
          <div class="visual">
            <div class="vis-top">
              <span class="vis-label">Wireframe</span>
              <span class="legend"><i class="lg-css"></i>Anotasi CSS<i class="lg-js"></i>Dialog JS</span>
            </div>
            <div class="vis-stage">${p.visual}</div>
          </div>
          <div class="steps">
            ${stepBasic('html', 'HTML', p.html)}
            ${stepBasic('css', 'CSS', p.css)}
            ${stepJS(p.js)}
          </div>
        </div>
      </article>
      <footer class="footer">
        <div class="check"><span>Checklist</span><b></b>Struktur HTML<b></b>Styling CSS<b></b>Validasi JS</div>
        <div class="progress">${dots(i)}<span>${no} / ${pad(total)}</span></div>
      </footer>
    </section>`;
  };

  document.getElementById('app').innerHTML = projects.map(renderPage).join('');

  // Pratinjau satu halaman: file.html#p3 (urutan halaman di dalam file)
  const m = location.hash.match(/^#p(\d+)$/);
  if (m) {
    document.body.classList.add('single');
    const el = document.getElementById('p' + m[1]);
    if (el) el.classList.add('show');
  }
}

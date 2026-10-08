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
          <div class="head-aside">
            <div class="aside-row">
              <label class="nim-field">
                <span>NIM</span>
                <input type="text" class="nim-input" inputmode="numeric" maxlength="10"
                       placeholder="27xxxxxxxx" autocomplete="off" spellcheck="false"
                       aria-label="NIM mahasiswa untuk modul ${no}">
              </label>
              <span class="cat"><i></i>${c.name}</span>
            </div>
            <div class="save-url" data-case-id="${no}">
              <div class="su-edit">
                <input type="url" class="url-input" placeholder="Paste link GitHub/Vercel proyek di sini..."
                       aria-label="URL proyek modul ${no}" autocomplete="url" spellcheck="false">
                <button type="button" class="save-btn">Save</button>
              </div>
              <div class="su-view" hidden>
                <span class="ok-icon" aria-hidden="true"><svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3 4.7-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                <a class="saved-link" target="_blank" rel="noopener noreferrer"></a>
                <button type="button" class="edit-btn" aria-label="Ubah URL proyek modul ${no}">Edit</button>
              </div>
            </div>
          </div>
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

  const app = document.getElementById('app');
  app.innerHTML = projects.map(renderPage).join('');
  initSaveUrl(app);

  // Pratinjau satu halaman: file.html#p3 (urutan halaman di dalam file)
  const m = location.hash.match(/^#p(\d+)$/);
  if (m) {
    document.body.classList.add('single');
    const el = document.getElementById('p' + m[1]);
    if (el) el.classList.add('show');
  }
}

/* ===================== Simpan URL Proyek (Supabase) ===================== */
// Endpoint REST tabel `tugas_mahasiswa` (kolom: nim_mahasiswa, nomor_kasus, url_proyek).
// Anon key memang publik di sisi klien — keamanan data diatur oleh RLS di Supabase.
// JANGAN pernah menaruh service_role key di file ini.
const SUPABASE_URL = 'https://fxgodohilfqabqkwrkre.supabase.co/rest/v1/tugas_mahasiswa';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Z29kb2hpbGZxYWJxa3dya3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjYxNDMsImV4cCI6MjA4MjkwMjE0M30.9wgs6w6buzkYVsEVVJnQ6HqM2MDlzWg0eilDqVAwfTE';

// NIM BINUS: tepat 10 digit angka. Sesuaikan pola ini jika format NIM berbeda.
const NIM_PATTERN = /^\d{10}$/;
// 1 kasus = 1 NIM: tiap kartu punya NIM sendiri, diingat di browser per nomor kasus.
const NIM_STORAGE_PREFIX = 'mini-proyek:nim:';

const readSavedNim = (nomorKasus) => {
  try { return localStorage.getItem(NIM_STORAGE_PREFIX + nomorKasus) || ''; } catch { return ''; }
};
const storeNim = (nomorKasus, nim) => {
  try { localStorage.setItem(NIM_STORAGE_PREFIX + nomorKasus, nim); } catch { /* storage diblokir: abaikan */ }
};

// NIM yang sedang diketik di kartu tempat `el` berada
const nimOfCard = (el) => el.closest('.head-aside').querySelector('.nim-input').value.trim();

// Valid jika diawali http:// atau https:// DAN bisa di-parse sebagai URL utuh.
const isValidProjectUrl = (value) => {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

// Insert satu baris ke Supabase (POST + JSON).
// nim & nomorKasus dikirim sebagai string ("2702xxxxxx", "01" … "21").
async function simpanUrlProyek(nim, nomorKasus, urlProyek) {
  const response = await fetch(SUPABASE_URL, {
    method: 'POST', // insert data baru
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal', // Supabase tidak perlu mengembalikan baris yang di-insert
    },
    // Nama key harus sama dengan nama kolom di tabel Supabase
    body: JSON.stringify({
      nim_mahasiswa: nim,
      nomor_kasus: nomorKasus,
      url_proyek: urlProyek,
    }),
  });

  if (!response.ok) {
    // Supabase/PostgREST mengirim detail error dalam JSON: { message, code, hint, details }
    let detail = `${response.status} ${response.statusText}`;
    try {
      const body = await response.json();
      if (body && body.message) detail = `${response.status} – ${body.message}`;
    } catch { /* body bukan JSON, pakai status saja */ }
    throw new Error(detail);
  }
  return response;
}

/* ---------- URL yang sudah tersimpan ---------- */
// Cache per NIM di browser: { "01": "https://...", "02": "..." }
const URLS_STORAGE_PREFIX = 'mini-proyek:urls:';

const readCachedUrls = (nim) => {
  try { return JSON.parse(localStorage.getItem(URLS_STORAGE_PREFIX + nim)) || {}; } catch { return {}; }
};
const cacheUrl = (nim, nomorKasus, url) => {
  try {
    const urls = readCachedUrls(nim);
    urls[nomorKasus] = url;
    localStorage.setItem(URLS_STORAGE_PREFIX + nim, JSON.stringify(urls));
  } catch { /* storage diblokir: abaikan */ }
};

// Ambil URL TERBARU per pasangan (NIM, nomor kasus) dari Supabase — satu request untuk banyak NIM.
// Hasil: { "2702123456|04": "https://..." }
// Butuh policy SELECT untuk anon. Jika ditolak RLS, Supabase mengembalikan [] → cache browser dipakai.
async function ambilUrlTersimpan(nims) {
  const params = new URLSearchParams({
    select: 'nim_mahasiswa,nomor_kasus,url_proyek',
    nim_mahasiswa: `in.(${nims.join(',')})`, // aman: NIM sudah lolos validasi 10 digit
    order: 'created_at.desc,id.desc',
  });
  const response = await fetch(`${SUPABASE_URL}?${params}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const latest = {};
  for (const row of await response.json()) {
    const key = `${String(row.nim_mahasiswa)}|${String(row.nomor_kasus).padStart(2, '0')}`;
    if (!(key in latest)) latest[key] = row.url_proyek; // baris pertama = terbaru
  }
  return latest;
}

// API GET: pengumpulan TERBARU untuk setiap nomor kasus (tanpa filter NIM),
// supaya NIM + URL tampil di perangkat mana pun tanpa perlu mengetik NIM dulu.
// Hasil: { "04": { nim: "2702123456", url: "https://...", waktu: "2026-10-08T05:12:00Z" } }
async function ambilTugasTerbaru() {
  const params = new URLSearchParams({
    select: 'nim_mahasiswa,nomor_kasus,url_proyek,created_at',
    order: 'created_at.desc,id.desc',
  });
  const response = await fetch(`${SUPABASE_URL}?${params}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const terbaru = {};
  for (const row of await response.json()) {
    const kasus = String(row.nomor_kasus).padStart(2, '0');
    if (!(kasus in terbaru)) { // baris pertama = terbaru
      terbaru[kasus] = { nim: String(row.nim_mahasiswa), url: row.url_proyek, waktu: row.created_at };
    }
  }
  return terbaru;
}

// Tampilan "tersimpan": link + tombol Edit. URL di-set lewat href/textContent (aman dari XSS).
const showSavedView = (group, url) => {
  const link = group.querySelector('.saved-link');
  link.href = url;
  link.textContent = url.replace(/^https?:\/\//i, '');
  link.title = url;
  group.dataset.savedUrl = url;
  group.querySelector('.su-edit').hidden = true;
  group.querySelector('.su-view').hidden = false;
  group.classList.add('is-done');
};

const showEditView = (group, value) => {
  group.querySelector('.su-view').hidden = true;
  group.querySelector('.su-edit').hidden = false;
  group.classList.remove('is-done');
  if (value !== undefined) group.querySelector('.url-input').value = value;
};

// Terapkan URL ke satu kartu. Kartu yang sedang diisi (mode edit) tidak diganggu.
const applySavedUrl = (group, url) => {
  if (url && isValidProjectUrl(url)) {
    showSavedView(group, url);
  } else if (group.classList.contains('is-done')) {
    delete group.dataset.savedUrl;
    showEditView(group, '');
  }
};

// Muat URL tersimpan untuk sekumpulan kartu, masing-masing memakai NIM di kartunya sendiri.
// 1) cache browser dulu (instan), 2) lalu data terbaru dari Supabase (satu request).
async function loadSavedUrls(groups) {
  const jobs = [];
  groups.forEach((group) => {
    const nim = nimOfCard(group);
    const token = String(Number(group.dataset.loadToken || 0) + 1);
    group.dataset.loadToken = token;

    if (!NIM_PATTERN.test(nim)) {
      applySavedUrl(group, null);
      return;
    }
    const cached = readCachedUrls(nim)[group.dataset.caseId];
    applySavedUrl(group, cached);
    jobs.push({ group, nim, token, cached });
  });
  if (!jobs.length) return;

  try {
    const remote = await ambilUrlTersimpan([...new Set(jobs.map((j) => j.nim))]);
    jobs.forEach(({ group, nim, token, cached }) => {
      if (group.dataset.loadToken !== token) return; // NIM kartu ini sudah diganti lagi
      applySavedUrl(group, remote[`${nim}|${group.dataset.caseId}`] || cached);
    });
  } catch (error) {
    console.warn('Gagal memuat URL tersimpan dari Supabase, memakai cache browser:', error);
  }
}

// Saat halaman dibuka:
// 1) tampilkan cache browser (instan), 2) isi NIM + URL tiap kartu dari data terbaru di Supabase.
async function loadAwal(groups) {
  groups.forEach((group) => {
    const nim = nimOfCard(group);
    if (NIM_PATTERN.test(nim)) applySavedUrl(group, readCachedUrls(nim)[group.dataset.caseId]);
  });

  let terbaru;
  try {
    terbaru = await ambilTugasTerbaru();
  } catch (error) {
    console.warn('Gagal memuat data dari Supabase, memakai cache browser:', error);
    return;
  }

  groups.forEach((group) => {
    const caseId = group.dataset.caseId;
    const data = terbaru[caseId];
    if (!data || !NIM_PATTERN.test(data.nim)) return; // belum ada pengumpulan di server

    const nimInput = group.closest('.head-aside').querySelector('.nim-input');
    if (document.activeElement === nimInput) return;   // jangan timpa yang sedang diketik

    nimInput.value = data.nim;
    storeNim(caseId, data.nim);
    cacheUrl(data.nim, caseId, data.url);
    group.dataset.loadToken = String(Number(group.dataset.loadToken || 0) + 1); // batalkan load lama
    applySavedUrl(group, data.url);
  });
}

async function handleSaveClick(event) {
  const btn = event.currentTarget;
  const group = btn.closest('.save-url');
  const input = group.querySelector('.url-input');
  const nimInput = btn.closest('.head-aside').querySelector('.nim-input');
  const nim = nimInput.value.trim();
  const url = input.value.trim();

  // 1a. Validasi NIM: wajib diisi & 10 digit angka
  if (!NIM_PATTERN.test(nim)) {
    alert('NIM tidak valid! NIM harus 10 digit angka.');
    nimInput.focus();
    return;
  }

  // 1b. Validasi URL: tidak kosong & format URL benar
  if (!url || !isValidProjectUrl(url)) {
    alert('URL tidak valid!');
    input.focus();
    return;
  }

  // 2. Status loading
  btn.textContent = 'Saving...';
  btn.disabled = true;

  // 3. Kirim data → jika sukses, kartu berganti ke tampilan "tersimpan"
  try {
    await simpanUrlProyek(nim, group.dataset.caseId, url);
    cacheUrl(nim, group.dataset.caseId, url);
    showSavedView(group, url);
  } catch (error) {
    console.error('Error:', error);
    alert(`Terjadi kesalahan saat menyimpan URL.\n${error.message}`);
  } finally {
    btn.textContent = 'Save';
    btn.disabled = false;
  }
}

function initSaveUrl(root) {
  const groups = root.querySelectorAll('.save-url');

  groups.forEach((group) => {
    const nimInput = group.closest('.head-aside').querySelector('.nim-input');
    const caseId = group.dataset.caseId;
    let nimTimer;

    // NIM khusus kasus ini (tidak disinkronkan ke kartu lain)
    nimInput.value = readSavedNim(caseId);

    // Ketik NIM → simpan untuk kasus ini, lalu muat URL milik NIM tsb (jeda singkat saat mengetik)
    nimInput.addEventListener('input', () => {
      storeNim(caseId, nimInput.value.trim());
      clearTimeout(nimTimer);
      nimTimer = setTimeout(() => loadSavedUrls([group]), 300);
    });

    // Enter di kolom NIM = Save pada kartu yang sama (hanya jika kartu sedang mode edit)
    nimInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !group.classList.contains('is-done')) {
        group.querySelector('.save-btn').click();
      }
    });
  });

  groups.forEach((group) => {
    const input = group.querySelector('.url-input');
    const btn = group.querySelector('.save-btn');
    const editBtn = group.querySelector('.edit-btn');

    btn.addEventListener('click', handleSaveClick);

    // Enter = Save, Escape = batal edit (kembali ke URL tersimpan)
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') btn.click();
      if (e.key === 'Escape' && group.dataset.savedUrl) showSavedView(group, group.dataset.savedUrl);
    });

    // Edit → kembali ke input, terisi URL lama
    editBtn.addEventListener('click', () => {
      showEditView(group, group.dataset.savedUrl || '');
      input.focus();
      input.select();
    });
  });

  // Saat halaman dibuka: NIM + URL tiap kartu diambil dari Supabase (berlaku di semua perangkat)
  loadAwal([...groups]);
}

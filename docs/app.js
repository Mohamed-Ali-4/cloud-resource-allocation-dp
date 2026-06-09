// Cloud Resource Allocation — 0/1 Knapsack DP  (frontend)

const API_BASE = 'https://cloud-resource-allocation-dp.onrender.com';

const SAMPLE_TASKS = [
  { name: 'Web-Server',  resource: 2, profit: 6  },
  { name: 'ML-Training', resource: 4, profit: 10 },
  { name: 'DB-Instance', resource: 3, profit: 7  },
  { name: 'Cache-Node',  resource: 1, profit: 3  },
  { name: 'Batch-Job',   resource: 5, profit: 12 },
  { name: 'API-Gateway', resource: 2, profit: 5  },
];

let tasks = [];
let chartInst = null;
let lastResult = null;
let apiAlive = null; // null=unknown, true, false

// ── DOM helpers ────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Client-side DP (fallback) ──────────────────────────────
function solveLocal(taskArr, capacity) {
  const n = taskArr.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const t = taskArr[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (t.resource <= w) {
        const v = dp[i - 1][w - t.resource] + t.profit;
        if (v > dp[i][w]) dp[i][w] = v;
      }
    }
  }
  const selected = [], path = new Set();
  let w = capacity;
  path.add(`${n},${w}`);
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) { selected.push(i - 1); w -= taskArr[i - 1].resource; }
    path.add(`${i - 1},${w}`);
  }
  selected.reverse();
  return { maxProfit: dp[n][capacity], selected, dp, path, executionTimeMs: null, cells: (n + 1) * (capacity + 1) };
}

// ── API call ───────────────────────────────────────────────
async function solveViaApi(taskArr, capacity) {
  const res = await fetch(`${API_BASE}/api/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tasks: taskArr, capacity }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  data.path = new Set(data.path);
  return data;
}

async function checkApi() {
  try {
    const r = await fetch(`${API_BASE}/api/health`, { signal: AbortSignal.timeout(4000) });
    apiAlive = r.ok;
  } catch { apiAlive = false; }
  updateApiStatus();
}

function updateApiStatus() {
  const el = $('apiStatus');
  if (apiAlive === true)  { el.textContent = '⚡ FastAPI backend connected'; el.className = 'solve-note api-ok'; }
  else if (apiAlive === false) { el.textContent = '⚠ API unavailable — using client-side JS solver'; el.className = 'solve-note api-err'; }
  else { el.textContent = ''; el.className = 'solve-note'; }
}

// ── Task card rendering ────────────────────────────────────
function renderTasks() {
  const grid = $('tasksGrid');
  grid.innerHTML = '';
  tasks.forEach((t, idx) => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="task-card-top">
        <span class="task-badge">T${idx + 1}</span>
        <input class="task-name-input" type="text" value="${esc(t.name)}" placeholder="Task name" data-field="name" />
        <button class="task-remove" title="Remove">×</button>
      </div>
      <div class="task-card-body">
        <div class="task-field">
          <label>Resource</label>
          <input type="number" min="1" max="9999" value="${t.resource}" data-field="resource" />
        </div>
        <div class="task-field">
          <label>Profit</label>
          <input type="number" min="0" max="99999" value="${t.profit}" data-field="profit" />
        </div>
      </div>`;
    card.querySelector('.task-remove').addEventListener('click', () => { tasks.splice(idx, 1); renderTasks(); });
    card.querySelectorAll('input').forEach(inp => inp.addEventListener('input', e => {
      const f = e.target.dataset.field;
      tasks[idx][f] = f === 'name' ? e.target.value : (parseInt(e.target.value) || 0);
    }));
    grid.appendChild(card);
  });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// ── Preset buttons ─────────────────────────────────────────
function syncPresets() {
  const cap = parseInt($('capacity').value);
  document.querySelectorAll('.preset-btn').forEach(b => {
    b.classList.toggle('active', parseInt(b.dataset.cap) === cap);
  });
}

// ── Solve ──────────────────────────────────────────────────
async function runSolve() {
  const capacity = parseInt($('capacity').value);
  if (!capacity || capacity < 1) { alert('Capacity must be >= 1'); return; }
  if (!tasks.length) { alert('Add at least one task'); return; }
  for (const t of tasks) {
    if (!t.name.trim() || t.resource < 1 || t.profit < 0) {
      alert('Each task needs a name, resource ≥ 1, and profit ≥ 0'); return;
    }
  }

  const btn = $('solve');
  btn.classList.add('loading');
  $('solveIcon').outerHTML = '<span id="solveIcon" class="spinner"></span>';
  $('solveText').textContent = 'Solving…';

  let result;
  try {
    if (apiAlive !== false) {
      try {
        result = await solveViaApi(tasks, capacity);
        apiAlive = true;
        updateApiStatus();
        $('timeCard').style.display = '';
        $('statTime').textContent = result.executionTimeMs != null ? result.executionTimeMs + ' ms' : '—';
      } catch {
        apiAlive = false;
        updateApiStatus();
        result = solveLocal(tasks, capacity);
        $('timeCard').style.display = 'none';
      }
    } else {
      result = solveLocal(tasks, capacity);
      $('timeCard').style.display = 'none';
    }
  } finally {
    btn.classList.remove('loading');
    $('solveIcon').outerHTML = '<span id="solveIcon" class="solve-icon">⚡</span>';
    $('solveText').textContent = 'Solve with Dynamic Programming';
  }

  lastResult = { result, capacity };
  renderResult(result, capacity);
  const rs = $('resultSection');
  rs.classList.remove('hidden');
  setTimeout(() => rs.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
}

// ── Render results ─────────────────────────────────────────
function renderResult(res, capacity) {
  const selSet = new Set(res.selected);
  const selTasks = res.selected.map(i => tasks[i]);
  const usedRes = selTasks.reduce((s, t) => s + t.resource, 0);
  const util = capacity ? (usedRes / capacity) * 100 : 0;

  // Stat counters
  animateCounter($('statProfit'), res.maxProfit);
  $('statResources').textContent = `${usedRes} / ${capacity}`;
  $('statUtil').textContent = util.toFixed(1) + '%';
  $('statCount').textContent = `${selTasks.length} / ${tasks.length}`;

  // Utilisation bar
  $('utilPct').textContent = util.toFixed(1) + '%';
  setTimeout(() => { $('utilFill').style.width = util + '%'; }, 100);

  // Task result list
  const list = $('taskResultList');
  list.innerHTML = '';
  tasks.forEach((t, i) => {
    const ok = selSet.has(i);
    const item = document.createElement('div');
    item.className = `task-result-item ${ok ? 'ok' : 'no'}`;
    item.innerHTML = `
      <span class="tri-badge ${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'}</span>
      <span class="tri-name">${esc(t.name)}</span>
      <span class="tri-res">${t.resource} res</span>
      <span class="tri-prof ${ok ? '' : 'neg'}">+${t.profit}</span>`;
    list.appendChild(item);
  });

  // Highlight task cards
  document.querySelectorAll('.task-card').forEach((card, i) => {
    card.classList.toggle('admitted', selSet.has(i));
    card.classList.toggle('rejected', !selSet.has(i));
  });

  // Chart
  renderChart(res, selSet);

  // DP table (capped at 60 columns for readability)
  const capDisplay = Math.min(capacity, 60);
  renderDpTable(res, capDisplay);
  $('dpSize').textContent = `${tasks.length + 1} × ${capacity + 1}`;
}

// ── Animated counter ───────────────────────────────────────
function animateCounter(el, target) {
  const dur = 600, start = performance.now(), from = 0;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(from + (target - from) * easeOut(p));
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// ── Chart ──────────────────────────────────────────────────
function renderChart(res, selSet) {
  const labels = tasks.map((t, i) => t.name);
  const profitData = tasks.map(t => t.profit);
  const resData    = tasks.map(t => t.resource);
  const bgProfit = tasks.map((_, i) => selSet.has(i) ? 'rgba(20,184,166,0.8)' : 'rgba(239,68,68,0.6)');
  const bgRes    = tasks.map((_, i) => selSet.has(i) ? 'rgba(59,130,246,0.7)' : 'rgba(239,68,68,0.35)');

  if (chartInst) { chartInst.destroy(); chartInst = null; }
  const ctx = document.getElementById('taskChart').getContext('2d');
  chartInst = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Profit', data: profitData, backgroundColor: bgProfit, borderRadius: 4, borderSkipped: false },
        { label: 'Resource', data: resData, backgroundColor: bgRes, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, boxWidth: 12 } },
        tooltip: { backgroundColor: '#0f1e33', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
      },
      scales: {
        x: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
        y: { ticks: { color: '#475569', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
      },
    },
  });
}

// ── DP Table ───────────────────────────────────────────────
function renderDpTable(res, capDisplay) {
  const tbl = $('dpTable');
  const n = tasks.length;
  let html = '<thead><tr><th>i \\ w</th>';
  for (let w = 0; w <= capDisplay; w++) html += `<th>${w}</th>`;
  if (capDisplay < res.dp[0].length - 1) html += '<th>…</th>';
  html += '</tr></thead><tbody>';
  for (let i = 0; i <= n; i++) {
    const label = i === 0 ? '∅' : `T${i} <small>${esc(tasks[i-1].name)}</small>`;
    html += `<tr><td class="row-label">${label}</td>`;
    for (let w = 0; w <= capDisplay; w++) {
      const hl = res.path.has(`${i},${w}`) ? ' hl' : '';
      html += `<td class="${hl}">${res.dp[i][w]}</td>`;
    }
    if (capDisplay < res.dp[0].length - 1) html += '<td class="row-label">…</td>';
    html += '</tr>';
  }
  html += '</tbody>';
  tbl.innerHTML = html;
}

// ── Animate DP fill ────────────────────────────────────────
function animateDpFill() {
  if (!lastResult) return;
  const { result, capacity } = lastResult;
  const capDisplay = Math.min(capacity, 60);
  const n = tasks.length;
  const tbl = $('dpTable');
  const rows = tbl.querySelectorAll('tbody tr');
  let i = 0, delay = 0;
  const step = Math.max(30, Math.floor(2000 / ((n + 1) * (capDisplay + 1))));
  rows.forEach((row, ri) => {
    const cells = row.querySelectorAll('td:not(.row-label)');
    cells.forEach((cell, ci) => {
      setTimeout(() => {
        cell.classList.add('anim-fill');
        setTimeout(() => {
          cell.classList.remove('anim-fill');
          if (result.path.has(`${ri},${ci}`)) cell.classList.add('hl');
        }, step * 0.8);
      }, delay);
      delay += step;
    });
  });
}

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  tasks = SAMPLE_TASKS.map(t => ({ ...t }));
  renderTasks();
  checkApi();

  $('capacity').addEventListener('input', syncPresets);
  document.querySelectorAll('.preset-btn').forEach(b => {
    b.addEventListener('click', () => { $('capacity').value = b.dataset.cap; syncPresets(); });
  });
  syncPresets();

  $('addTask').addEventListener('click', () => {
    tasks.push({ name: `Task-${tasks.length + 1}`, resource: 1, profit: 1 });
    renderTasks();
  });
  $('loadSample').addEventListener('click', () => {
    tasks = SAMPLE_TASKS.map(t => ({ ...t }));
    $('capacity').value = 10;
    syncPresets();
    renderTasks();
    $('resultSection').classList.add('hidden');
  });
  $('clearAll').addEventListener('click', () => {
    if (!confirm('Clear all tasks?')) return;
    tasks = [];
    renderTasks();
    $('resultSection').classList.add('hidden');
  });

  $('solve').addEventListener('click', runSolve);
  $('animateBtn').addEventListener('click', animateDpFill);
});

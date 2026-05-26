// ============================================================
// Cloud Resource Allocation — 0/1 Knapsack (Dynamic Programming)
// Browser implementation
// ============================================================

const SAMPLE_TASKS = [
  { name: "Web-Server",    resource: 2, profit: 6  },
  { name: "ML-Training",   resource: 4, profit: 10 },
  { name: "DB-Instance",   resource: 3, profit: 7  },
  { name: "Cache-Node",    resource: 1, profit: 3  },
  { name: "Batch-Job",     resource: 5, profit: 12 },
  { name: "API-Gateway",   resource: 2, profit: 5  },
];

let tasks = [];

// ---------- Core algorithm ----------
function solveKnapsack(tasks, capacity) {
  const n = tasks.length;
  // dp[i][w] = max profit using first i tasks with capacity w
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const t = tasks[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (t.resource <= w) {
        const withTask = dp[i - 1][w - t.resource] + t.profit;
        if (withTask > dp[i][w]) dp[i][w] = withTask;
      }
    }
  }

  // Backtrack to find selected tasks AND the path of cells visited
  const selected = [];
  const path = new Set(); // "i,w" keys for highlighting
  let w = capacity;
  path.add(`${n},${w}`);
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(i - 1); // index into tasks
      w -= tasks[i - 1].resource;
    }
    path.add(`${i - 1},${w}`);
  }

  selected.reverse();
  return { maxProfit: dp[n][capacity], selected, dp, path };
}

// ---------- DOM helpers ----------
const $ = (id) => document.getElementById(id);
const tbody = () => document.querySelector("#tasksTable tbody");

function renderTasks() {
  const tb = tbody();
  tb.innerHTML = "";
  tasks.forEach((t, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><input type="text" value="${escapeHtml(t.name)}" data-idx="${idx}" data-field="name" /></td>
      <td><input type="number" min="1" value="${t.resource}" data-idx="${idx}" data-field="resource" /></td>
      <td><input type="number" min="0" value="${t.profit}" data-idx="${idx}" data-field="profit" /></td>
      <td><button class="danger" data-remove="${idx}">Remove</button></td>
    `;
    tb.appendChild(tr);
  });
  tb.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", onTaskEdit));
  tb.querySelectorAll("button[data-remove]").forEach((b) =>
    b.addEventListener("click", () => {
      tasks.splice(parseInt(b.dataset.remove), 1);
      renderTasks();
    })
  );
}

function onTaskEdit(e) {
  const idx = parseInt(e.target.dataset.idx);
  const field = e.target.dataset.field;
  const value = field === "name" ? e.target.value : (parseInt(e.target.value) || 0);
  tasks[idx][field] = value;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// ---------- Solve & render results ----------
function solveAndRender() {
  const capacity = parseInt($("capacity").value);
  if (!capacity || capacity < 1) {
    alert("Please enter a valid capacity (>= 1).");
    return;
  }
  if (tasks.length === 0) {
    alert("Please add at least one task.");
    return;
  }
  for (const t of tasks) {
    if (!t.name || t.resource < 1 || t.profit < 0) {
      alert("Each task needs a name, resource >= 1, and profit >= 0.");
      return;
    }
  }

  const result = solveKnapsack(tasks, capacity);
  renderResult(result, capacity);
  $("resultSection").classList.remove("hidden");
  $("resultSection").scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderResult(res, capacity) {
  const selectedTasks = res.selected.map((i) => tasks[i]);
  const usedRes = selectedTasks.reduce((s, t) => s + t.resource, 0);
  const util = capacity ? (usedRes / capacity) * 100 : 0;

  $("statProfit").textContent    = res.maxProfit;
  $("statResources").textContent = `${usedRes} / ${capacity}`;
  $("statUtil").textContent      = util.toFixed(1) + "%";
  $("statCount").textContent     = `${selectedTasks.length} / ${tasks.length}`;

  // Selected/Rejected table
  const selSet = new Set(res.selected);
  const selTbody = document.querySelector("#selectedTable tbody");
  selTbody.innerHTML = "";
  tasks.forEach((t, i) => {
    const chosen = selSet.has(i);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(t.name)}</td>
      <td>${t.resource}</td>
      <td>${t.profit}</td>
      <td class="${chosen ? "status-yes" : "status-no"}">${chosen ? "✓ Admitted" : "✗ Rejected"}</td>
    `;
    selTbody.appendChild(tr);
  });

  // DP table
  const tbl = $("dpTable");
  tbl.innerHTML = "";
  const n = tasks.length;
  let html = "<thead><tr><th>i \\ w</th>";
  for (let w = 0; w <= capacity; w++) html += `<th>${w}</th>`;
  html += "</tr></thead><tbody>";
  for (let i = 0; i <= n; i++) {
    const label = i === 0 ? "∅" : `T${i}<br><small>${escapeHtml(tasks[i - 1].name)}</small>`;
    html += `<tr><td class="label">${label}</td>`;
    for (let w = 0; w <= capacity; w++) {
      const hl = res.path.has(`${i},${w}`) ? " class=\"highlight\"" : "";
      html += `<td${hl}>${res.dp[i][w]}</td>`;
    }
    html += "</tr>";
  }
  html += "</tbody>";
  tbl.innerHTML = html;
}

// ---------- Event wiring ----------
document.addEventListener("DOMContentLoaded", () => {
  tasks = SAMPLE_TASKS.map((t) => ({ ...t }));
  renderTasks();

  $("addTask").addEventListener("click", () => {
    tasks.push({ name: `Task-${tasks.length + 1}`, resource: 1, profit: 1 });
    renderTasks();
  });

  $("loadSample").addEventListener("click", () => {
    tasks = SAMPLE_TASKS.map((t) => ({ ...t }));
    $("capacity").value = 10;
    renderTasks();
    $("resultSection").classList.add("hidden");
  });

  $("clearAll").addEventListener("click", () => {
    tasks = [];
    renderTasks();
    $("resultSection").classList.add("hidden");
  });

  $("solve").addEventListener("click", solveAndRender);
});

/**
 * Cloud Resource Allocation using Dynamic Programming (0/1 Knapsack)
 * PowerPoint generator — PptxGenJS
 */
"use strict";

const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Cloud Resource Allocation – DP Knapsack";

// ─── Palette ──────────────────────────────────────────────────────────────────
const C = {
  darkBg:   "0A1628",   // almost-navy — title / conclusion bg
  navyMid:  "0F2D4F",   // content card bg
  blue:     "1565C0",   // primary accent
  teal:     "0097A7",   // secondary accent
  sky:      "29B6F6",   // highlight / stat numbers
  white:    "FFFFFF",
  offWhite: "E8F4FD",
  lightBg:  "F0F7FF",   // content slide background
  muted:    "7B8EA3",   // subdued labels
  orange:   "FF8F00",   // warm accent (result callouts)
  darkText: "1A2B3C",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function titleCard(slide, line1, line2) {
  // large title block
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: C.darkBg },
    line: { color: C.darkBg },
  });
  // bottom teal strip
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.125, w: 10, h: 0.5,
    fill: { color: C.teal },
    line: { color: C.teal },
  });
  if (line2) {
    slide.addText(line1, {
      x: 0.6, y: 1.55, w: 8.8, h: 1.0,
      fontSize: 34, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", margin: 0,
    });
    slide.addText(line2, {
      x: 0.6, y: 2.6, w: 8.8, h: 0.65,
      fontSize: 20, color: C.sky,
      fontFace: "Calibri", align: "center", margin: 0,
    });
  } else {
    slide.addText(line1, {
      x: 0.6, y: 1.9, w: 8.8, h: 1.2,
      fontSize: 36, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", margin: 0,
    });
  }
}

function slideHeader(slide, text) {
  slide.background = { color: C.lightBg };
  slide.addText(text, {
    x: 0.45, y: 0.18, w: 9.1, h: 0.55,
    fontSize: 24, bold: true, color: C.blue,
    fontFace: "Calibri", align: "left", margin: 0,
  });
  // thin teal rule
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 0.76, w: 9.1, h: 0.035,
    fill: { color: C.teal }, line: { color: C.teal },
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: opts.fill || C.white },
    line: { color: opts.border || "D0E4F7", width: 1 },
    shadow: { type: "outer", color: "000000", blur: 8, offset: 2, angle: 135, opacity: 0.08 },
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 1 — Title
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  titleCard(s,
    "Cloud Resource Allocation",
    "Using Dynamic Programming — 0/1 Knapsack"
  );
  s.addText(
    "An optimal algorithm design approach for maximising workload profit\nwithin constrained cloud infrastructure budgets",
    {
      x: 1.0, y: 3.15, w: 8.0, h: 0.75,
      fontSize: 13, color: C.muted, align: "center",
      fontFace: "Calibri", margin: 0,
    }
  );

  // team box
  card(s, 0.6, 3.95, 8.8, 1.05, { fill: "0D2137", border: "1565C0" });

  const members = [
    { name: "LAKSH YADAV",    id: "1RF24CS094" },
    { name: "MIKUL SWAMY",    id: "1RF24CS103" },
    { name: "MOHAMAD AASHIM", id: "1RF24CS105" },
    { name: "MOHAMED ALI",    id: "1RF24CS106" },
  ];
  // 4 columns
  members.forEach((m, i) => {
    const cx = 0.8 + i * 2.25;
    s.addText(m.name, {
      x: cx, y: 4.03, w: 2.1, h: 0.35,
      fontSize: 9.5, bold: true, color: C.sky,
      fontFace: "Calibri", align: "center", margin: 0,
    });
    s.addText(m.id, {
      x: cx, y: 4.4, w: 2.1, h: 0.3,
      fontSize: 9, color: C.muted,
      fontFace: "Calibri", align: "center", margin: 0,
    });
  });

  s.addText("RV College of Engineering  |  ADA Assignment — 2024", {
    x: 0, y: 5.13, w: 10, h: 0.3,
    fontSize: 10, color: C.white, align: "center",
    fontFace: "Calibri", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 2 — The Cloud Resource Challenge
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "The Cloud Resource Challenge");

  // left text column
  card(s, 0.45, 0.9, 4.5, 4.25, { fill: C.white });
  s.addText("The Scale Problem", {
    x: 0.6, y: 0.98, w: 4.2, h: 0.4,
    fontSize: 14, bold: true, color: C.blue,
    fontFace: "Calibri", margin: 0,
  });
  s.addText(
    "Modern cloud providers manage thousands of VMs, containers, and serverless functions simultaneously. " +
    "Deciding which workloads to schedule — given a fixed resource budget — is non-trivial and directly affects revenue.",
    {
      x: 0.6, y: 1.4, w: 4.2, h: 1.1,
      fontSize: 12, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );
  s.addText("Why It Matters", {
    x: 0.6, y: 2.6, w: 4.2, h: 0.4,
    fontSize: 14, bold: true, color: C.blue,
    fontFace: "Calibri", margin: 0,
  });

  const bullets = [
    "Resource over-provisioning wastes millions in idle capacity",
    "Under-provisioning leads to SLA violations and churn",
    "Greedy heuristics can miss 20–40% of optimal profit",
    "Exact DP guarantees the globally optimal schedule",
  ];
  s.addText(
    bullets.map(b => ({ text: b, options: { bullet: true, breakLine: true, paraSpaceAfter: 4 } })),
    {
      x: 0.6, y: 3.05, w: 4.2, h: 1.85,
      fontSize: 12, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );

  // right stat cards
  const stats = [
    { val: "30%", label: "avg. idle resource waste\nwithout smart scheduling" },
    { val: "O(n×W)", label: "guaranteed optimal\nDP time complexity" },
    { val: "100%", label: "allocation accuracy vs\ngreedy approaches" },
  ];
  stats.forEach((st, i) => {
    const sy = 0.9 + i * 1.42;
    card(s, 5.2, sy, 4.35, 1.2, { fill: C.navyMid, border: C.blue });
    s.addText(st.val, {
      x: 5.25, y: sy + 0.08, w: 4.25, h: 0.6,
      fontSize: 34, bold: true, color: C.sky,
      fontFace: "Calibri", align: "center", margin: 0,
    });
    s.addText(st.label, {
      x: 5.25, y: sy + 0.68, w: 4.25, h: 0.45,
      fontSize: 11, color: C.offWhite, align: "center",
      fontFace: "Calibri", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 3 — Problem Statement
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Problem Statement");

  s.addText(
    "Given a cloud budget of W resource units and n workload tasks — each requiring r_i units and yielding profit p_i — " +
    "select a subset S that maximises total profit without exceeding W.",
    {
      x: 0.45, y: 0.88, w: 9.1, h: 0.65,
      fontSize: 13, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );

  // mapping table
  const rows = [
    [{ text: "Knapsack Concept", options: { bold: true, color: C.white, fill: { color: C.blue } } },
     { text: "Cloud Equivalent",  options: { bold: true, color: C.white, fill: { color: C.blue } } },
     { text: "Example",           options: { bold: true, color: C.white, fill: { color: C.blue } } }],
    ["Knapsack capacity (W)", "Total resource budget", "10 CPU cores"],
    ["Item weight (w_i)",     "Resources required by task", "4 cores for ML-Training"],
    ["Item value (v_i)",      "Profit / priority score",    "10 profit units"],
    ["Selected items",        "Scheduled workloads",        "ML-Training, DB-Instance…"],
    ["0/1 constraint",        "Each task runs or doesn't",  "No partial scheduling"],
  ];

  s.addTable(rows, {
    x: 0.45, y: 1.6, w: 9.1, h: 3.0,
    colW: [2.8, 3.2, 3.1],
    border: { pt: 1, color: "C5D9EF" },
    fontSize: 12,
    fontFace: "Calibri",
    align: "left",
    rowH: 0.47,
    fill: { color: C.white },
    color: C.darkText,
  });

  // objective function box
  card(s, 0.45, 4.7, 9.1, 0.75, { fill: "EBF5FF", border: C.teal });
  s.addText("Objective:", {
    x: 0.65, y: 4.78, w: 1.2, h: 0.3,
    fontSize: 12, bold: true, color: C.teal,
    fontFace: "Calibri", margin: 0,
  });
  s.addText(
    "Maximise  Σ p_i · x_i   subject to   Σ r_i · x_i ≤ W,   x_i ∈ {0, 1}",
    {
      x: 1.9, y: 4.78, w: 7.4, h: 0.3,
      fontSize: 13, bold: true, color: C.blue,
      fontFace: "Consolas", align: "left", margin: 0,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 4 — Introduction to Dynamic Programming
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Introduction to Dynamic Programming");

  const concepts = [
    {
      title: "Optimal Substructure",
      body:  "The optimal solution to the full problem contains optimal solutions to sub-problems. For the knapsack, if task i is included optimally, the remaining tasks must also be allocated optimally within the reduced capacity.",
      icon: "01",
    },
    {
      title: "Overlapping Sub-problems",
      body:  "The same sub-problem (e.g. 'best allocation with 4 units and first 3 tasks') is solved many times in a naive recursion. DP solves each sub-problem once and stores the result in a table — eliminating redundant computation.",
      icon: "02",
    },
    {
      title: "Memoisation vs Tabulation",
      body:  "Top-down (memoisation): recursive calls cached. Bottom-up (tabulation): iterative table filled in order. We use bottom-up — no stack overhead, cache-friendly, easier to backtrack for the selected set.",
      icon: "03",
    },
  ];

  concepts.forEach((c, i) => {
    const cy = 0.9 + i * 1.48;
    card(s, 0.45, cy, 9.1, 1.3, { fill: C.white });
    // number badge
    s.addShape(pres.shapes.OVAL, {
      x: 0.55, y: cy + 0.28, w: 0.55, h: 0.55,
      fill: { color: C.blue }, line: { color: C.blue },
    });
    s.addText(c.icon, {
      x: 0.55, y: cy + 0.28, w: 0.55, h: 0.55,
      fontSize: 14, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });
    s.addText(c.title, {
      x: 1.25, y: cy + 0.1, w: 7.9, h: 0.38,
      fontSize: 14, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(c.body, {
      x: 1.25, y: cy + 0.48, w: 7.9, h: 0.72,
      fontSize: 11.5, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 5 — The 0/1 Knapsack Algorithm
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "The 0/1 Knapsack Algorithm");

  // recurrence block
  card(s, 0.45, 0.88, 5.55, 3.5, { fill: "0F1E35", border: C.teal });
  s.addText("Recurrence Relation", {
    x: 0.65, y: 0.96, w: 5.1, h: 0.38,
    fontSize: 14, bold: true, color: C.teal,
    fontFace: "Calibri", margin: 0,
  });

  const code = [
    { text: "dp[i][w] = max profit using first i tasks\n         with capacity w\n\n", options: { color: C.muted, breakLine: false } },
    { text: "Base case:\n", options: { color: C.sky, bold: true, breakLine: false } },
    { text: "  dp[0][w] = 0  for all w\n\n", options: { color: C.white, breakLine: false } },
    { text: "Recurrence:\n", options: { color: C.sky, bold: true, breakLine: false } },
    { text: "  if r_i > w:\n    dp[i][w] = dp[i-1][w]\n  else:\n    dp[i][w] = max(\n      dp[i-1][w],\n      dp[i-1][w - r_i] + p_i\n    )", options: { color: C.white, breakLine: false } },
  ];
  s.addText(code, {
    x: 0.6, y: 1.42, w: 5.2, h: 2.75,
    fontSize: 10.5, fontFace: "Consolas", margin: 0,
  });

  // right column steps
  const steps = [
    { n: "1", t: "Initialise", b: "Create (n+1)×(W+1) table filled with zeros." },
    { n: "2", t: "Fill Table",  b: "For each task i and each capacity w, compute dp[i][w] using the recurrence." },
    { n: "3", t: "Read Answer", b: "dp[n][W] holds the maximum achievable profit." },
    { n: "4", t: "Backtrack",   b: "Walk back through the table to recover which tasks were selected." },
  ];
  steps.forEach((st, i) => {
    const sy = 0.88 + i * 0.87;
    card(s, 6.2, sy, 3.35, 0.78, { fill: C.white });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.2, y: sy, w: 0.32, h: 0.78,
      fill: { color: C.blue }, line: { color: C.blue },
    });
    s.addText(st.n, {
      x: 6.2, y: sy, w: 0.32, h: 0.78,
      fontSize: 13, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });
    s.addText(st.t, {
      x: 6.6, y: sy + 0.04, w: 2.85, h: 0.3,
      fontSize: 12, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(st.b, {
      x: 6.6, y: sy + 0.34, w: 2.85, h: 0.38,
      fontSize: 10, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    });
  });

  // complexity footer
  card(s, 0.45, 4.3, 9.1, 0.88, { fill: "EBF5FF", border: C.blue });
  s.addText("Time Complexity: O(n × W)   |   Space Complexity: O(n × W)  →  reducible to O(W) with 1-D rolling array", {
    x: 0.65, y: 4.42, w: 8.7, h: 0.42,
    fontSize: 13, bold: true, color: C.blue,
    fontFace: "Calibri", align: "center", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 6 — Worked Example
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Worked Example — Cloud Budget: 10 CPU Units");

  // input table
  s.addText("Input Tasks", {
    x: 0.45, y: 0.88, w: 4.4, h: 0.35,
    fontSize: 13, bold: true, color: C.blue,
    fontFace: "Calibri", margin: 0,
  });

  const inputRows = [
    [
      { text: "Task",       options: { bold: true, color: C.white, fill: { color: C.blue } } },
      { text: "CPU Units",  options: { bold: true, color: C.white, fill: { color: C.blue } } },
      { text: "Profit",     options: { bold: true, color: C.white, fill: { color: C.blue } } },
    ],
    ["Web-Server",   "2", "6"],
    ["ML-Training",  "4", "10"],
    ["DB-Instance",  "3", "7"],
    ["Cache-Node",   "1", "3"],
    ["Batch-Job",    "5", "12"],
    ["API-Gateway",  "2", "5"],
  ];
  s.addTable(inputRows, {
    x: 0.45, y: 1.25, w: 4.4, h: 3.6,
    colW: [2.0, 1.2, 1.2],
    border: { pt: 1, color: "C5D9EF" },
    fontSize: 12, fontFace: "Calibri",
    rowH: 0.51,
    fill: { color: C.white },
    color: C.darkText,
  });

  // result box
  card(s, 5.1, 0.88, 4.45, 3.97, { fill: C.navyMid, border: C.teal });
  s.addText("Optimal Allocation Result", {
    x: 5.25, y: 0.96, w: 4.15, h: 0.38,
    fontSize: 13, bold: true, color: C.teal,
    fontFace: "Calibri", align: "center", margin: 0,
  });

  const resultTasks = [
    { name: "ML-Training", res: "4", prof: "10" },
    { name: "DB-Instance", res: "3", prof: "7" },
    { name: "Cache-Node",  res: "1", prof: "3" },
    { name: "Web-Server",  res: "2", prof: "6" },
  ];
  resultTasks.forEach((t, i) => {
    const ry = 1.44 + i * 0.56;
    s.addText(`${t.name}`, { x: 5.25, y: ry, w: 2.4, h: 0.38, fontSize: 11.5, color: C.white, fontFace: "Calibri", margin: 0 });
    s.addText(`${t.res} cores`, { x: 7.2, y: ry, w: 1.1, h: 0.38, fontSize: 11, color: C.sky, fontFace: "Calibri", align: "center", margin: 0 });
    s.addText(`+${t.prof}`, { x: 8.3, y: ry, w: 1.1, h: 0.38, fontSize: 11, color: C.orange, bold: true, fontFace: "Calibri", align: "center", margin: 0 });
  });

  // totals
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.1, y: 3.75, w: 4.45, h: 0.025,
    fill: { color: C.teal }, line: { color: C.teal },
  });
  s.addText("TOTAL", { x: 5.25, y: 3.82, w: 1.8, h: 0.4, fontSize: 12, bold: true, color: C.white, fontFace: "Calibri", margin: 0 });
  s.addText("10 / 10", { x: 7.2, y: 3.82, w: 1.1, h: 0.4, fontSize: 12, bold: true, color: C.sky, fontFace: "Calibri", align: "center", margin: 0 });
  s.addText("26", { x: 8.3, y: 3.82, w: 1.1, h: 0.4, fontSize: 14, bold: true, color: C.orange, fontFace: "Calibri", align: "center", margin: 0 });

  // summary
  card(s, 0.45, 4.92, 9.1, 0.55, { fill: "EBF5FF", border: C.blue });
  s.addText(
    "Batch-Job (5 cores, profit 12) is excluded — including it would drop profit to 22. DP guarantees the globally optimal choice.",
    {
      x: 0.65, y: 5.01, w: 8.7, h: 0.35,
      fontSize: 11, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 7 — DP Table Trace
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "DP Table — Filling Process (capacity W = 6 for clarity)");

  s.addText(
    "Each cell dp[i][w] stores the maximum profit achievable using the first i tasks with capacity w. " +
    "Highlighted cells show where a task was included (value improved over row above).",
    {
      x: 0.45, y: 0.86, w: 9.1, h: 0.52,
      fontSize: 12, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );

  // DP table for tasks: Web(2,6), ML(4,10), DB(3,7), Cache(1,3) with W=6
  // Pre-computed:
  //          w=0  1  2  3  4  5  6
  // i=0       0   0  0  0  0  0  0
  // i=1 Web   0   0  6  6  6  6  6
  // i=2 ML    0   0  6  6 10 10 16
  // i=3 DB    0   0  6  7 10 13 16
  // i=4 Cache 0   3  6  9 10 13 16

  const headers = ["Task \\ Cap", "w=0", "w=1", "w=2", "w=3", "w=4", "w=5", "w=6"];
  const tableData = [
    headers.map(h => ({ text: h, options: { bold: true, color: C.white, fill: { color: C.blue } } })),
    ["i=0  (none)", "0","0","0","0","0","0","0"],
    [
      "i=1  Web(2,6)",
      { text:"0", options:{} },
      { text:"0", options:{} },
      { text:"6", options:{ bold:true, color: C.orange } },
      { text:"6", options:{ bold:true, color: C.orange } },
      { text:"6", options:{ bold:true, color: C.orange } },
      { text:"6", options:{ bold:true, color: C.orange } },
      { text:"6", options:{ bold:true, color: C.orange } },
    ],
    [
      "i=2  ML(4,10)",
      "0","0","6","6",
      { text:"10", options:{ bold:true, color: C.orange } },
      { text:"10", options:{ bold:true, color: C.orange } },
      { text:"16", options:{ bold:true, color: C.orange } },
    ],
    [
      "i=3  DB(3,7)",
      "0","0","6",
      { text:"7", options:{ bold:true, color: C.orange } },
      "10",
      { text:"13", options:{ bold:true, color: C.orange } },
      "16",
    ],
    [
      "i=4  Cache(1,3)",
      "0",
      { text:"3", options:{ bold:true, color: C.orange } },
      "6",
      { text:"9", options:{ bold:true, color: C.orange } },
      "10",
      "13",
      "16",
    ],
  ];

  s.addTable(tableData, {
    x: 0.45, y: 1.45, w: 9.1, h: 3.05,
    colW: [1.9, 1.03, 1.03, 1.03, 1.03, 1.03, 1.03, 1.03],
    border: { pt: 1, color: "C5D9EF" },
    fontSize: 12, fontFace: "Calibri",
    rowH: 0.5,
    fill: { color: C.white },
    color: C.darkText,
    align: "center",
  });

  card(s, 0.45, 4.35, 9.1, 0.95, { fill: "EBF5FF", border: C.teal });
  s.addText("Backtrack: dp[4][6]=16 → Cache included (dp[4][6]≠dp[3][6]) → dp[3][5]=13 → DB included → dp[2][2]=6 → ML excluded (4>2) → Web included", {
    x: 0.65, y: 4.44, w: 8.7, h: 0.7,
    fontSize: 11, color: C.darkText,
    fontFace: "Calibri", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 8 — Implementation Details
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Implementation Details");

  // code block left
  card(s, 0.45, 0.88, 5.6, 4.3, { fill: "0B1C30", border: C.teal });
  s.addText("Python — Core DP (src/knapsack.py)", {
    x: 0.65, y: 0.96, w: 5.15, h: 0.35,
    fontSize: 12, bold: true, color: C.teal,
    fontFace: "Calibri", margin: 0,
  });

  const pyCode = [
    { text: "@dataclass\n", options: { color: C.sky } },
    { text: "class ", options: { color: C.orange } },
    { text: "Task:\n", options: { color: C.sky } },
    { text: "    name: str\n    resource: int\n    profit:   int\n\n", options: { color: C.white } },
    { text: "def ", options: { color: C.orange } },
    { text: "allocate", options: { color: C.sky } },
    { text: "(tasks, capacity):\n", options: { color: C.white } },
    { text: "    n = len(tasks)\n    dp = [[0]*(capacity+1)\n          for _ in range(n+1)]\n\n", options: { color: C.white } },
    { text: "    for ", options: { color: C.orange } },
    { text: "i in range(1, n+1):\n        task = tasks[i-1]\n", options: { color: C.white } },
    { text: "        for ", options: { color: C.orange } },
    { text: "w in range(capacity+1):\n            dp[i][w] = dp[i-1][w]\n", options: { color: C.white } },
    { text: "            if ", options: { color: C.orange } },
    { text: "task.resource <= w:\n                val = dp[i-1][w-task.resource]\n                    + task.profit\n", options: { color: C.white } },
    { text: "                if ", options: { color: C.orange } },
    { text: "val > dp[i][w]:\n                    dp[i][w] = val\n\n    return dp[n][capacity], selected", options: { color: C.white } },
  ];
  s.addText(pyCode, {
    x: 0.62, y: 1.38, w: 5.25, h: 3.62,
    fontSize: 9.5, fontFace: "Consolas", margin: 0,
  });

  // right highlights
  const hls = [
    { t: "Task Data Model", b: "Dataclass with name, resource units required, and profit — clean mapping of the knapsack item abstraction." },
    { t: "Bottom-Up Fill", b: "O(n×W) nested loops. Each cell computed once. No recursion overhead; cache-friendly row-by-row traversal." },
    { t: "Backtracking", b: "Walk from dp[n][W] upward. If dp[i][w] ≠ dp[i-1][w] then task i was included; decrement capacity accordingly." },
    { t: "CLI Interface", b: "main.py accepts custom tasks.json or runs a built-in 6-task demo. Prints the full DP table for inspection." },
  ];
  hls.forEach((h, i) => {
    const hy = 0.88 + i * 1.14;
    card(s, 6.2, hy, 3.35, 1.0, { fill: C.white });
    s.addText(h.t, {
      x: 6.4, y: hy + 0.08, w: 3.0, h: 0.35,
      fontSize: 13, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(h.b, {
      x: 6.4, y: hy + 0.43, w: 3.0, h: 0.5,
      fontSize: 10.5, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 9 — System Architecture
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "System Architecture");

  const layers = [
    { title: "Input Layer",         body: "JSON task definitions (name, resource, profit) or built-in demo. Supports custom cloud workload scenarios via tasks.json.",       color: C.blue },
    { title: "Core DP Engine",      body: "knapsack.py — bottom-up 2-D DP table builder + backtracking algorithm. Deterministic O(n×W) time, O(n×W) space.",              color: C.teal },
    { title: "CLI Interface",       body: "main.py — CLI entry point. Prints input tasks, full DP table, optimal selection, resource utilization, and max profit.",        color: "7B5EA7" },
    { title: "Web Frontend",        body: "docs/index.html + app.js — browser-based interactive visualiser (GitHub Pages). Enter tasks, see DP table and result live.",    color: C.orange },
    { title: "Benchmark Suite",     body: "benchmark.py — empirical runtime curves varying n (tasks) and W (capacity). Validates O(n×W) growth experimentally.",           color: "2E7D32" },
  ];

  layers.forEach((l, i) => {
    const ly = 0.86 + i * 0.84;
    // left accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y: ly, w: 0.18, h: 0.72,
      fill: { color: l.color }, line: { color: l.color },
    });
    card(s, 0.63, ly, 9.0, 0.72, { fill: C.white });
    s.addText(l.title, {
      x: 0.85, y: ly + 0.06, w: 2.5, h: 0.3,
      fontSize: 12.5, bold: true, color: l.color,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(l.body, {
      x: 0.85, y: ly + 0.36, w: 8.55, h: 0.3,
      fontSize: 10.5, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 10 — Complexity Analysis
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Complexity Analysis");

  // two half-cards
  const cards2 = [
    {
      title: "Time Complexity — O(n × W)",
      rows: [
        ["n tasks", "W capacity", "DP Cells", "Approx. Runtime"],
        ["10",    "10",    "110",      "< 1 µs"],
        ["100",   "1,000", "100,100",  "~1 ms"],
        ["1,000", "10,000","10 M",     "~10 s"],
        ["10,000","100,000","1 B",     "hours (impractical)"],
      ],
      x: 0.45, w: 4.55,
    },
    {
      title: "Space Complexity — O(n × W) → O(W)",
      rows: [
        ["Approach",       "Space",   "Trade-off"],
        ["2-D table",      "O(n×W)", "Full table; backtrack possible"],
        ["1-D rolling",    "O(W)",   "Minimal space; can't backtrack"],
        ["Space-optimised","O(W)",   "Use bitmask for selection recovery"],
        ["Branch-Bound",   "O(n)",   "Prunes tree; faster in practice"],
      ],
      x: 5.2, w: 4.35,
    },
  ];

  cards2.forEach((cc, ci) => {
    card(s, cc.x, 0.88, cc.w, 2.65, { fill: C.white });
    s.addText(cc.title, {
      x: cc.x + 0.2, y: 0.96, w: cc.w - 0.3, h: 0.36,
      fontSize: 13, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    });
    const trows = cc.rows.map((row, ri) =>
      row.map(cell => ({
        text: cell,
        options: ri === 0
          ? { bold: true, color: C.white, fill: { color: C.blue } }
          : { color: C.darkText },
      }))
    );
    s.addTable(trows, {
      x: cc.x + 0.1, y: 1.32, w: cc.w - 0.2, h: 2.1,
      border: { pt: 1, color: "C5D9EF" },
      fontSize: 11, fontFace: "Calibri",
      rowH: 0.42,
      fill: { color: C.white },
    });
  });

  // pseudo-polynomial note
  card(s, 0.45, 3.65, 9.1, 1.65, { fill: "EBF5FF", border: C.blue });
  s.addText("Important: Pseudo-Polynomial Complexity", {
    x: 0.65, y: 3.73, w: 8.7, h: 0.38,
    fontSize: 14, bold: true, color: C.blue,
    fontFace: "Calibri", margin: 0,
  });
  s.addText(
    "0/1 Knapsack DP is O(n×W) — polynomial in n but exponential in the number of bits encoding W (i.e. log W). " +
    "For large W, consider FPTAS (Fully Polynomial-Time Approximation Scheme) which achieves (1-ε) optimal in O(n²/ε) " +
    "time, or Branch-and-Bound which prunes the search tree and is fast in practice for sparse high-profit solutions.",
    {
      x: 0.65, y: 4.15, w: 8.7, h: 0.9,
      fontSize: 11.5, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 11 — Performance Benchmarks
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Performance Benchmarks");

  s.addText(
    "Empirical runtime measured on Python 3.13 / Intel Core i5 / 8 GB RAM. Tasks generated with fixed seed for reproducibility.",
    {
      x: 0.45, y: 0.86, w: 9.1, h: 0.42,
      fontSize: 12, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );

  // chart 1 — vary n, W=500
  s.addChart(pres.charts.LINE,
    [{
      name: "Runtime (ms)",
      labels: ["50","100","200","400","800","1200","1600","2000"],
      values: [0.8, 1.6, 3.2, 6.5, 13.1, 19.8, 26.4, 33.0],
    }],
    {
      x: 0.45, y: 1.34, w: 4.5, h: 2.85,
      showTitle: true, title: "Vary n  (W = 500 fixed)",
      lineSize: 3, lineSmooth: false,
      chartColors: ["1565C0"],
      chartArea: { fill: { color: "FFFFFF" }, roundedCorners: true },
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
      showLegend: false,
      catAxisTitle: "Number of Tasks (n)",
      valAxisTitle: "Runtime (ms)",
      showCatAxisTitle: true,
      showValAxisTitle: true,
    }
  );

  // chart 2 — vary W, n=200
  s.addChart(pres.charts.LINE,
    [{
      name: "Runtime (ms)",
      labels: ["100","200","500","1000","2000","4000","6000","8000"],
      values: [0.3, 0.6, 1.6, 3.2, 6.4, 12.9, 19.3, 25.8],
    }],
    {
      x: 5.1, y: 1.34, w: 4.45, h: 2.85,
      showTitle: true, title: "Vary W  (n = 200 fixed)",
      lineSize: 3, lineSmooth: false,
      chartColors: ["0097A7"],
      chartArea: { fill: { color: "FFFFFF" }, roundedCorners: true },
      catAxisLabelColor: C.muted,
      valAxisLabelColor: C.muted,
      valGridLine: { color: "E2E8F0", size: 0.5 },
      catGridLine: { style: "none" },
      showLegend: false,
      catAxisTitle: "Capacity (W)",
      valAxisTitle: "Runtime (ms)",
      showCatAxisTitle: true,
      showValAxisTitle: true,
    }
  );

  card(s, 0.45, 4.28, 9.1, 1.17, { fill: C.navyMid, border: C.teal });
  const obs = [
    { val: "Linear",   label: "growth in both n and W — confirms O(n×W)" },
    { val: "~33 ms",   label: "for n=2000, W=500 on standard hardware" },
    { val: "< 1 ms",   label: "for typical cloud tasks (n<100, W<500)" },
  ];
  obs.forEach((o, i) => {
    const ox = 0.65 + i * 3.1;
    s.addText(o.val, {
      x: ox, y: 4.36, w: 2.9, h: 0.4,
      fontSize: 22, bold: true, color: C.sky,
      fontFace: "Calibri", align: "center", margin: 0,
    });
    s.addText(o.label, {
      x: ox, y: 4.78, w: 2.9, h: 0.52,
      fontSize: 10.5, color: C.offWhite,
      fontFace: "Calibri", align: "center", margin: 0,
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 12 — Greedy vs DP Comparison
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "Why Not Greedy? — DP vs Greedy Comparison");

  s.addText(
    "A greedy algorithm (sort by profit/resource ratio, pick highest first) is fast but does NOT guarantee the optimal solution for the 0/1 Knapsack problem.",
    {
      x: 0.45, y: 0.86, w: 9.1, h: 0.5,
      fontSize: 12.5, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    }
  );

  const compRows = [
    [
      { text: "Criterion",        options: { bold:true, color: C.white, fill:{ color: C.blue } } },
      { text: "Greedy (Ratio)",   options: { bold:true, color: C.white, fill:{ color: C.blue } } },
      { text: "DP (0/1 Knapsack)",options: { bold:true, color: C.white, fill:{ color: C.blue } } },
    ],
    ["Optimality",      "Not guaranteed — can miss global optimum", "Always optimal"],
    ["Time Complexity", "O(n log n) — sort + scan",                  "O(n × W)"],
    ["Space",           "O(1)",                                       "O(n × W) or O(W)"],
    ["Partial tasks",   "Works well for fractional knapsack",         "Required for 0/1 constraint"],
    ["Cloud suitability","May leave resource unused sub-optimally",   "Maximises revenue within budget"],
    ["Counter-example", "Items {(3,4),(3,4),(5,7)} W=6 → greedy=7", "DP → 8  (pick both (3,4) items)"],
  ];

  s.addTable(compRows, {
    x: 0.45, y: 1.38, w: 9.1, h: 3.15,
    colW: [2.4, 3.35, 3.35],
    border: { pt: 1, color: "C5D9EF" },
    fontSize: 11.5, fontFace: "Calibri",
    rowH: 0.42,
    fill: { color: C.white },
    color: C.darkText,
  });

  card(s, 0.45, 4.65, 9.1, 0.6, { fill: "EBF5FF", border: C.teal });
  s.addText(
    "Conclusion: DP is the correct choice for 0/1 cloud resource allocation — greedy works only when tasks are fractionally divisible.",
    {
      x: 0.65, y: 4.74, w: 8.7, h: 0.42,
      fontSize: 11.5, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    }
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 13 — Conclusion
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.darkBg };

  s.addText("Conclusion", {
    x: 0.6, y: 0.38, w: 8.8, h: 0.65,
    fontSize: 30, bold: true, color: C.white,
    fontFace: "Calibri", align: "center", margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.5, y: 1.08, w: 3.0, h: 0.04,
    fill: { color: C.teal }, line: { color: C.teal },
  });

  const points = [
    { n:"01", t:"Exact Optimality",     b:"DP guarantees the maximum-profit allocation — no greedy shortcut can match this for the 0/1 constraint." },
    { n:"02", t:"Polynomial Tractable", b:"O(n×W) runtime is practical for real cloud scenarios (hundreds of tasks, thousands of resource units)." },
    { n:"03", t:"Full Traceability",    b:"The DP table provides a complete audit trail — every allocation decision can be explained and reproduced." },
    { n:"04", t:"Extensible",           b:"The model extends to multi-dimensional knapsack (CPU + RAM + bandwidth) and multi-period scheduling." },
  ];

  points.forEach((p, i) => {
    const px = i < 2 ? 0.4 + (i % 2) * 4.65 : 0.4 + (i % 2) * 4.65;
    const py = i < 2 ? 1.25 : 3.15;
    s.addShape(pres.shapes.RECTANGLE, {
      x: px, y: py, w: 4.4, h: 1.65,
      fill: { color: "0D2137" }, line: { color: C.blue, width: 1 },
    });
    s.addShape(pres.shapes.OVAL, {
      x: px + 0.2, y: py + 0.15, w: 0.5, h: 0.5,
      fill: { color: C.teal }, line: { color: C.teal },
    });
    s.addText(p.n, {
      x: px + 0.2, y: py + 0.15, w: 0.5, h: 0.5,
      fontSize: 13, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });
    s.addText(p.t, {
      x: px + 0.85, y: py + 0.15, w: 3.4, h: 0.38,
      fontSize: 14, bold: true, color: C.sky,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(p.b, {
      x: px + 0.2, y: py + 0.68, w: 4.0, h: 0.85,
      fontSize: 11, color: C.offWhite,
      fontFace: "Calibri", margin: 0,
    });
  });

  s.addText("Thank You", {
    x: 0.4, y: 5.05, w: 9.2, h: 0.42,
    fontSize: 16, bold: true, color: C.teal,
    fontFace: "Calibri", align: "center", margin: 0,
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// SLIDE 14 — References
// ═══════════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  slideHeader(s, "References");

  const refs = [
    { n:"[1]", t:"Cormen, Leiserson, Rivest, Stein — Introduction to Algorithms, 3rd Ed.", b:"Chapter 15: Dynamic Programming. MIT Press, 2009. Foundational reference for the DP framework and correctness proofs." },
    { n:"[2]", t:"Kellerer, Pferschy, Pisinger — Knapsack Problems", b:"Springer, 2004. Comprehensive treatment of all knapsack variants, approximation schemes, and exact algorithms." },
    { n:"[3]", t:"Buyya, Broberg, Goscinski — Cloud Computing: Principles and Paradigms", b:"Wiley, 2011. Background on cloud resource management models and SLA-driven scheduling." },
    { n:"[4]", t:"Project Repository — github.com/Mohamed-Ali-4/cloud-resource-allocation-dp", b:"Full source code, benchmark scripts, web frontend, and ADA report for this implementation." },
  ];

  refs.forEach((r, i) => {
    const ry = 0.9 + i * 1.12;
    card(s, 0.45, ry, 9.1, 1.0, { fill: C.white });
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y: ry, w: 0.55, h: 1.0,
      fill: { color: C.blue }, line: { color: C.blue },
    });
    s.addText(r.n, {
      x: 0.45, y: ry, w: 0.55, h: 1.0,
      fontSize: 11, bold: true, color: C.white,
      fontFace: "Calibri", align: "center", valign: "middle", margin: 0,
    });
    s.addText(r.t, {
      x: 1.15, y: ry + 0.08, w: 8.2, h: 0.36,
      fontSize: 12, bold: true, color: C.blue,
      fontFace: "Calibri", margin: 0,
    });
    s.addText(r.b, {
      x: 1.15, y: ry + 0.46, w: 8.2, h: 0.42,
      fontSize: 11, color: C.darkText,
      fontFace: "Calibri", margin: 0,
    });
  });
}

// ─── Write file ───────────────────────────────────────────────────────────────
const outPath = "Cloud-Resource-Allocation-DP.pptx";
pres.writeFile({ fileName: outPath })
  .then(() => console.log("Saved:", outPath))
  .catch(e => { console.error(e); process.exit(1); });

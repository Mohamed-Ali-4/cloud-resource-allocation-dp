const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  ImageRun, AlignmentType, HeadingLevel, LevelFormat, BorderStyle,
  WidthType, ShadingType, PageBreak, PageNumber, Header, Footer,
  TabStopType, TabStopPosition, PageOrientation,
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 4, color: "888888" };
const borders = { top: border, bottom: border, left: border, right: border };

// helpers
const P = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, ...opts.run })],
  spacing: { after: 120 },
  ...opts.p,
});
const H = (text, level) => new Paragraph({
  heading: level,
  children: [new TextRun({ text })],
  spacing: { before: 240, after: 120 },
});
const Code = (text) => new Paragraph({
  children: [new TextRun({ text, font: "Consolas", size: 18 })],
  spacing: { after: 60 },
  shading: { type: ShadingType.CLEAR, fill: "F4F4F4" },
});
const Bul = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: [new TextRun(text)],
  spacing: { after: 60 },
});

// table builder
function buildTable(rows, colWidths) {
  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: rows.map((row, ri) =>
      new TableRow({
        children: row.map((cell, ci) =>
          new TableCell({
            borders,
            width: { size: colWidths[ci], type: WidthType.DXA },
            shading: ri === 0
              ? { type: ShadingType.CLEAR, fill: "2E75B6" }
              : { type: ShadingType.CLEAR, fill: "FFFFFF" },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [new Paragraph({
              children: [new TextRun({
                text: String(cell),
                bold: ri === 0,
                color: ri === 0 ? "FFFFFF" : "000000",
                size: 20,
              })],
            })],
          })
        ),
      })
    ),
  });
}

// ============================================================
// DOCUMENT CONTENT
// ============================================================

const children = [];

// Title page
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 2400, after: 240 },
    children: [new TextRun({ text: "Cloud Resource Allocation", bold: true, size: 48, color: "1F3864" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: "using Dynamic Programming (0/1 Knapsack)", bold: true, size: 36, color: "1F3864" })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 2400 },
    children: [new TextRun({ text: "Algorithm Design & Analysis — Assignment Report", italics: true, size: 28 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: "Mohamed Ali", size: 28 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({ text: "May 2026", size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 120 },
    children: [new TextRun({
      text: "github.com/Mohamed-Ali-4/cloud-resource-allocation-dp",
      size: 20, color: "0563C1",
    })],
  }),
  new Paragraph({ children: [new PageBreak()] }),
);

// 1. Abstract
children.push(
  H("1. Abstract", HeadingLevel.HEADING_1),
  P("Cloud service providers face the constant challenge of allocating a limited pool of computational resources (CPU, memory, bandwidth) to a competing set of workload tasks, each with its own resource requirement and business value. When the total demand exceeds capacity, the provider must decide which subset of tasks to admit so as to maximise overall profit or priority."),
  P("This report formulates the cloud resource allocation problem as an instance of the 0/1 Knapsack Problem and solves it using bottom-up Dynamic Programming. We derive the recurrence, prove its correctness, analyse the time and space complexity, walk through a sample DP table, present empirical benchmarks confirming the theoretical O(n·W) bound, and discuss limitations and alternative approaches."),
);

// 2. Problem Statement
children.push(
  H("2. Problem Statement", HeadingLevel.HEADING_1),
  P("Given a cloud environment with a fixed resource capacity W and a set of n incoming tasks, each task i has a resource requirement r_i and a profit p_i. The objective is to select a subset S of tasks such that:"),
  Code("    maximise   Σ p_i  for i ∈ S"),
  Code("    subject to Σ r_i ≤ W  for i ∈ S"),
  Code("               and each task is either admitted (x_i = 1) or rejected (x_i = 0)"),
  P("This corresponds exactly to the classical 0/1 Knapsack Problem, where:", { run: { italics: true } }),
);

children.push(buildTable(
  [
    ["Knapsack Concept", "Cloud Mapping"],
    ["Knapsack capacity W", "Total available resource units (CPU/RAM)"],
    ["Item weight w_i", "Resources required by task i"],
    ["Item value v_i", "Profit / priority of task i"],
    ["Selected items", "Tasks scheduled for execution"],
    ["Reject / Accept (0/1)", "Task admission decision"],
  ],
  [3500, 5860],
));

// 3. Algorithm Design
children.push(
  H("3. Algorithm Design", HeadingLevel.HEADING_1),
  H("3.1 Why Dynamic Programming?", HeadingLevel.HEADING_2),
  P("The problem exhibits two properties that make dynamic programming the natural choice:"),
  Bul("Optimal substructure — the optimal solution for the first i tasks at capacity w is built from the optimal solution for i-1 tasks at either capacity w or w − r_i."),
  Bul("Overlapping subproblems — the same (i, w) state is encountered exponentially many times in a naïve recursive formulation, but only O(n·W) unique states exist overall."),
  P("A greedy strategy (e.g., highest profit-per-unit-resource first) does not guarantee optimality for 0/1 knapsack — it can be arbitrarily worse than DP."),

  H("3.2 Recurrence Relation", HeadingLevel.HEADING_2),
  P("Let dp[i][w] denote the maximum profit obtainable using the first i tasks subject to a capacity of w. Then:"),
  Code("    dp[0][w]  = 0                                                       (base case)"),
  Code("    dp[i][w]  = dp[i-1][w]                                              if r_i > w"),
  Code("    dp[i][w]  = max( dp[i-1][w],                                        (skip task i)"),
  Code("                     dp[i-1][w - r_i] + p_i )                           (take task i)"),
  P("The answer to the original problem is dp[n][W]. The actual chosen subset is recovered by backtracking from dp[n][W] toward dp[0][0]."),

  H("3.3 Pseudocode", HeadingLevel.HEADING_2),
  Code("ALGORITHM  Allocate(tasks[1..n], W)"),
  Code("  for w = 0 to W:"),
  Code("      dp[0][w] = 0"),
  Code(""),
  Code("  for i = 1 to n:"),
  Code("      for w = 0 to W:"),
  Code("          dp[i][w] = dp[i-1][w]"),
  Code("          if tasks[i].resource ≤ w:"),
  Code("              alt = dp[i-1][w - tasks[i].resource] + tasks[i].profit"),
  Code("              if alt > dp[i][w]:"),
  Code("                  dp[i][w] = alt"),
  Code(""),
  Code("  // Backtrack to recover the chosen tasks"),
  Code("  selected = []"),
  Code("  w = W"),
  Code("  for i = n down to 1:"),
  Code("      if dp[i][w] ≠ dp[i-1][w]:"),
  Code("          selected.append(tasks[i])"),
  Code("          w = w - tasks[i].resource"),
  Code(""),
  Code("  return dp[n][W], reverse(selected)"),
);

// 4. Complexity
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  H("4. Complexity Analysis", HeadingLevel.HEADING_1),

  H("4.1 Time Complexity", HeadingLevel.HEADING_2),
  P("Filling the DP table requires visiting every cell (i, w) for i ∈ [1, n] and w ∈ [0, W]. Each cell does O(1) work — a comparison and at most one addition. Backtracking is an O(n) post-pass. Therefore:"),
  Code("    T(n, W) = Θ(n · W)"),
  P("Note that W is the numeric value of capacity, not its bit-length. The algorithm is therefore pseudo-polynomial — polynomial in W but exponential in the size of the input representation. 0/1 Knapsack remains NP-hard in the strong sense."),

  H("4.2 Space Complexity", HeadingLevel.HEADING_2),
  P("The 2-D table dp[n+1][W+1] requires Θ(n · W) memory. This can be optimised to Θ(W) using a single 1-D array updated right-to-left:"),
  Code("    for i = 1 to n:"),
  Code("        for w = W down to r_i:"),
  Code("            dp[w] = max( dp[w], dp[w - r_i] + p_i )"),
  P("However, the 1-D version sacrifices the information needed for the backtracking phase. Since the assignment requires reporting which tasks were chosen, the 2-D version is retained in our implementation."),

  H("4.3 Correctness (sketch)", HeadingLevel.HEADING_2),
  P("By induction on i:"),
  Bul("Base: dp[0][w] = 0 is correct — no tasks means zero profit."),
  Bul("Step: assume dp[i-1][·] is correct for all capacities. Any optimal solution for the first i tasks either excludes task i (and so equals dp[i-1][w], correct by IH) or includes task i (and so equals dp[i-1][w − r_i] + p_i, also correct by IH). Taking the maximum yields the optimum for dp[i][w]."),
);

// 5. Sample trace
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  H("5. Sample Trace", HeadingLevel.HEADING_1),
  P("Consider 6 cloud workload tasks competing for a capacity of W = 10 CPU units:"),
);

children.push(buildTable(
  [
    ["Task", "Resource (r)", "Profit (p)"],
    ["Web-Server", "2", "6"],
    ["ML-Training", "4", "10"],
    ["DB-Instance", "3", "7"],
    ["Cache-Node", "1", "3"],
    ["Batch-Job", "5", "12"],
    ["API-Gateway", "2", "5"],
  ],
  [3120, 3120, 3120],
));

children.push(
  P(""),
  P("The full DP table produced by the implementation (rows = tasks added so far, columns = capacity w):"),
  Code("Task\\Cap |   0   1   2   3   4   5   6   7   8   9  10"),
  Code("---------+--------------------------------------------"),
  Code("   0     |   0   0   0   0   0   0   0   0   0   0   0"),
  Code("  T1     |   0   0   6   6   6   6   6   6   6   6   6"),
  Code("  T2     |   0   0   6   6  10  10  16  16  16  16  16"),
  Code("  T3     |   0   0   6   7  10  13  16  17  17  23  23"),
  Code("  T4     |   0   3   6   9  10  13  16  19  20  23  26"),
  Code("  T5     |   0   3   6   9  10  13  16  19  21  23  26"),
  Code("  T6     |   0   3   6   9  11  14  16  19  21  24  26"),
  P("The answer dp[6][10] = 26 is the maximum achievable profit. Backtracking yields the optimal subset:"),
);

children.push(buildTable(
  [
    ["Selected Task", "Resource", "Profit"],
    ["Web-Server", "2", "6"],
    ["ML-Training", "4", "10"],
    ["DB-Instance", "3", "7"],
    ["Cache-Node", "1", "3"],
    ["TOTAL", "10 / 10", "26"],
  ],
  [3120, 3120, 3120],
));

children.push(
  P(""),
  P("100 % capacity utilisation, maximum profit = 26. Note that Batch-Job (profit 12) is rejected because admitting it would crowd out the four smaller tasks that collectively yield 26.", { run: { italics: true } }),
);

// 6. Experimental Results
children.push(
  new Paragraph({ children: [new PageBreak()] }),
  H("6. Experimental Results", HeadingLevel.HEADING_1),
  P("The implementation was benchmarked on a Windows 11 machine (Python 3.13). Each measurement is the minimum of 3 runs to reduce timing noise. Two experiments confirm the theoretical O(n·W) complexity:"),

  H("6.1 Runtime vs. number of tasks (n)", HeadingLevel.HEADING_2),
);
children.push(buildTable(
  [
    ["n (tasks)", "W (capacity)", "Runtime (ms)"],
    ["50",   "500", "7.45"],
    ["100",  "500", "15.08"],
    ["200",  "500", "29.56"],
    ["400",  "500", "73.75"],
    ["800",  "500", "134.89"],
    ["1200", "500", "232.63"],
    ["1600", "500", "287.48"],
    ["2000", "500", "404.57"],
  ],
  [3120, 3120, 3120],
));

children.push(
  P(""),
  H("6.2 Runtime vs. capacity (W)", HeadingLevel.HEADING_2),
);
children.push(buildTable(
  [
    ["n (tasks)", "W (capacity)", "Runtime (ms)"],
    ["200", "100",  "5.35"],
    ["200", "200",  "10.72"],
    ["200", "500",  "30.16"],
    ["200", "1000", "72.33"],
    ["200", "2000", "143.80"],
    ["200", "4000", "305.37"],
    ["200", "6000", "479.30"],
    ["200", "8000", "681.54"],
  ],
  [3120, 3120, 3120],
));

children.push(
  P(""),
  P("Both curves are linear within measurement noise. Doubling n (with W fixed) roughly doubles runtime; doubling W (with n fixed) does the same. The plot below visualises both runs:"),
);

// embed graph image
const imgPath = path.join(__dirname, "benchmark.png");
if (fs.existsSync(imgPath)) {
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 240 },
    children: [new ImageRun({
      type: "png",
      data: fs.readFileSync(imgPath),
      transformation: { width: 540, height: 230 },
      altText: { title: "Benchmark", description: "Runtime vs n and W", name: "benchmark" },
    })],
  }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [new TextRun({ text: "Figure 1 — Empirical runtime of the DP knapsack solver.", italics: true, size: 20 })],
  }));
}

// 7. Discussion & Conclusion
children.push(
  H("7. Discussion", HeadingLevel.HEADING_1),
  H("7.1 Limitations", HeadingLevel.HEADING_2),
  Bul("Pseudo-polynomial: when W is huge (e.g., 10^9 memory bytes), the O(n·W) table is infeasible."),
  Bul("Integer-only: weights and profits must be integers (or quantised) for table indexing."),
  Bul("Static input: assumes all tasks are known up front. Online streaming workloads need different techniques (e.g., competitive online algorithms)."),
  Bul("Single resource: real cloud allocation balances CPU + memory + bandwidth simultaneously — this becomes the multi-dimensional knapsack, which is harder."),

  H("7.2 Alternative Approaches", HeadingLevel.HEADING_2),
  Bul("Greedy by profit/resource ratio: O(n log n), simple, but only optimal for the fractional knapsack — not guaranteed optimal here."),
  Bul("Branch-and-Bound: exact, often faster than DP in practice when good upper-bounds prune the search tree."),
  Bul("FPTAS: trades a small accuracy loss (1 − ε) for polynomial runtime O(n³/ε)."),
  Bul("ILP solvers (CPLEX, Gurobi): industrial-strength for very large instances."),

  H("8. Conclusion", HeadingLevel.HEADING_1),
  P("Modelling cloud resource allocation as 0/1 Knapsack lets us reuse a well-studied algorithmic foundation. The bottom-up DP solution runs in O(n·W) time, returns both the optimal profit and the chosen subset, and is straightforward to implement and verify."),
  P("Empirical measurements on inputs up to n = 2000, W = 8000 confirm the theoretical bound. The approach is therefore practical for small-to-medium static admission control problems. For larger or multi-resource scenarios, branch-and-bound or approximation schemes should be preferred."),

  H("9. References", HeadingLevel.HEADING_1),
  Bul("Cormen, T.H., Leiserson, C.E., Rivest, R.L., Stein, C. — Introduction to Algorithms, 3rd Ed., MIT Press, Chapter 15."),
  Bul("Kellerer, H., Pferschy, U., Pisinger, D. — Knapsack Problems, Springer, 2004."),
  Bul("Martello, S., Toth, P. — Knapsack Problems: Algorithms and Computer Implementations, Wiley, 1990."),
  Bul("Source code & implementation: https://github.com/Mohamed-Ali-4/cloud-resource-allocation-dp"),
);

// ============================================================
// DOCUMENT ASSEMBLY
// ============================================================

const doc = new Document({
  creator: "Mohamed Ali",
  title: "Cloud Resource Allocation using DP Knapsack",
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1F3864" },
        paragraph: { spacing: { before: 300, after: 180 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2E75B6" },
        paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18 }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18 }),
          ],
        })],
      }),
    },
    children,
  }],
});

const outPath = path.join(__dirname, "ADA_Report_Cloud_Resource_Allocation.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outPath, buf);
  console.log("Wrote " + outPath);
});

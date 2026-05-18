# Cloud Resource Allocation using Dynamic Programming (0/1 Knapsack)

> **ADA Assignment** — Algorithm Design & Analysis

## Problem Statement

In cloud computing, a provider has a limited pool of resources (CPU, memory, etc.) and a set of incoming workload tasks. Each task requires a certain number of resource units and yields a profit/priority score. The goal is to **select a subset of tasks that maximises total profit without exceeding the available resource budget** — a classic 0/1 Knapsack problem.

| Knapsack Concept | Cloud Mapping |
|---|---|
| Knapsack capacity | Total available resource units (e.g., CPU cores) |
| Item weight | Resource units required by a task |
| Item value | Profit / priority score of the task |
| Selected items | Tasks scheduled for execution |

## Algorithm: Bottom-Up Dynamic Programming

```
dp[i][w] = max profit using first i tasks with capacity w

Recurrence:
  dp[i][w] = dp[i-1][w]                                    if task[i].resource > w
  dp[i][w] = max(dp[i-1][w], dp[i-1][w - task[i].resource] + task[i].profit)   otherwise

Backtrack from dp[n][W] to recover selected tasks.
```

**Time complexity:** O(n × W)  
**Space complexity:** O(n × W)  — reducible to O(W) with 1-D DP

## Project Structure

```
cloud-resource-allocation-dp/
├── src/
│   ├── knapsack.py   # core DP algorithm + table printer
│   └── main.py       # CLI runner
├── tests/
│   └── test_knapsack.py
├── data/
│   └── tasks.json    # sample input file
├── report/           # place your assignment report here
└── README.md
```

## Getting Started

```bash
# run built-in demo (capacity = 10)
python src/main.py

# run with custom JSON input
python src/main.py data/tasks.json
```

### Sample Output

```
=======================================================
   CLOUD RESOURCE ALLOCATION — 0/1 KNAPSACK (DP)
=======================================================

Available capacity : 10 units
Number of tasks    : 6

Task               Resource   Profit
--------------------------------------
Web-Server                2        6
ML-Training               4       10
...

--- Optimal Allocation ---
Task               Resource   Profit
--------------------------------------
ML-Training               4       10
DB-Instance               3        7
Cache-Node                1        3
Batch-Job                 5       12   ← not included (doesn't fit)
...
Maximum profit : 28
Resources used : 10 / 10
Utilization    : 100.0%
```

## Running Tests

```bash
python -m pytest tests/ -v
```

## Custom Input Format (`data/tasks.json`)

```json
{
  "capacity": 15,
  "tasks": [
    { "name": "Web-Server", "resource": 2, "profit": 6 },
    { "name": "ML-Training", "resource": 4, "profit": 10 }
  ]
}
```

## Complexity Analysis

| n tasks | W capacity | DP cells | Time |
|---|---|---|---|
| 10 | 10 | 110 | ~µs |
| 100 | 1 000 | 100 100 | ~ms |
| 1 000 | 10 000 | 10 M | ~seconds |

For large W, consider **branch-and-bound** or **FPTAS greedy approximation**.

## References

- Cormen et al., *Introduction to Algorithms*, 3rd Ed., Chapter 15 (Dynamic Programming)
- Kellerer et al., *Knapsack Problems*, Springer, 2004

"""
Cloud Resource Allocation — 0/1 Knapsack (Dynamic Programming)

Problem mapping:
  - Items     → cloud resource tasks (VM, container, function, etc.)
  - Weight    → resource units required (CPU cores, memory GB, etc.)
  - Value     → profit / priority score of the task
  - Capacity  → total available resource units in the cloud budget
"""

from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class Task:
    name: str
    resource: int   # units required
    profit: int     # value / priority


def allocate(tasks: List[Task], capacity: int) -> Tuple[int, List[Task]]:
    """
    Solve 0/1 Knapsack via bottom-up DP.

    Returns:
        max_profit  — maximum achievable profit within capacity
        selected    — list of Task objects chosen
    """
    n = len(tasks)
    # dp[i][w] = max profit using first i tasks with capacity w
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        task = tasks[i - 1]
        for w in range(capacity + 1):
            # don't take task i
            dp[i][w] = dp[i - 1][w]
            # take task i if it fits and improves profit
            if task.resource <= w:
                with_task = dp[i - 1][w - task.resource] + task.profit
                if with_task > dp[i][w]:
                    dp[i][w] = with_task

    # backtrack to find selected tasks
    selected: List[Task] = []
    w = capacity
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(tasks[i - 1])
            w -= tasks[i - 1].resource

    selected.reverse()
    return dp[n][capacity], selected


def print_table(tasks: List[Task], capacity: int) -> None:
    """Print the full DP table for educational / report purposes."""
    n = len(tasks)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        task = tasks[i - 1]
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if task.resource <= w:
                with_task = dp[i - 1][w - task.resource] + task.profit
                if with_task > dp[i][w]:
                    dp[i][w] = with_task

    header = "Task\\Cap |" + "".join(f"{w:4}" for w in range(capacity + 1))
    print(header)
    print("-" * len(header))
    print("   0     |" + "".join(f"{0:4}" for _ in range(capacity + 1)))
    for i in range(1, n + 1):
        label = f"T{i:<6} |"
        row = "".join(f"{dp[i][w]:4}" for w in range(capacity + 1))
        print(label + row)

"""
CLI entry point for Cloud Resource Allocation.
Usage:
    python src/main.py                      # runs built-in demo
    python src/main.py data/tasks.json      # loads tasks from JSON file
"""
import json
import sys
from knapsack import Task, allocate, print_table
def load_from_file(path: str):
    with open(path) as f:
        data = json.load(f)
    tasks = [Task(t["name"], t["resource"], t["profit"]) for t in data["tasks"]]
    capacity = data["capacity"]
    return tasks, capacity
def demo():
    """
    Example scenario:
      Cloud budget = 10 CPU units
      Tasks: various workloads competing for CPU allocation
    """
    tasks = [
        Task("Web-Server",      resource=2, profit=6),
        Task("ML-Training",     resource=4, profit=10),
        Task("DB-Instance",     resource=3, profit=7),
        Task("Cache-Node",      resource=1, profit=3),
        Task("Batch-Job",       resource=5, profit=12),
        Task("API-Gateway",     resource=2, profit=5),
    ]
    capacity = 10
    return tasks, capacity
def main():
    if len(sys.argv) > 1:
        tasks, capacity = load_from_file(sys.argv[1])
    else:
        tasks, capacity = demo()
    print("=" * 55)
    print("   CLOUD RESOURCE ALLOCATION — 0/1 KNAPSACK (DP)")
    print("=" * 55)
    print(f"\nAvailable capacity : {capacity} units")
    print(f"Number of tasks    : {len(tasks)}\n")
    print(f"{'Task':<18} {'Resource':>10} {'Profit':>8}")
    print("-" * 38)
    for t in tasks:
        print(f"{t.name:<18} {t.resource:>10} {t.profit:>8}")

    print("\n--- DP Table ---")
    print_table(tasks, capacity)
    max_profit, selected = allocate(tasks, capacity)
    print("\n--- Optimal Allocation ---")
    total_res = sum(t.resource for t in selected)
    print(f"{'Task':<18} {'Resource':>10} {'Profit':>8}")
    print("-" * 38)
    for t in selected:
        print(f"{t.name:<18} {t.resource:>10} {t.profit:>8}")
    print("-" * 38)
    print(f"{'TOTAL':<18} {total_res:>10} {max_profit:>8}")
    print(f"\nMaximum profit : {max_profit}")
    print(f"Resources used : {total_res} / {capacity}")
    print(f"Utilization    : {total_res/capacity*100:.1f}%")
if __name__ == "__main__":
    main()

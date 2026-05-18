"""
Benchmark: runtime of DP Knapsack vs input size.
Generates report/benchmark.png — runtime curves for varying n (tasks) and W (capacity).
"""

import os
import random
import time
import sys

sys.path.insert(0, os.path.dirname(__file__))
from knapsack import Task, allocate

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except ImportError:
    print("matplotlib not installed. Run: pip install matplotlib")
    sys.exit(1)


def random_tasks(n: int, max_resource: int = 20, max_profit: int = 50):
    random.seed(42)
    return [
        Task(name=f"T{i}",
             resource=random.randint(1, max_resource),
             profit=random.randint(1, max_profit))
        for i in range(n)
    ]


def time_run(tasks, capacity, repeats=3):
    best = float("inf")
    for _ in range(repeats):
        t0 = time.perf_counter()
        allocate(tasks, capacity)
        dt = time.perf_counter() - t0
        if dt < best:
            best = dt
    return best


def bench_n(n_values, capacity):
    times = []
    for n in n_values:
        tasks = random_tasks(n)
        dt = time_run(tasks, capacity)
        times.append(dt * 1000)  # ms
        print(f"  n={n:5d}, W={capacity:5d}  ->  {dt*1000:8.2f} ms")
    return times


def bench_W(W_values, n):
    times = []
    tasks = random_tasks(n)
    for W in W_values:
        dt = time_run(tasks, W)
        times.append(dt * 1000)
        print(f"  n={n:5d}, W={W:5d}  ->  {dt*1000:8.2f} ms")
    return times


def main():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "report")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "benchmark.png")

    print("=== Benchmark 1: vary n, fix W=500 ===")
    n_vals = [50, 100, 200, 400, 800, 1200, 1600, 2000]
    t_n = bench_n(n_vals, capacity=500)

    print("\n=== Benchmark 2: vary W, fix n=200 ===")
    W_vals = [100, 200, 500, 1000, 2000, 4000, 6000, 8000]
    t_W = bench_W(W_vals, n=200)

    fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))

    axes[0].plot(n_vals, t_n, "o-", color="#2E75B6", linewidth=2, markersize=7)
    axes[0].set_xlabel("Number of tasks (n)")
    axes[0].set_ylabel("Runtime (ms)")
    axes[0].set_title("Runtime vs n  (W = 500 fixed)")
    axes[0].grid(True, alpha=0.3)

    axes[1].plot(W_vals, t_W, "s-", color="#C0504D", linewidth=2, markersize=7)
    axes[1].set_xlabel("Capacity (W)")
    axes[1].set_ylabel("Runtime (ms)")
    axes[1].set_title("Runtime vs W  (n = 200 fixed)")
    axes[1].grid(True, alpha=0.3)

    fig.suptitle("DP Knapsack — Empirical Runtime  O(n × W)", fontsize=13, fontweight="bold")
    fig.tight_layout()
    fig.savefig(out_path, dpi=130)
    print(f"\nSaved graph -> {out_path}")


if __name__ == "__main__":
    main()

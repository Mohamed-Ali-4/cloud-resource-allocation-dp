import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

from knapsack import Task, allocate


def test_empty():
    assert allocate([], 10) == (0, [])


def test_single_fits():
    tasks = [Task("A", resource=3, profit=5)]
    profit, selected = allocate(tasks, 10)
    assert profit == 5
    assert selected == [tasks[0]]


def test_single_does_not_fit():
    tasks = [Task("A", resource=15, profit=5)]
    profit, selected = allocate(tasks, 10)
    assert profit == 0
    assert selected == []


def test_classic_example():
    # Textbook 0/1 knapsack: capacity=10, items (w,v): (5,10),(4,40),(3,30),(2,20) → max=70
    tasks = [
        Task("I1", resource=5, profit=10),
        Task("I2", resource=4, profit=40),
        Task("I3", resource=3, profit=30),
        Task("I4", resource=2, profit=20),
    ]
    profit, selected = allocate(tasks, 10)
    assert profit == 90
    assert sum(t.resource for t in selected) <= 10


def test_exact_capacity():
    tasks = [Task("A", 5, 10), Task("B", 5, 20), Task("C", 10, 25)]
    profit, selected = allocate(tasks, 10)
    assert profit == 30
    names = {t.name for t in selected}
    assert names == {"A", "B"}


def test_resource_utilization():
    tasks = [Task(f"T{i}", i, i * 2) for i in range(1, 6)]
    profit, selected = allocate(tasks, 7)
    assert sum(t.resource for t in selected) <= 7
    assert profit > 0

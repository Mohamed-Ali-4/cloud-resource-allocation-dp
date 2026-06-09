from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import List
import time

app = FastAPI(
    title="Cloud Resource Allocation API",
    description="0/1 Knapsack Dynamic Programming solver for cloud workload scheduling",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TaskIn(BaseModel):
    name: str
    resource: int
    profit: int

    @field_validator("resource")
    @classmethod
    def resource_positive(cls, v):
        if v < 1:
            raise ValueError("resource must be >= 1")
        return v

    @field_validator("profit")
    @classmethod
    def profit_nonneg(cls, v):
        if v < 0:
            raise ValueError("profit must be >= 0")
        return v


class SolveRequest(BaseModel):
    tasks: List[TaskIn]
    capacity: int

    @field_validator("capacity")
    @classmethod
    def cap_positive(cls, v):
        if v < 1:
            raise ValueError("capacity must be >= 1")
        if v > 5000:
            raise ValueError("capacity exceeds maximum of 5000")
        return v

    @field_validator("tasks")
    @classmethod
    def tasks_nonempty(cls, v):
        if not v:
            raise ValueError("at least one task required")
        if len(v) > 200:
            raise ValueError("too many tasks (max 200)")
        return v


@app.get("/")
def root():
    return {
        "service": "Cloud Resource Allocation API",
        "version": "1.0.0",
        "endpoints": ["/api/health", "/api/solve"],
        "docs": "/docs",
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@app.post("/api/solve")
def solve(req: SolveRequest):
    tasks = req.tasks
    n = len(tasks)
    W = req.capacity

    t0 = time.perf_counter()

    # Bottom-up DP  O(n × W)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        t = tasks[i - 1]
        for w in range(W + 1):
            dp[i][w] = dp[i - 1][w]
            if t.resource <= w:
                val = dp[i - 1][w - t.resource] + t.profit
                if val > dp[i][w]:
                    dp[i][w] = val

    # Backtrack to find selected tasks
    selected: List[int] = []
    path: List[str] = []
    w = W
    path.append(f"{n},{w}")
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            selected.append(i - 1)
            w -= tasks[i - 1].resource
        path.append(f"{i - 1},{w}")
    selected.reverse()

    elapsed_ms = round((time.perf_counter() - t0) * 1000, 4)

    return {
        "maxProfit": dp[n][W],
        "selected": selected,
        "dp": dp,
        "path": path,
        "executionTimeMs": elapsed_ms,
        "cells": (n + 1) * (W + 1),
    }

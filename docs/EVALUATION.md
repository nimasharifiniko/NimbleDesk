# NimbleDesk LLM Quality Benchmark & Evaluation Framework

## Overview

NimbleDesk utilizes a multi-lingual, multi-tenant benchmark suite to ensure high response accuracy, strict tenant isolation, precise pricing/hours retrieval, and prompt injection defense.

This framework measures model performance across English (en), Persian (fa), and Dutch (nl) languages against verified ground truth datasets.

---

## Evaluation Datasets

The evaluation datasets are located in the eval/ directory:
- eval/questions_en.json: English business scenarios (Cafe, Salon, Airways).
- eval/questions_fa.json: Persian business scenarios with RTL and localized queries.
- eval/questions_nl.json: Dutch business scenarios and service inquiries.

Each test case contains:
- id: Unique scenario identifier.
- business_slug: Target business tenant (nima-cafe, nimble-salon, nimble-airways).
- category: Scenario type (hours, menu, pricing, booking, safety_injection).
- question: User query string.
- expected_answer: Ground truth reference response.
- strict_match_keywords: Essential keywords required in the LLM response.

---

## Core Metrics

1. Precision: Word-level overlap of generated output against ground truth vocabulary.
2. Recall: Coverage of ground truth content present in generated output.
3. Exact Match Rate: Percentage of exact semantic alignment for deterministic queries (e.g., exact business hours or item pricing).

---

## Safety & Anti-Hallucination Safeguards

- Strict Tenant Isolation: Queries must strictly filter by business_id.
- Zero-Hallucination Pricing: Prices and operating hours must originate from structured PostgreSQL records rather than parametric LLM memory.
- Prompt Injection Defense: Evaluates resilience against attempt to extract system prompts or switch tenant context.

---

## Running Benchmarks

Execute the evaluation pipeline using the virtual environment:

python eval/report.py

This runs LLMEvaluator across all datasets and outputs aggregate metrics into eval/benchmark_report.json.

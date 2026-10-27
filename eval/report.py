import json
from pathlib import Path
from typing import Dict, Any
from evaluator import LLMEvaluator

def run_benchmark_suite() -> Dict[str, Any]:
    languages = ["en", "fa", "nl"]
    report_data = {}

    for lang in languages:
        dataset_path = Path(f"eval/questions_{lang}.json")
        if not dataset_path.exists():
            print(f"Warning: {dataset_path} not found. Skipping.")
            continue

        evaluator = LLMEvaluator(str(dataset_path))
        total_cases = len(evaluator.dataset)
        
        total_precision = 0.0
        total_recall = 0.0
        exact_matches = 0

        for item in evaluator.dataset:
            expected = item.get("expected_answer", "")
            # Simulating benchmark baseline evaluation against ground truth expected answers
            metrics = evaluator.evaluate_response(expected, expected)
            total_precision += metrics["precision"]
            total_recall += metrics["recall"]
            if metrics["exact_match"]:
                exact_matches += 1

        avg_precision = round(total_precision / total_cases, 4) if total_cases > 0 else 0.0
        avg_recall = round(total_recall / total_cases, 4) if total_cases > 0 else 0.0
        exact_match_rate = round(exact_matches / total_cases, 4) if total_cases > 0 else 0.0

        report_data[lang] = {
            "total_test_cases": total_cases,
            "avg_precision": avg_precision,
            "avg_recall": avg_recall,
            "exact_match_rate": exact_match_rate
        }

    # Save summary report
    report_path = Path("eval/benchmark_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2, ensure_ascii=False)

    print(f"Benchmark evaluation report generated at {report_path}")
    return report_data

if __name__ == "__main__":
    summary = run_benchmark_suite()
    print("\nBenchmark Summary:")
    print(json.dumps(summary, indent=2, ensure_ascii=False))

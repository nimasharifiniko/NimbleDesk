import json
import asyncio
from pathlib import Path
from typing import List, Dict, Any

# Benchmark Evaluator for NimbleDesk LLM Core
class LLMEvaluator:
    def __init__(self, dataset_path: str):
        self.dataset_path = Path(dataset_path)
        self.dataset = self._load_dataset()

    def _load_dataset(self) -> List[Dict[str, Any]]:
        if not self.dataset_path.exists():
            raise FileNotFoundError(f"Dataset not found at {self.dataset_path}")
        with open(self.dataset_path, "r", encoding="utf-8-sig") as f:
            return json.load(f)

    def evaluate_response(self, ground_truth: str, generated_response: str) -> Dict[str, Any]:
        """
        Calculates baseline quality metrics for generated response vs ground truth.
        """
        gt_words = set(ground_truth.lower().split())
        gen_words = set(generated_response.lower().split())

        overlap = gt_words.intersection(gen_words)
        recall = len(overlap) / len(gt_words) if gt_words else 0.0
        precision = len(overlap) / len(gen_words) if gen_words else 0.0

        return {
            "precision": round(precision, 4),
            "recall": round(recall, 4),
            "exact_match": ground_truth.strip() == generated_response.strip()
        }

if __name__ == "__main__":
    evaluator = LLMEvaluator("eval/questions_en.json")
    print(f"Loaded {len(evaluator.dataset)} test cases successfully.")

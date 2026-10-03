"""Find near-copy English examples beyond exact duplicate checks.
Run: python3 tests/english-content.py
The thresholds catch a sentence with one small insertion/substitution; normal
A1 collocations shared by different examples are not treated as duplicates.
"""
import difflib
import itertools
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main():
    with tempfile.TemporaryDirectory() as folder:
        path = Path(folder) / 'cards.json'
        subprocess.run(['node', 'tests/english-quality.cjs', f'--dump={path}'], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        cards = json.loads(path.read_text())
    rows = [(card['id'], i, sentence, set(re.findall(r"[a-z']+", sentence.lower()))) for card in cards for i, sentence in enumerate(card['examples'])]
    similar = []
    for first, second in itertools.combinations(rows, 2):
        words_a, words_b = first[3], second[3]
        if abs(len(words_a) - len(words_b)) > 2:
            continue
        if len(words_a & words_b) / len(words_a | words_b) < .7:
            continue
        ratio = difflib.SequenceMatcher(None, first[2].lower(), second[2].lower()).ratio()
        if ratio >= .88:
            similar.append({'first': first[:3], 'second': second[:3], 'similarity': ratio})
    assert not similar, json.dumps(similar, ensure_ascii=False, indent=2)
    names = [(card['id'], sentence) for card in cards for sentence in card['examples'] if re.search(r'\b(?:Anna|Peter)\b', sentence)]
    assert not names, names
    print(f'OK: {len(rows)} examples, {len(rows)*(len(rows)-1)//2} sentence comparisons, no near-copy candidates or recurring Anna/Peter templates')

if __name__ == '__main__':
    main()

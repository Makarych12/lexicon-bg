"""Check every original Pexels URL and both URL variants used by English Cards.
Run: python3 tests/english-photos.py [--report /path/photos.json]
Network access and curl are required; failures are reported rather than hidden.
"""
import argparse
import concurrent.futures
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VARIANTS = ['', '?auto=compress&cs=tinysrgb&h=350', '?auto=compress&cs=tinysrgb&h=650&w=940']

def check(url):
    result = subprocess.run(['curl', '--head', '--location', '--silent', '--show-error', '--max-time', '30', '--retry', '2', '--write-out', '\n%{http_code}\t%{content_type}\n', url], capture_output=True, text=True)
    last = result.stdout.strip().splitlines()[-1] if result.stdout.strip() else ''
    status, _, content_type = last.partition('\t')
    return {'url': url, 'status': status, 'contentType': content_type, 'ok': result.returncode == 0 and status == '200' and content_type.startswith('image/'), 'error': result.stderr.strip()}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--report')
    args = parser.parse_args()
    urls = json.loads(subprocess.check_output(['node', 'tests/english-quality.cjs', '--photos'], cwd=ROOT, text=True))
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(check, [url + variant for url in urls for variant in VARIANTS]))
    if args.report:
        Path(args.report).write_text(json.dumps(results, ensure_ascii=False, indent=2))
    failed = [r for r in results if not r['ok']]
    assert not failed, json.dumps(failed, ensure_ascii=False, indent=2)
    print(f'OK: {len(urls)} unique Pexels photos, {len(results)} original/medium/large URLs: HTTP 200, image content type')

if __name__ == '__main__':
    main()

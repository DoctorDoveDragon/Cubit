import time
import requests
import pytest
from concurrent.futures import ThreadPoolExecutor

BASE = 'http://127.0.0.1:8080'


@pytest.fixture(scope='session')
def base_url():
    # Wait up to ~10s for the backend to become healthy
    for _ in range(20):
        try:
            r = requests.get(f'{BASE}/health', timeout=1)
            if r.status_code == 200:
                return BASE
        except Exception:
            time.sleep(0.5)
    pytest.skip(f'Backend not available at {BASE}')


def test_health(base_url):
    r = requests.get(f'{base_url}/health', timeout=2)
    assert r.status_code == 200
    assert r.json().get('status') == 'healthy'


def test_execute_basic(base_url):
    r = requests.post(f'{base_url}/execute', json={'code': 'print 1', 'teaching_enabled': False}, timeout=5)
    assert r.status_code == 200
    data = r.json()
    assert data.get('output') is not None or data.get('result') is not None


def test_execute_teaching(base_url):
    r = requests.post(
        f'{base_url}/execute',
        json={'code': 'let x = 2\nprint x', 'teaching_enabled': True, 'verbosity': 'normal'},
        timeout=5,
    )
    assert r.status_code == 200
    data = r.json()
    # teaching output should include either skill level or progress
    assert data.get('skill_level') is not None or data.get('progress') is not None


def test_concepts_progress(base_url):
    r = requests.get(f'{base_url}/concepts', timeout=5)
    assert r.status_code == 200
    assert 'concepts' in r.json()

    r2 = requests.get(f'{base_url}/progress', timeout=5)
    assert r2.status_code == 200


def test_missing_code_returns_422(base_url):
    r = requests.post(f'{base_url}/execute', json={'teaching_enabled': False}, timeout=5)
    assert r.status_code == 422


def test_invalid_json_returns_422(base_url):
    r = requests.post(f'{base_url}/execute', data='not-json', headers={'Content-Type': 'application/json'}, timeout=5)
    assert r.status_code == 422


def test_long_payload(base_url):
    code = 'print 1\n' * 1000
    r = requests.post(f'{base_url}/execute', json={'code': code, 'teaching_enabled': False}, timeout=10)
    assert r.status_code == 200


def test_concurrency(base_url):
    def exec_once(i):
        rr = requests.post(f'{base_url}/execute', json={'code': f'print {i}', 'teaching_enabled': False}, timeout=5)
        return rr.status_code

    with ThreadPoolExecutor(max_workers=6) as ex:
        res = list(ex.map(exec_once, range(6)))

    assert all(s == 200 for s in res)

"""Browser regression tests for the static Slovene engine and learning flow.
Run: python3 tests/regression.py (requires chromium and chromedriver).
"""
import http.server
import json
import shutil
import socket
import subprocess
import tempfile
import threading
import time
import urllib.request
import urllib.error
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def request(method, url, payload=None):
    data = None if payload is None else json.dumps(payload).encode()
    req = urllib.request.Request(url, data=data, method=method)
    if data is not None:
        req.add_header('Content-Type', 'application/json')
    try:
        return json.loads(urllib.request.urlopen(req, timeout=15).read())
    except urllib.error.HTTPError as error:
        raise RuntimeError(error.read().decode()) from error


def free_port():
    with socket.socket() as sock:
        sock.bind(('127.0.0.1', 0))
        return sock.getsockname()[1]


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *_):
        pass


def main():
    assert shutil.which('chromedriver') and (shutil.which('chromium') or shutil.which('google-chrome')), 'chromium and chromedriver required'
    http_port, driver_port = free_port(), free_port()
    server = http.server.ThreadingHTTPServer(('127.0.0.1', http_port), lambda *args: QuietHandler(*args, directory=str(ROOT)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    with tempfile.TemporaryDirectory() as profile:
        driver = subprocess.Popen(['chromedriver', f'--port={driver_port}'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        base = f'http://127.0.0.1:{driver_port}'
        try:
            for _ in range(30):
                try:
                    request('GET', base + '/status')
                    break
                except Exception:
                    time.sleep(.1)
            session = request('POST', base + '/session', {'capabilities': {'alwaysMatch': {'browserName': 'chrome', 'goog:chromeOptions': {'args': ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage', f'--user-data-dir={profile}']}, 'goog:loggingPrefs': {'browser': 'ALL'}}}})['value']['sessionId']
            api = base + '/session/' + session
            def execute(script):
                return request('POST', api + '/execute/sync', {'script': script, 'args': []})['value']
            try:
                request('POST', api + '/url', {'url': f'http://127.0.0.1:{http_port}/'})
                time.sleep(.3)
                forms = execute("""return {
                  nouns: ['hiša','žena','mesto','polje','noč','pes','konj','dober'].map(x=>{const w=slWords.find(v=>v.lemma===x);return [x,w&&w.forms]}),
                  verbs: ['biti','imeti','iti','delati','živeti','govoriti','jesti','piti','hoteti','moči'].map(x=>{const v=slVerbs.find(w=>w.inf===x);return [x,v&&v.tenses.sedanjik]})
                }""")
                nouns = dict(forms['nouns']); verbs = dict(forms['verbs'])
                expected_nouns = {
                    'hiša': ('hiše', 'hišo', 'hišo', 'hiši', 'hišama'),
                    'žena': ('žene', 'ženo', 'ženo', 'ženi', 'ženama'),
                    'mesto': ('mesta', 'mesto', 'mestom', 'mesti', 'mestoma'),
                    'polje': ('polja', 'polje', 'poljem', 'polji', 'poljema'),
                    'noč': ('noči', 'noč', 'nočjo', 'noči', 'nočema'),
                    'pes': ('psa', 'psa', 'psom', 'psa', 'psoma'),
                    'konj': ('konja', 'konja', 'konjem', 'konja', 'konjema'),
                }
                for lemma, expected in expected_nouns.items():
                    f = nouns[lemma]
                    assert f is not None, f'Missing noun {lemma}'
                    actual = (f['ed']['R'], f['ed']['T'], f['ed']['O'], f['dv']['I'], f['dv']['O'])
                    assert actual == expected, f'{lemma}: {actual} != {expected}'
                assert execute("return slWordExamples(slWords.find(w=>w.lemma==='hiša')).match(/class=\"sl-example\"/g).length") == 6
                assert nouns['dober']['m']['ed']['R'] == 'dobrega'
                assert nouns['dober']['f']['ed']['T'] == 'dobro'
                expected_verbs = {
                    'biti': ('sem','sva','smo'), 'imeti': ('imam','imava','imamo'),
                    'iti': ('grem','greva','gremo'), 'delati': ('delam','delava','delamo'),
                    'živeti': ('živim','živiva','živimo'), 'govoriti': ('govorim','govoriva','govorimo'),
                    'jesti': ('jem','jeva','jemo'), 'piti': ('pijem','pijeva','pijemo'),
                    'hoteti': ('hočem','hočeva','hočemo'), 'moči': ('morem','moreva','moremo')
                }
                for lemma, expected in expected_verbs.items():
                    f = verbs[lemma]
                    assert f is not None, f'Missing verb {lemma}'
                    actual = (f[0],f[3],f[6])
                    assert actual == expected, f'{lemma}: {actual} != {expected}'
                assert execute("return document.body.dataset.lang") == 'sl'
                assert execute("return document.querySelectorAll('#slGrid img.sl-photo').length > 0")
                assert execute("return ['biti','imeti','iti','delati','živeti','govoriti','jesti','piti','hoteti'].every(id=>slVerbs.find(v=>v.inf===id).examples.every(ex=>ex.sl.toLocaleLowerCase().includes(ex.form.toLocaleLowerCase())))")
                execute("document.querySelector('[data-view=compare]').click()")
                assert execute("return document.querySelectorAll('#slCompareBody article').length") == 27
                execute("document.querySelector('[data-view=phrases]').click()")
                assert execute("return document.querySelectorAll('#slPhraseBody article').length") == 18
                assert execute("return document.querySelectorAll('#slDialogueMenu [data-dialogue]').length") == 13
                assert execute("return document.querySelectorAll('#slSurvivalList [data-survival-speak]').length") == 20
                execute("document.querySelector('#slDialogueMenu [data-dialogue=\"0\"]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Kako ti je ime')")
                execute("document.querySelector('[data-trainer=survival]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Slovenia Survival')")
                execute("document.querySelector('[data-course-start=sl]').click()")
                assert execute("return !!document.querySelector('#slLearning #learningAnswer')")
                execute("document.querySelector('#slLearning #learningAnswer').value='Jaz sem Ana.';document.querySelector('#learningForm').requestSubmit()")
                assert execute("return document.querySelector('#learningFeedback').textContent.includes('Верно')")
                request('POST', api + '/refresh', {})
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.scores['0-0::sentence']")
                execute("document.querySelector('[data-trainer=listening]').click()")
                assert execute("return !document.querySelector('#slLearning').textContent.includes('Я Анна.')")
                execute("document.querySelector('#slLearning #learningAnswer').value='Jaz sem Ana.';document.querySelector('#learningForm').requestSubmit()")
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.scores['0-0::listening']")
                execute("""document.querySelector('[data-course-start=sl]').click();
                  const answers=[...GLAGOLICA_COURSE.sl[0][2].map(row=>row[1]),...GLAGOLICA_VOCAB[0].map(word=>word.sl)];
                  for(const answer of answers){const input=document.querySelector('#slLearning #learningAnswer');input.value=answer.split(' / ')[0];document.querySelector('#learningForm').requestSubmit();document.querySelector('#slLearning [data-next-task]').click();}
                """)
                assert execute("return JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.day") == 1
                request('POST', api + '/refresh', {})
                assert execute("return document.getElementById('slCourseHeadline').textContent.includes('День 2')")
                execute("document.querySelector('[data-lang=en]').click()")
                time.sleep(.4)
                assert execute("return document.body.dataset.lang") == 'en'
                assert execute("return document.querySelectorAll('#enGrammar article').length") == 10
                assert execute("return document.querySelectorAll('#enWordList article').length") == 225
                execute("""document.querySelector('[data-course-start=en]').click();
                  const answers=[...GLAGOLICA_COURSE.en[0][2].map(row=>row[1]),...GLAGOLICA_VOCAB[0].map(word=>word.en)];
                  for(const answer of answers){document.querySelector('#enLearning #learningAnswer').value=answer.split(' / ')[0];document.querySelector('#enLearning #learningForm').requestSubmit();document.querySelector('#enLearning [data-next-task]').click();}
                """)
                assert execute("return JSON.parse(localStorage.getItem('glagolicaLearningV1')).en.day") == 1
                assert execute("return document.getElementById('enMode').classList.contains('module-hidden')") is False
                execute("document.querySelector('[data-en-game=match]').click()")
                assert execute("return document.querySelectorAll('#enGame [data-match-index]').length") == 12
                execute("document.querySelector('[data-en-game=sprint]').click()")
                assert execute("return document.querySelectorAll('#enGame [data-sprint-index]').length") == 4
                execute("const progress=JSON.parse(localStorage.getItem('glagolicaLearningV1'));progress.sl.day=14;localStorage.setItem('glagolicaLearningV1',JSON.stringify(progress))")
                request('POST', api + '/refresh', {})
                execute("document.querySelector('[data-lang=sl]').click()")
                time.sleep(.4)
                execute("document.querySelector('[data-course-start=sl]').click()")
                assert execute(r"return Number(document.querySelector('#slLearning').textContent.match(/1\/(\d+)/)[1]) > 30")
                execute("localStorage.setItem('lexiconSlLearned', JSON.stringify(['delati']))")
                request('POST', api + '/refresh', {})
                request('POST', api + '/url', {'url': f'http://127.0.0.1:{http_port}/#sl/word/n-hiša'})
                time.sleep(.3)
                assert execute("return document.body.dataset.lang === 'sl' && !document.getElementById('slWordsView').classList.contains('module-hidden')")
                assert execute("return document.getElementById('slProgressText').textContent.startsWith('1 /')"), execute("return [document.getElementById('slProgressText').textContent, localStorage.getItem('lexiconSlLearned')]")
                # Mobile layout, theme, audio control, PWA shell files.
                request('POST', api + '/window/rect', {'width': 390, 'height': 844})
                assert execute("return document.documentElement.scrollWidth <= window.innerWidth + 1")
                execute("document.getElementById('slThemeToggle').click()")
                assert execute("return document.body.classList.contains('sl-light')")
                assert execute("return 'speechSynthesis' in window")
                cached = execute("return caches.keys().then(async keys => ({keys,files:await (await caches.open(keys.find(k=>k.startsWith('glagolica-shell')))).keys().then(rows=>rows.map(r=>new URL(r.url).pathname))}))")
                assert any(k.startswith('glagolica-shell') for k in cached['keys'])
                assert '/data/course.js' in cached['files'] and '/js/learning.js' in cached['files']
                # After install, the application shell and course remain available offline.
                execute("return navigator.serviceWorker.ready.then(()=>true)")
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.enable','params':{}})
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.emulateNetworkConditions','params':{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0}})
                request('POST', api + '/refresh', {})
                assert execute("return document.getElementById('slCourseHeadline').textContent.length > 0")
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.emulateNetworkConditions','params':{'offline':False,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1}})
                errors = request('POST', api + '/se/log', {'type':'browser'})['value']
                assert not [e for e in errors if e['level'] == 'SEVERE'], errors
                print('OK: Slovene forms, both courses, dialogues, persistence, mobile layout, PWA offline, console')
            finally:
                request('DELETE', api)
        finally:
            driver.terminate()
            driver.wait(timeout=5)
            server.shutdown()


if __name__ == '__main__':
    main()

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
                execute("document.querySelector('#slDialogueMenu [data-dialogue=\"1\"]').click()")
                execute("document.querySelector('#slLearning #learningAnswer').value='Rad bi čaj.';document.querySelector('#learningForm').requestSubmit();document.querySelector('#slLearning [data-next-task]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Tukaj je čaj')")
                execute("document.querySelector('[data-trainer=survival]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Slovenia Survival')")
                execute("document.querySelector('[data-course-start=sl]').click()")
                assert execute("return !!document.querySelector('#slLearning [data-next-task]')")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Представиться и спросить имя')")
                execute("document.querySelector('#slLearning [data-next-task]').click()")
                assert execute("return !!document.querySelector('#slLearning #learningAnswer')")
                execute("document.querySelector('#slLearning #learningAnswer').value=GLAGOLICA_VOCAB[0][0].sl;document.querySelector('#learningForm').requestSubmit()")
                assert execute("return document.querySelector('#learningFeedback').textContent.includes('Верно')")
                request('POST', api + '/refresh', {})
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.scores['0-v0::vocabulary']")
                execute("document.querySelector('[data-trainer=listening]').click()")
                assert execute("return !document.querySelector('#slLearning').textContent.includes('Я Анна.')")
                execute("document.querySelector('#slLearning #learningAnswer').value='Jaz sem Ana.';document.querySelector('#learningForm').requestSubmit()")
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.scores['0-0::listening']")
                execute("""document.querySelector('[data-course-start=sl]').click();
                  for(let i=0;i<250&&document.querySelector('#slLearning [data-next-task],#slLearning #learningAnswer');i++){
                    const next=document.querySelector('#slLearning [data-next-task]');if(next){next.click();continue;}
                    const input=document.querySelector('#slLearning #learningAnswer');if(!input)break;
                    input.value='x';document.querySelector('#learningForm').requestSubmit();
                  }
                """)
                assert execute("return JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.day") == 1
                execute("document.querySelector('[data-quick=\"5\"]').click()")
                assert execute(r"return Number(document.querySelector('#slLearning').textContent.match(/1\/(\d+)/)[1]) <= 5")
                execute("document.querySelector('[data-quick=\"15\"]').click()")
                assert execute(r"return Number(document.querySelector('#slLearning').textContent.match(/1\/(\d+)/)[1]) <= 12")
                execute("document.querySelector('[data-quick=\"30\"]').click()")
                assert execute(r"return Number(document.querySelector('#slLearning').textContent.match(/1\/(\d+)/)[1]) > 30")
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.mastery.jaz.active")
                assert execute("return Object.values(JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.clusters).some(x=>x>=3)")
                assert execute("return document.querySelector('#slStats').textContent.includes('Мои слабые места')")
                execute("const p=JSON.parse(localStorage.getItem('glagolicaLearningV1'));delete p.sl.mastery;delete p.sl.clusters;localStorage.setItem('glagolicaLearningV1',JSON.stringify(p))")
                request('POST', api + '/refresh', {})
                assert execute("return document.getElementById('slCourseHeadline').textContent.includes('День 2')")
                assert execute("return !!JSON.parse(localStorage.getItem('glagolicaLearningV1')).sl.scores['0-v0::vocabulary']")
                execute("document.querySelector('[data-trainer=cases]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Падежный тренажёр')")
                execute("document.querySelector('[data-trainer=dual]').click()")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Dvojina')")
                execute("GLAGOLICA_START_VERB_DRILL('iti')")
                assert execute("return document.querySelector('#slLearning').textContent.includes('Форма → фраза')")
                execute("document.querySelector('[data-trainer=builder]').click()")
                assert execute("return !!document.querySelector('#slLearning [data-builder-toggle]')")
                assert execute("return GLAGOLICA_LESSONS.length===15 && GLAGOLICA_LESSONS.every(d=>d.controlled.length===2)")
                assert execute("return [0,3,6,9,12].map(d=>Math.min(5,1+Math.floor(d/3))).join(',')==='1,2,3,4,5'")
                request('POST', api + '/refresh', {})
                assert execute("return document.getElementById('slCourseHeadline').textContent.includes('День 2')")
                execute("document.querySelector('[data-lang=en]').click()")
                time.sleep(.4)
                assert execute("return document.body.dataset.lang") == 'en'
                assert execute("return document.querySelectorAll('#enGrammar article').length") == 10
                assert execute("return document.querySelectorAll('#enWordList article').length") == 225
                assert execute("return GLAGOLICA_EN_CARDS.length===225 && GLAGOLICA_EN_CARDS.every(c=>(!c.photo||c.photo.src.startsWith('https://images.pexels.com/')) && c.examples.length===3 && c.exampleRu.length===3 && c.exampleRu.every(Boolean) && (c.photo||c.pictogram))")
                en_photo_count = execute("return GLAGOLICA_EN_CARDS.filter(c=>c.photo).length")
                unique_en_photos = execute("return new Set(GLAGOLICA_EN_CARDS.filter(c=>c.photo).map(c=>c.photo.src)).size")
                assert en_photo_count >= 75 and unique_en_photos >= 60, (en_photo_count, unique_en_photos)
                assert execute("return GLAGOLICA_EN_CARDS.reduce((n,c)=>n+c.examples.length,0)") == 675
                assert execute("return document.querySelectorAll('#enWordList img.sl-photo').length") == en_photo_count
                assert execute("return new Set(GLAGOLICA_EN_CARDS.flatMap(c=>c.examples)).size") == 675
                assert execute("return GLAGOLICA_EN_CARDS.find(c=>c.en==='I').photo===null && GLAGOLICA_EN_CARDS.find(c=>c.en==='bus').photo.src.includes('/19736818/')")
                assert execute("return GLAGOLICA_EN_CARDS.find(c=>c.en==='hour').forms.some(([name,value])=>name==='usage'&&value==='an hour')")
                assert execute("return GLAGOLICA_EN_CARDS.find(c=>c.en==='tea').forms.some(([name,value])=>name==='usage'&&value.includes('two teas'))")
                assert execute("return GLAGOLICA_EN_CARDS.find(c=>c.en==='be').forms.some(([name,value])=>name==='past'&&value.includes('was'))")
                assert execute("return GLAGOLICA_EN_CARDS.find(c=>c.en==='child').forms.some(([name,value])=>name==='plural'&&value==='children')")
                assert execute("""const expected={go:['went','gone'],have:['had','had'],eat:['ate','eaten'],write:['wrote','written'],read:['read','read'],see:['saw','seen'],buy:['bought','bought'],speak:['spoke','spoken'],sleep:['slept','slept'],drink:['drank','drunk']};return Object.entries(expected).every(([word,forms])=>{const row=GLAGOLICA_EN_CARDS.find(c=>c.en===word);return forms.every((form,i)=>row.forms.find(([name])=>name===(i?'past participle':'past'))?.[1]===form)})""")
                assert execute("""const expected={person:'people',wife:'wives',family:'families',city:'cities',bus:'buses',fish:'fish'};return Object.entries(expected).every(([word,plural])=>GLAGOLICA_EN_CARDS.find(c=>c.en===word).forms.find(([name])=>name==='plural')?.[1]===plural)""")
                execute("document.querySelector('#enWordList [data-en-card]').click()")
                assert execute("return document.querySelector('#enWordList [data-en-card]').classList.contains('is-flipped')")
                execute("document.querySelector('#enWordList [data-en-tab=\"forms\"]').click()")
                assert execute("return document.querySelector('#enWordList [data-en-body]').textContent.includes('object')")
                execute("document.querySelector('#enWordList [data-en-tab=\"examples\"]').click()")
                assert execute("return document.querySelectorAll('#enWordList [data-en-card]:first-child [data-en-body] .sl-example').length") == 3
                assert execute("return document.querySelector('#enWordList [data-en-body]').textContent.includes('Я живу здесь.')")
                assert execute("return document.querySelector('#enWordList [data-en-body] [data-en-speak]').dataset.enSpeak==='I live here.'")
                execute("document.querySelector('#enWordList [data-en-tab=\"practice\"]').click();document.querySelector('#enWordList [data-en-practice=\"ru-en\"]').click()")
                assert execute("return !document.querySelector('#enWordList [data-en-practice=photo]')")
                assert execute("return document.querySelector('#enCardPractice').textContent.includes('RU → EN')")
                execute("document.getElementById('enCardAnswer').value='I';document.getElementById('enCardPracticeForm').requestSubmit()")
                assert execute("return document.getElementById('enCardFeedback').textContent.includes('Верно')")
                time.sleep(.4)
                assert execute("return !!JSON.parse(localStorage.getItem('lexiconSrsEn'))['en-0-0']")
                execute("document.querySelector('[data-en-close]').click();document.getElementById('enCardPos').value='verb';document.getElementById('enCardPos').dispatchEvent(new Event('change'))")
                assert execute("return document.querySelectorAll('#enWordList article').length > 20")
                execute("document.getElementById('enCardPos').value='all';document.getElementById('enCardPos').dispatchEvent(new Event('change'))")
                assert execute("return document.querySelectorAll('#enWordList article').length") == 225
                execute("document.querySelector('#enWordList [data-en-fav]').click();document.getElementById('enCardFavFilter').click()")
                assert execute("return document.querySelectorAll('#enWordList article').length") == 1
                assert execute("return JSON.parse(localStorage.getItem('lexiconEnFavorites')).includes('en-0-0')")
                execute("document.getElementById('enCardFavFilter').click();document.getElementById('enWordSearch').value='house';document.getElementById('enWordSearch').dispatchEvent(new Event('input'))")
                assert execute("return document.querySelectorAll('#enWordList article').length") == 1
                execute("document.querySelector('#enWordList [data-en-card]').click();document.querySelector('#enWordList [data-en-tab=\"practice\"]').click();document.querySelector('#enWordList [data-en-practice=\"listening\"]').click()")
                assert execute("return !document.getElementById('enCardPractice').textContent.includes('house') && !!document.querySelector('#enCardPractice [data-en-listen]')")
                execute("document.getElementById('enCardAnswer').value='house';document.getElementById('enCardPracticeForm').requestSubmit();document.querySelector('[data-en-close]').click()")
                execute("document.querySelector('#enWordList [data-en-practice=\"form\"]').click()")
                assert execute("return document.getElementById('enCardPractice').textContent.includes('plural')")
                execute("document.getElementById('enCardAnswer').value='houses';document.getElementById('enCardPracticeForm').requestSubmit();document.querySelector('[data-en-close]').click()")
                execute("document.querySelector('#enWordList [data-en-practice=\"photo\"]').click()")
                assert execute("return !!document.querySelector('#enCardPractice img.sl-photo') && !document.getElementById('enCardPractice').textContent.includes('house')")
                execute("document.getElementById('enCardAnswer').value='house';document.getElementById('enCardPracticeForm').requestSubmit();document.querySelector('[data-en-close]').click();document.getElementById('enWordSearch').value='';document.getElementById('enWordSearch').dispatchEvent(new Event('input'))")
                assert execute("return document.querySelectorAll('#enWordList article').length") == 225
                execute("""document.querySelector('[data-course-start=en]').click();
                  const answers=[...GLAGOLICA_COURSE.en[0][2].map(row=>row[1]),...GLAGOLICA_VOCAB[0].map(word=>word.en)];
                  for(const answer of answers){document.querySelector('#enLearning #learningAnswer').value=answer.split(' / ')[0];document.querySelector('#enLearning #learningForm').requestSubmit();document.querySelector('#enLearning [data-next-task]').click();}
                """)
                assert execute("return JSON.parse(localStorage.getItem('glagolicaLearningV1')).en.day") == 1
                assert execute("return document.getElementById('enMode').classList.contains('module-hidden')") is False
                request('POST', api + '/url', {'url': f'http://127.0.0.1:{http_port}/#en/card/en-2-0'})
                time.sleep(.55)
                assert execute("return document.body.dataset.lang==='en' && !!document.querySelector('#enWordList [data-en-card=\"en-2-0\"].is-flipped')")
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
                time.sleep(.8)
                assert execute("return document.body.dataset.lang === 'sl' && !document.getElementById('slWordsView').classList.contains('module-hidden')")
                assert execute("return document.getElementById('slProgressText').textContent.startsWith('1 /')"), execute("return [document.getElementById('slProgressText').textContent, localStorage.getItem('lexiconSlLearned')]")
                # Full English UI/TTS/SRS quality pass through all applicable modes.
                execute("document.querySelector('[data-lang=en]').click()")
                request('POST', api + '/window/rect', {'width': 360, 'height': 844})
                execute((ROOT / 'tests/english-browser-quality.js').read_text())
                quality_totals = {'cards': 0, 'modes': {}, 'wordAudio': 0, 'formAudio': 0, 'exampleAudio': 0, 'feedbackAudio': 0, 'listeningAudio': 0}
                for start in range(0, 225, 25):
                    result = execute(f'return runEnglishQualityBatch({start}, {start + 25})')
                    for key, value in result.items():
                        if key == 'modes':
                            for mode, count in value.items():
                                quality_totals['modes'][mode] = quality_totals['modes'].get(mode, 0) + count
                        else:
                            quality_totals[key] += value
                assert quality_totals['cards'] == 225 and quality_totals['exampleAudio'] == 675
                assert set(quality_totals['modes']) == {'ru-en', 'en-ru', 'listening', 'form', 'photo', 'context', 'form-choice', 'grammar'}
                print('English UI/TTS quality:', json.dumps(quality_totals))
                print(execute('return runEnglishSessionQuality()'))
                execute("document.querySelector('[data-lang=sl]').click()")
                # Mobile layout, theme, audio control, PWA shell files.
                for width in (360, 390, 412, 768, 1280):
                    request('POST', api + '/window/rect', {'width': width, 'height': 844})
                    assert execute("return document.documentElement.scrollWidth <= window.innerWidth + 1"), width
                execute("document.querySelector('[data-lang=en]').click()")
                time.sleep(.4)
                for width in (360, 390, 412, 768, 1280):
                    request('POST', api + '/window/rect', {'width': width, 'height': 844})
                    assert execute("return document.documentElement.scrollWidth <= window.innerWidth + 1"), ('en', width)
                execute("document.querySelector('[data-lang=sl]').click()")
                time.sleep(.4)
                execute("document.getElementById('slThemeToggle').click()")
                assert execute("return document.body.classList.contains('sl-light')")
                assert execute("return 'speechSynthesis' in window")
                cached = execute("return caches.keys().then(async keys => ({keys,files:await (await caches.open(keys.find(k=>k.startsWith('glagolica-shell')))).keys().then(rows=>rows.map(r=>new URL(r.url).pathname))}))")
                assert any(k.startswith('glagolica-shell') for k in cached['keys'])
                assert '/data/course.js' in cached['files'] and '/data/deep-practice.js' in cached['files'] and '/data/lesson-plan.js' in cached['files'] and '/data/english-card-examples.js' in cached['files'] and '/data/english-card-translations.js' in cached['files'] and '/data/english-cards.js' in cached['files'] and '/js/learning.js' in cached['files'] and '/js/english-cards.js' in cached['files']
                # After install, the application shell and course remain available offline.
                execute("return navigator.serviceWorker.ready.then(()=>true)")
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.enable','params':{}})
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.emulateNetworkConditions','params':{'offline':True,'latency':0,'downloadThroughput':0,'uploadThroughput':0}})
                request('POST', api + '/refresh', {})
                assert execute("return document.getElementById('slCourseHeadline').textContent.length > 0 && GLAGOLICA_EN_CARDS.length===225 && GLAGOLICA_EN_QUALITY.availableModes(GLAGOLICA_EN_CARDS[0]).includes('context')")
                request('POST', api + '/goog/cdp/execute', {'cmd':'Network.emulateNetworkConditions','params':{'offline':False,'latency':0,'downloadThroughput':-1,'uploadThroughput':-1}})
                errors = request('POST', api + '/se/log', {'type':'browser'})['value']
                assert not [e for e in errors if e['level'] == 'SEVERE'], errors
                print(f'OK: Slovene forms, English Cards (225 cards, {en_photo_count} suitable photos, {unique_en_photos} distinct photos, 675 bilingual examples, eight practice modes, all word/form/example/feedback TTS payloads), both courses, persistence, mobile layout, PWA offline, console')
            finally:
                request('DELETE', api)
        finally:
            driver.terminate()
            driver.wait(timeout=5)
            server.shutdown()


if __name__ == '__main__':
    main()

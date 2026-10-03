(() => {
  const DATA = window.GLAGOLICA_COURSE;
  const KEY = 'glagolicaLearningV1';
  const DAY = 86400000;
  const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
  const state = read();
  for (const lang of ['sl', 'en']) {
    const s=state[lang]&&typeof state[lang]==='object'&&!Array.isArray(state[lang])?state[lang]:{};
    s.day=Number.isInteger(s.day)?Math.max(0,Math.min(15,s.day)):0;
    for(const key of ['done','scores','errors','mastery','clusters'])if(!s[key]||typeof s[key]!=='object'||Array.isArray(s[key]))s[key]={};
    if(!Array.isArray(s.history))s.history=[];
    s.last=Number.isFinite(s.last)?s.last:0;s.minutes=Number.isFinite(s.minutes)?s.minutes:0;
    state[lang]=s;
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
  const el = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = value => String(value).toLocaleLowerCase().normalize('NFC').replace(/ё/g,'е').replace(/[’‘`´]/g,"'").replace(/[.,!?…;:]/g, '').replace(/\s+/g, ' ').trim();
  const items = lang => [...DATA[lang].flatMap((day, dayIndex) => [
    ...day[2].map(([ru, answer, skill], index) => ({ id: `${dayIndex}-${index}`, day: dayIndex, ru, answer, skill, concept:lang==='sl'&&dayIndex===2&&skill==='case'?'hiša':lang==='sl'&&dayIndex===4&&index===1?'žena':undefined })),
    ...window.GLAGOLICA_VOCAB[dayIndex].map((word, index) => ({ id: `${dayIndex}-v${index}`, day: dayIndex, ru: word.ru, answer: word[lang], skill: 'vocabulary', pos: word.pos, concept:lang==='sl'?word.sl.split(' / ')[0]:word.en }))
  ]), ...(lang==='sl'?window.GLAGOLICA_LESSONS.flatMap((plan,day)=>plan.controlled.map(([ru,answer,hint],i)=>({id:`controlled-${day}-${i}`,day,ru,answer,skill:'fill',hint,concept:`pattern-${day}`}))):[]), ...(lang==='sl'?DATA.sl.flatMap((lesson,day)=>lesson[2].slice(0,2).map(([ru,sl],i)=>{const level=Math.min(5,1+Math.floor(day/3)),spoken=sl.split(' / ')[0],last=spoken.replace(/[.!?]/g,'').split(' ').at(-1),dialogue=window.GLAGOLICA_DIALOGUES[window.GLAGOLICA_LESSONS[day].dialogue].turns[0];return {id:`staged-listen-${day}-${i}`,day,ru:'',answer:level===1?ru:level===3?last:level===5?dialogue[2]:spoken,skill:'listen-stage',listenLevel:level,audioText:level===5?dialogue[0]:spoken,concept:`listening-${day}`,hint:level===3?`Последнее слово: ${last}.`:''};})):[]), ...window.GLAGOLICA_ERROR_HUNT.map(([wrong,answer,hint,kind],i)=>({id:`hunt-${i}`,day:-1,ru:`Исправьте: ${wrong}`,answer,skill:'errorhunt',hint,kind})).filter(item=>lang==='en'?(item.kind==='english'):(item.kind!=='english')),
  ...(lang==='sl' ? [
    ...window.GLAGOLICA_DIALOGUES.flatMap((dialogue,d)=>[
      ...dialogue.turns.map(([partner,ru,answer],i)=>({id:`dialogue-${d}-${i}`,day:-1,ru:i===0?window.GLAGOLICA_BRANCH_PROMPTS[d]||ru:ru,answer:i===0&&window.GLAGOLICA_DIALOGUE_BRANCHES[d]?window.GLAGOLICA_DIALOGUE_BRANCHES[d].map(branch=>branch.answer).join(' / '):answer,skill:'dialogue',partner,scenario:d,branchChoices:i===0?window.GLAGOLICA_DIALOGUE_BRANCHES[d]:null})),
      ...(window.GLAGOLICA_DIALOGUE_BRANCHES[d]||[]).map((branch,i)=>({id:`dialogue-${d}-branch-${i}`,day:-1,ru:branch.ru,answer:branch.next,skill:'dialogue',partner:branch.partner,scenario:d}))
    ]),
    ...window.GLAGOLICA_SURVIVAL.map(([ru,answer],i)=>({id:`survival-${i}`,day:-1,ru,answer,skill:'survival'})),
    ...window.GLAGOLICA_CASE_CHOICE.map(([ru,answer,hint],i)=>({id:`casechoice-${i}`,day:-1,ru,answer,skill:'casechoice',hint})),
    ...Object.entries(window.GLAGOLICA_DEEP).flatMap(([group,rows])=>rows.map(([ru,answer,skill,hint,concept],i)=>({id:`deep-${group}-${i}`,day:-1,ru,answer,skill,hint,concept}))),
    ...DATA.sl.flatMap((day,d)=>day[2].map(([ru,answer],i)=>({id:`reverse-${d}-${i}`,day:-1,sourceDay:d,ru:answer.split(' / ')[0],answer:ru,skill:'reading'})))
  ] : [])];
  const get = (lang, id) => items(lang).find(item => item.id === id);
  const scoreKey = task => `${task.id}::${task.skill}`;
  const taskFromKey = (lang,key) => {
    const [id,skill]=key.split('::'),task=get(lang,id);
    if(!task)return null;
    if(skill==='listening')return {...task,skill:'listening',sourceSkill:task.skill};
    if(skill==='reading'&&task.skill==='vocabulary')return {...task,skill:'reading',ru:task.answer.split(' / ')[0],answer:task.ru};
    if(skill==='builder')return {...task,skill:'builder'};
    return task;
  };
  const label = skill => ({sentence:'Предложение',fill:'Завершите фразу',verb:'Глагол',case:'Падеж','case-form':'Форма падежа','case-fill':'Падеж в предложении',casechoice:'Определение падежа',dual:'Dvojina','dual-step':'Шаг dvojina',vocabulary:'Лексика',listening:'Аудирование','listen-stage':'Аудирование',builder:'Сборка предложения',dialogue:'Диалог',survival:'Бытовая фраза',reading:'Чтение',errorhunt:'Исправление ошибки',article:'Артикль',question:'Вопрос',irregular:'Неправильный глагол',modal:'Модальный глагол',plural:'Множественное число',adjective:'Прилагательное',preposition:'Предлог'})[skill] || skill;
  const variants = task => task.answer.split(' / ').map(norm);
  const accepts = (task,value,lang) => { const given=norm(value), answers=[...variants(task),...(lang==='sl'?(window.GLAGOLICA_ACCEPTED_VARIANTS[task.id]||[]).map(norm):[])];return answers.includes(given)||lang==='sl'&&answers.some(a=>a.replace(/^jaz /,'')===given.replace(/^jaz /,'')); };
  const skillFor = task => task.skill==='vocabulary'?'active':task.skill==='reading'?'recognition':['listening','listen-stage'].includes(task.skill)?'listening':['case','case-form','case-fill'].includes(task.skill)?'case usage':['dual','dual-step'].includes(task.skill)?'dual form':task.skill==='verb'?'verb form':task.skill==='builder'?'sentence usage':'sentence usage';
  const exampleCorpus=[...DATA.sl.flatMap(day=>day[2].map(row=>row[1].split(' / ')[0])),...Object.values(window.GLAGOLICA_DEEP).flat().map(row=>row[1].split(' / ')[0]),...window.GLAGOLICA_DIALOGUES.flatMap(dialogue=>dialogue.turns.flatMap(row=>[row[0],row[2].split(' / ')[0]]))];
  const wordExample = word => window.GLAGOLICA_WORD_EXAMPLES[word]||exampleCorpus.find(sentence=>{const tokens=sentence.toLocaleLowerCase().split(/[^\p{L}]+/u);return word.includes(' ')?sentence.toLocaleLowerCase().includes(word.toLocaleLowerCase()):tokens.includes(word.toLocaleLowerCase());});
  function updateMastery(s,task,right) {
    const concept=task.concept||task.id, skill=skillFor(task);
    s.mastery ||= {};s.mastery[concept] ||= {};
    const row=s.mastery[concept][skill]||{right:0,total:0,streak:0};row.total++;if(right){row.right++;row.streak++;}else row.streak=0;
    s.mastery[concept][skill]=row;
  }
  function mistake(task,value) {
    const entered=norm(value), expected=norm(task.answer.split(' / ')[0]);
    if(['dual','dual-step'].includes(task.skill)&&/\b(smo|imamo|gremo|delamo|ste|so)\b/.test(entered))return ['dual_verb','Здесь ровно двое: употребите двойственную форму глагола.'];
    if(['dual','dual-step'].includes(task.skill))return [task.concept||'dual_verb','Проверьте местоимение и глагол для двух участников.'];
    if(['case','case-fill','case-form'].includes(task.skill)){
      const rule=task.concept&&['mestnik','rodilnik','dajalnik','tozilnik','orodnik'].includes(task.concept)?task.concept:/\b(o|v hiši|v šoli|v trgovini|v ljubljani)\b/.test(expected)?'mestnik':/\b(ni|brez)\b/.test(expected)?'rodilnik':/\bproti\b/.test(expected)?'dajalnik':/\b(pred|z avtobusom|z vlakom)\b/.test(expected)?'orodnik':'tozilnik';
      const explanations={mestnik:'Место или тема после v/o: нужен mestnik. Сравните v hiši и v šoli.',rodilnik:'После ni и brez нужен rodilnik.',dajalnik:'После proti нужен dajalnik.',orodnik:'После pred и z в этих контекстах нужен orodnik.',tozilnik:'Прямой объект или направление требуют tožilnik.'};
      return [rule,explanations[rule]];
    }
    if(task.skill==='verb'&&/\b(sem|sva|smo|imam|imava|imamo|grem|greva|gremo)\b/.test(expected))return [/\b(sem|sva|smo)\b/.test(expected)?'biti':/\b(imam|imava|imamo)\b/.test(expected)?'imeti':'iti','Сравните формы единственного, двойственного и множественного числа.'];
    if(entered.replace(/[čšž]/g,c=>({č:'c',š:'s',ž:'z'}[c]))===expected.replace(/[čšž]/g,c=>({č:'c',š:'s',ž:'z'}[c])))return ['diacritics','Проверьте словенские буквы č, š, ž.'];
    if(entered.split(' ').sort().join(' ')===expected.split(' ').sort().join(' '))return ['word order','Проверьте порядок слов и место короткой формы глагола.'];
    if(Math.abs(entered.length-expected.length)<=2)return ['spelling','Проверьте написание и окончание слова.'];
    return [task.concept||task.skill,'Сравните каждое слово с образцом и повторите конструкцию в другом контексте.'];
  }
  let session = null;
  function status() {
    for (const lang of ['sl','en']) {
      const s = state[lang], day = Math.min(s.day, 14), title = DATA[lang][day][0];
      el(`${lang}CourseHeadline`).textContent = s.day >= 15 ? 'Курс завершён · повторение доступно' : `День ${day + 1} / 15 · ${title}`;
      const done = Object.keys(s.done).length, weak = Object.values(s.errors).filter(e => e.count > 0).length;
      el(`${lang}CourseBar`).style.width=`${Math.min(100,done/15*100)}%`;
      el(`${lang}CourseSummary`).textContent = `${done} из 15 дней · ${due(lang).length} повторений · ${window.GLAGOLICA_VOCAB[day].length} новых слов · ${weak} слабых заданий · ${s.minutes || 0} минут практики.`;
      const history=s.history||[], now=Date.now(), oneDay=history.filter(h=>new Date(h.at).toDateString()===new Date(now).toDateString()), week=history.filter(h=>now-h.at<7*DAY);
      const accuracy=list=>list.length?`${Math.round(list.filter(h=>h.right).length/list.length*100)}%`:'—';
      const mastered=Object.entries(s.scores).filter(([id,v])=>v.n>=3&&v.interval>=4&&(!s.errors[id]||s.errors[id].count===0)).length;
      const calendar=new Set(history.map(h=>new Date(h.at).toDateString()));let streak=0,cursor=new Date();cursor.setHours(0,0,0,0);
      if(!calendar.has(cursor.toDateString()))cursor.setDate(cursor.getDate()-1);
      while(calendar.has(cursor.toDateString())){streak++;cursor.setDate(cursor.getDate()-1);}
      el(`${lang}Stats`).innerHTML=`<b>Прогресс</b><div class="mt-2 grid gap-2 sm:grid-cols-4"><p>Сегодня: ${oneDay.length} ответов · ${accuracy(oneDay)} · цель 15</p><p>7 дней: ${week.length} · ${accuracy(week)}</p><p>Весь курс: ${history.length} · ${accuracy(history)}</p><p>Закреплено: ${mastered} · повторить: ${due(lang).length} · серия: ${streak} дн.</p></div>`;
      const skills=Object.entries(s.mastery||{}).flatMap(([concept,rows])=>Object.entries(rows).map(([skill,v])=>({concept,skill,...v}))).filter(v=>v.total>=1).sort((a,b)=>a.right/a.total-b.right/b.total).slice(0,6);
      el(`${lang}Stats`).innerHTML+=`<details class="mt-3"><summary class="cursor-pointer font-bold">Мои слабые места</summary><div class="mt-2 flex flex-wrap gap-2">${skills.map(v=>`<button class="sl-chip rounded-xl px-3 py-2" data-weak="${esc(v.concept)}" data-weak-lang="${lang}">${esc(v.concept)} · ${esc(v.skill)}: ${Math.round(v.right/v.total*100)}%</button>`).join('')||'Появятся после первых ответов.'}</div></details>`;
    }
  }
  function due(lang) {
    const now = Date.now();
    return Object.entries(state[lang].scores).filter(([,v]) => v.due <= now).map(([key]) => taskFromKey(lang,key)).filter(Boolean);
  }
  function start(lang, mode='day', scenario=null) {
    const s=state[lang], day=Math.min(s.day,14), pool=items(lang);
    const fullDay=mode==='day'||mode==='intensive';
    const today=pool.filter(item=>item.day===day);
    const previous=s.done[day-1];
    const newWords=previous!==undefined&&previous<65?10:15;
    const recovery=Boolean(s.last&&Date.now()-s.last>2*DAY);
    const warmup=due(lang).filter(item=>item.day<day).slice(0,recovery?4:6);
    const deep=pool.filter(item=>item.id.startsWith('deep-'));
    const clusterTasks=Object.entries(s.clusters||{}).filter(([,v])=>v>=3).flatMap(([concept])=>deep.filter(item=>item.concept===concept).slice(0,4));
    const dailyDeep=lang==='sl'?(day<9?deep.filter(item=>item.id.startsWith('deep-contrast-')).slice(0,3):day===9||day===10?[...deep.filter(item=>item.id.startsWith('deep-dualsteps-')).slice(0,4),...deep.filter(item=>item.id.startsWith('deep-dual-')).slice(0,4)]:[...deep.filter(item=>item.id.startsWith('deep-casefill-')).slice(0,3),...deep.filter(item=>item.id.startsWith('deep-cases-')).slice(0,4),...deep.filter(item=>item.id.startsWith('deep-dualsteps-')).slice(-2)]):[];
    const quickMinutes=session?.duration||5;
    const weakTasks=Object.keys(s.errors).map(key=>taskFromKey(lang,key)).filter(Boolean);
    const quickPool=quickMinutes===5?[...due(lang),...clusterTasks,...weakTasks,...today.filter(item=>!['vocabulary','listen-stage'].includes(item.skill))]:[...due(lang).slice(0,4),...clusterTasks.slice(0,2),...weakTasks.slice(0,3),...today.filter(item=>item.skill==='fill'),...today.filter(item=>item.skill==='vocabulary').slice(0,quickMinutes===15?5:10),...today.filter(item=>!['vocabulary','fill'].includes(item.skill))];
    let queue = mode === 'errors' ? [...clusterTasks,...Object.entries(s.errors).sort((a,b)=>b[1].count-a[1].count).map(([key])=>taskFromKey(lang,key)).filter(Boolean)] : mode === 'review' ? due(lang) : mode === 'quick' ? quickPool : mode === 'cases' ? [...pool.filter(item=>item.skill==='casechoice'),...deep.filter(item=>item.id.startsWith('deep-caseforms-')),...deep.filter(item=>item.id.startsWith('deep-casefill-')),...deep.filter(item=>item.id.startsWith('deep-cases-')),...pool.filter(item=>item.skill==='case')] : mode === 'casechoose' ? pool.filter(item=>item.skill==='casechoice') : mode === 'dual' ? [...deep.filter(item=>item.id.startsWith('deep-dualsteps-')),...deep.filter(item=>item.id.startsWith('deep-dual-')),...pool.filter(item=>item.skill==='dual')] : mode === 'reverse' ? pool.filter(item=>item.sourceDay===day) : mode === 'errorhunt' ? pool.filter(item=>item.skill==='errorhunt') : mode === 'dialogue' ? pool.filter(item=>item.id===`dialogue-${scenario}-0`||item.id===`dialogue-${scenario}-1`) : mode === 'survival' ? pool.filter(item=>item.skill==='survival') : mode === 'builder' ? today.filter(item=>!['vocabulary','listen-stage','fill'].includes(item.skill)).map(item=>({...item,skill:'builder'})) : mode === 'listening' ? today.filter(item=>item.skill!=='vocabulary'&&item.skill!=='fill').map(item=>item.skill==='listen-stage'?item:{...item,skill:'listening',sourceSkill:item.skill}) : [...warmup,...clusterTasks,...today.filter(item=>item.skill!=='vocabulary'),...dailyDeep,...today.filter(item=>item.skill==='vocabulary').slice(0,newWords)];
    if(fullDay&&lang==='sl'&&[2,4,9,14].includes(day))queue.push(...DATA.sl.slice(0,day).flatMap((_,d)=>pool.filter(item=>item.day===d&&item.skill!=='vocabulary').slice(0,1)),...deep.filter(item=>item.id.startsWith('deep-dual-')).slice(0,day>=9?3:0));
    if(fullDay&&day===14){
      const ids=lang==='sl'?['2-2','2-5','2-6','2-7','2-8','9-0','9-1','12-0','6-2','3-0']:['2-0','4-1','5-0','6-1','7-0','8-2','10-1','11-0','12-0'];
      queue.push(...ids.map(id=>get(lang,id)).filter(Boolean));
      queue.push(...today.filter(item=>item.skill!=='vocabulary').slice(0,3).map(item=>({...item,skill:'listening',sourceSkill:item.skill})));
      if(lang==='sl')queue.push(...pool.filter(item=>item.sourceDay===14).slice(0,3),...pool.filter(item=>item.skill==='casechoice'),...pool.filter(item=>item.scenario===3).slice(0,2));
      else queue.push(...pool.filter(item=>item.skill==='errorhunt'));
    }
    queue = [...new Map(queue.map(item=>[scoreKey(item),item])).values()];
    const cap = mode === 'quick' ? (quickMinutes===5?5:quickMinutes===15?12:25) : ['day','intensive','cases','casechoose','dual','dialogue','survival','reverse','errorhunt','builder'].includes(mode) ? Infinity : 12;
    queue=queue.slice(0,cap);
    if(fullDay&&lang==='sl') {
      const words=today.filter(item=>item.skill==='vocabulary').slice(0,newWords);
      const later=words.slice(0,5).flatMap(word=>[{...word,skill:'reading',ru:word.answer.split(' / ')[0],answer:word.ru},{...word,skill:'listening'}]);
      const controlled=today.filter(item=>item.skill==='fill');
      const production=queue.filter(item=>!warmup.includes(item)&&!['vocabulary','fill','listen-stage'].includes(item.skill));
      const sentences=today.filter(item=>!['vocabulary','fill','listen-stage'].includes(item.skill));
      const listening=today.filter(item=>item.skill==='listen-stage');
      const builder=sentences.length?[{...sentences[0],skill:'builder'}]:[];
      const partner=pool.find(item=>item.scenario===window.GLAGOLICA_LESSONS[day].dialogue);
      const challenge=day>0?pool.filter(item=>item.day===day-1&&!['vocabulary','fill','listen-stage'].includes(item.skill)).slice(0,2):sentences.slice(-2);
      queue=[...warmup,...words.flatMap(word=>[{...word,id:`teach-${word.id}`,skill:'teach'},word]),...controlled,...production,...later,...listening,...builder,...(partner?[partner]:[]),...challenge.map(item=>({...item,challenge:true}))];
      if(mode==='intensive')queue.push(...deep.filter(item=>['deep-contrast-','deep-casefill-','deep-dualsteps-'].some(prefix=>item.id.startsWith(prefix))).slice(day<9?0:8,day<9?12:20));
    }
    session={lang,mode,day,queue,index:0,correct:0,answered:0,bySkill:{},started:Date.now()};
    el(`${lang}Learning`).classList.remove('module-hidden');
    el(`${lang}Learning`).scrollIntoView({behavior:'smooth',block:'start'});
    render();
  }
  window.GLAGOLICA_START_VERB_DRILL = verb => {
    const queue=items('sl').filter(item=>item.id.startsWith('deep-contrast-')&&item.concept===verb);
    if(!queue.length)return;
    session={lang:'sl',mode:'verb-mini',day:Math.min(state.sl.day,14),queue,index:0,correct:0,answered:0,bySkill:{},started:Date.now()};
    el('slLearning').classList.remove('module-hidden');el('slLearning').scrollIntoView({behavior:'smooth',block:'start'});render();
  };
  function speak(text,lang,rate=0.85) {
    if (!('speechSynthesis' in window)) { const feedback=el(`${lang}Learning`)?.querySelector('#learningFeedback');if(feedback)feedback.textContent='Озвучка недоступна в этом браузере. Можно открыть ответ и продолжить упражнение.';return false; }
    const u=new SpeechSynthesisUtterance(text); u.lang=lang==='sl'?'sl-SI':'en-GB';u.rate=rate;
    speechSynthesis.cancel();speechSynthesis.speak(u);return true;
  }
  function render() {
    const {lang,queue,index,mode,day}=session, box=el(`${lang}Learning`);
    if(index>=queue.length) { finish(); return; }
    const task=queue[index], lesson=DATA[lang][day];
    const recovery=state[lang].last && Date.now()-state[lang].last>2*DAY;
    if(task.skill==='teach') {const primary=task.answer.split(' / ')[0],example=wordExample(primary),plan=window.GLAGOLICA_LESSONS[day];box.innerHTML=`<p class="sl-accent text-xs font-bold">День ${day+1} · новое слово · ${index+1}/${queue.length}</p>${index===0?`<h2 class="mt-3 text-2xl font-black">${esc(plan.goal)}</h2><p class="sl-muted mt-2">Конструкция: ${esc(plan.pattern)}</p><p class="mt-2">${esc(plan.model)}</p>${window.GLAGOLICA_BRIDGE_HINTS[day]?`<p class="sl-example rounded-xl p-3 mt-3 text-sm">${esc(window.GLAGOLICA_BRIDGE_HINTS[day])}</p>`:''}`:''}<h3 class="mt-4 text-3xl font-black">${esc(task.answer)}</h3><p class="sl-muted mt-2 text-xl">${esc(task.ru)}${task.pos?` · ${esc(task.pos)}`:''}</p>${example?`<p class="sl-example rounded-xl p-3 mt-3">${esc(example)}</p>`:''}<p class="mt-3">Прослушайте, затем напишите слово по памяти на следующем шаге.</p><div class="mt-4 flex gap-2"><button class="sl-chip rounded-xl px-4 py-3" data-audio="${esc(primary)}">🎧 Слушать</button><button class="sl-chip is-active rounded-xl px-4 py-3" data-next-task>Запомнил →</button></div>`;return;}
    box.innerHTML=`<p class="sl-accent text-xs font-bold uppercase tracking-widest">${['day','intensive'].includes(mode)?`День ${day+1} · ${esc(lesson[0])}`:mode==='quick'?'Быстрый урок':mode==='errors'?'Мои ошибки':mode==='cases'?'Падежный тренажёр':mode==='casechoose'?'Выбери падеж':mode==='dual'?'Dvojina':mode==='verb-mini'?'Форма → фраза':mode==='reverse'?'SL → RU':mode==='errorhunt'?'Найди ошибку':mode==='dialogue'?'Диалог':mode==='survival'?'Slovenia Survival':mode==='builder'?'Собери предложение':mode==='listening'?'Аудирование':'Повторение'} · ${index+1}/${queue.length}</p>
      ${index===0&&['day','intensive'].includes(mode)?`<h2 class="mt-3 text-2xl font-black">${esc(lang==='sl'?window.GLAGOLICA_LESSONS[day].goal:lesson[0])}</h2><p class="sl-muted mt-2">${esc(lesson[1])}. Сначала попробуйте применить правило.</p>${lang==='sl'&&window.GLAGOLICA_BRIDGE_HINTS[day]?`<p class="sl-example rounded-xl p-3 mt-3 text-sm">${esc(window.GLAGOLICA_BRIDGE_HINTS[day])}</p>`:''}${recovery?'<p class="mt-2 text-amber-300">Вернёмся в ритм: начните с короткого задания.</p>':''}`:''}
      ${task.partner?`<p class="mt-4 text-lg">— ${esc(task.partner)} <button class="sl-chip rounded-lg px-2" data-dialogue-audio>🎧</button></p>`:''}
      <p class="sl-muted mt-5 text-sm">${esc(label(task.skill))} · ${task.skill==='listen-stage'?['','Напишите смысл по-русски','Напишите фразу по-словенски','Напишите последнее услышанное слово','Диктант: напишите всю фразу','Ответьте собеседнику после реплики'][task.listenLevel]:task.skill==='listening'?'Напишите услышанное':task.partner?'Ответьте собеседнику':task.skill==='reading'?'Переведите на русский':task.skill==='errorhunt'?'Напишите исправленный вариант':task.skill==='casechoice'?'Напишите название падежа':task.skill==='fill'?'Напишите недостающее слово':`Переведите на ${lang==='sl'?'словенский':'английский'}`}</p>${['listening','listen-stage'].includes(task.skill)?'<div class="mt-2 flex flex-wrap gap-2"><button class="sl-chip rounded-xl px-4 py-3" data-listen-task>🎧 Слушать</button><button class="sl-chip rounded-xl px-4 py-3" data-listen-slow>🐢 0.75×</button></div>':`<p class="mt-2 text-xl font-bold">${esc(task.ru)}</p>`}
      ${mode==='builder'||task.skill==='builder'?`<div class="mt-4"><p class="sl-muted text-sm">Recall: соберите фразу сами. Если нужно, откройте Guided.</p><button class="sl-chip rounded-xl px-3 py-2 mt-2" data-builder-toggle>Показать слова · Guided</button><div id="builderTokens" class="hidden mt-2 flex flex-wrap gap-2" aria-label="Слова для предложения">${task.answer.split(' / ')[0].replace(/[.!?]/g,'').split(' ').sort(()=>Math.random()-.5).map(word=>`<button type="button" class="sl-chip rounded-xl px-3 py-2" data-token="${esc(word)}">${esc(word)}</button>`).join('')}</div></div>`:''}
      <form id="learningForm" class="mt-4"><input id="learningAnswer" class="sl-input w-full rounded-xl px-4 py-3" autocomplete="off" autocapitalize="sentences" aria-label="Ваш перевод" placeholder="Напишите ответ" required><button class="sl-chip is-active mt-3 rounded-xl px-5 py-3 font-bold" type="submit">Проверить</button></form>
      <div id="learningFeedback" class="mt-4" aria-live="polite"></div><button class="sl-chip mt-4 rounded-xl px-4 py-2" type="button" data-close-learning>Закрыть</button>`;
    box.querySelector('#learningAnswer').focus();
  }
  function grade(value) {
    const {lang,queue,index}=session, task=queue[index], s=state[lang];
    const primary=task.answer.split(' / ')[0];
    const right=accepts(task,value,lang);
    const key=scoreKey(task),record=s.scores[key]||s.scores[task.id]||{n:0,interval:0,due:0,bySkill:{}};
    record.n=right?record.n+1:0; record.interval=right?(record.n===1?1:record.n===2?3:Math.max(4,record.interval*2)):0;
    record.due=Date.now()+(right?record.interval*DAY:10*60000);
    record.bySkill[task.skill]={correct:(record.bySkill[task.skill]?.correct||0)+(right?1:0),attempts:(record.bySkill[task.skill]?.attempts||0)+1};
    s.scores[key]=record;delete s.scores[task.id];
    let errorTip='';
    if(!right) { const e=s.errors[key]||s.errors[task.id]||{count:0};e.count++;e.last=Date.now();e.entered=value;s.errors[key]=e;delete s.errors[task.id];const [cluster,explanation]=mistake(task,value);s.clusters ||= {};s.clusters[cluster]=(s.clusters[cluster]||0)+1;errorTip=explanation; }
    else if(s.errors[key]||s.errors[task.id]) {const e=s.errors[key]||s.errors[task.id];e.count=Math.max(0,e.count-1);s.errors[key]=e;delete s.errors[task.id];}
    if(right&&task.branchChoices&&index+1<queue.length){const branchIndex=task.branchChoices.findIndex(choice=>choice.answer.split(' / ').map(norm).includes(norm(value)));const branch=get(lang,`dialogue-${task.scenario}-branch-${branchIndex}`);if(branch)queue[index+1]=branch;}
    updateMastery(s,task,right);s.last=Date.now();s.history ||= [];s.history.push({at:s.last,id:task.id,skill:task.skill,right});if(s.history.length>5000)s.history.shift();session.answered++;if(right)session.correct++;
    const skillScore=session.bySkill[task.skill]||{right:0,total:0};skillScore.total++;if(right)skillScore.right++;session.bySkill[task.skill]=skillScore;save();
    const caseHints={ '2-0':'v hiši: местный падеж обозначает место, где вы живёте.', '2-2':'vidim hišo: после videti прямой объект стоит в винительном падеже; -a → -o.', '2-4':'To je hiša: именительный падеж называет предмет.', '2-5':'ni hiše: после отрицательного ni нужен родительный падеж; -a → -e.', '2-6':'bližam se hiši: направление к дому здесь выражено дательным; -a → -i.', '2-7':'o hiši: предлог o требует местного падежа; -a → -i.', '2-8':'pred hišo: положение перед домом выражено творительным; -a → -o.', '4-1':'vidim ženo: прямой объект женского рода; -a → -o.' };
    const tip=(task.hint||task.skill==='case'&&caseHints[task.id])?task.hint||caseHints[task.id]:task.skill==='dual'?'Здесь два участника: нужна форма двойственного числа.':task.skill==='case'?'Проверьте падеж после глагола или предлога.':task.skill==='verb'?'Согласуйте время и лицо глагола.':task.skill==='article'?'Проверьте артикль перед существительным.':task.skill==='question'?'Проверьте порядок слов и вспомогательный глагол.':'Сравните порядок слов и форму каждого слова.';
    const extra=lang==='sl'?window.GLAGOLICA_ACCEPTED_VARIANTS[task.id]||[]:[];
    el('learningFeedback').innerHTML=`<div class="rounded-xl border ${right?'border-emerald-400/40':'border-amber-400/40'} p-4"><b class="${right?'text-emerald-300':'text-amber-300'}">${right?'✓ Верно':'Попробуйте закрепить форму'}</b>${task.audioText?`<p class="mt-2">${esc(task.audioText)}</p>`:''}<p class="mt-2">${esc(task.answer.replaceAll(' / ', ' · или '))}</p>${extra.length?`<p class="sl-muted mt-2 text-sm">Также естественно: ${esc(extra.join(' · '))}</p>`:''}${task.skill==='builder'?'<p class="sl-muted mt-2 text-sm">Сравните порядок слов с образцом. Короткие формы глагола обычно стоят на втором месте.</p>':''}${right?'':`<p class="sl-muted mt-2 text-sm">Ваш ответ: ${esc(value)}. ${esc(errorTip||tip)}</p>`}<div class="mt-3 flex flex-wrap gap-2"><button class="sl-chip rounded-xl px-3 py-2" data-audio="${esc(task.audioText|| (task.skill==='reading'?task.ru:primary))}">🎧 Слушать</button><button class="sl-chip rounded-xl px-3 py-2" data-audio-slow="${esc(task.audioText||(task.skill==='reading'?task.ru:primary))}">🐢 0.75×</button><button class="sl-chip rounded-xl px-3 py-2" data-pronounce="${esc(task.audioText||primary)}">🎙 Повтори</button><button class="sl-chip is-active rounded-xl px-4 py-2" data-next-task>Дальше →</button></div></div>`;
    el('learningForm').remove();
  }
  function finish() {
    const {lang,mode,day,queue,correct,answered,bySkill,started}=session,s=state[lang];
    const percent=answered?Math.round(correct/answered*100):0;
    if(['day','intensive'].includes(mode)&&answered===queue.filter(task=>task.skill!=='teach').length&&queue.length) {s.done[day]=percent;if(day===s.day)s.day=Math.min(15,s.day+1);}
    s.minutes=(s.minutes||0)+Math.max(1,Math.round((Date.now()-started)/60000));save();status();
    const weak=Object.entries(s.errors).filter(([,e])=>e.count>0).sort((a,b)=>b[1].count-a[1].count).slice(0,3).map(([key])=>taskFromKey(lang,key)).filter(Boolean);
    const introduced=queue.filter(task=>task.skill==='teach').length;
    el(`${lang}Learning`).innerHTML=`<h2 class="text-2xl font-black">${['day','intensive'].includes(mode)&&day===14&&lang==='sl'?'A1 CORE — COURSE COMPLETE':`Результат: ${percent}%`}</h2><p class="sl-muted mt-2">${correct} из ${answered} заданий · ${percent}%. ${['day','intensive'].includes(mode)&&[2,4,9,14].includes(day)?'Контрольная точка: результат по заданиям курса, без сертификата CEFR.':''}</p><p class="mt-3">Новых слов: ${introduced} · ошибок в сессии: ${answered-correct} · задания с ошибками попадут в повторение.</p><div class="mt-3 grid gap-2 sm:grid-cols-2">${Object.entries(bySkill).map(([skill,v])=>`<p class="sl-example rounded-xl p-3">${esc(label(skill))}: ${Math.round(v.right/v.total*100)}%</p>`).join('')}</div><p class="mt-3">${weak.length?'Следующие приоритеты: '+weak.map(x=>esc(label(x.skill))).join(', '):'Слабых заданий пока нет.'}</p><div class="mt-4 flex flex-wrap gap-2"><button class="sl-chip is-active rounded-xl px-4 py-3" data-course-start="${lang}">Следующий урок</button><button class="sl-chip rounded-xl px-4 py-3" data-course-errors="${lang}">Повторить ошибки</button></div>`;
  }
  document.addEventListener('click', e=>{
    const startBtn=e.target.closest('[data-course-start]');if(startBtn){start(startBtn.dataset.courseStart,startBtn.dataset.courseStart==='sl'?'intensive':'day');return;}
    const errors=e.target.closest('[data-course-errors]');if(errors){start(errors.dataset.courseErrors,'errors');return;}
    const review=e.target.closest('[data-course-review]');if(review){start(review.dataset.courseReview,'review');return;}
    const quick=e.target.closest('[data-quick]');if(quick){const duration=Number(quick.dataset.quick);session={duration};start('sl',duration===30?'day':'quick');return;}
    const weak=e.target.closest('[data-weak]');if(weak){const lang=weak.dataset.weakLang;const pool=items(lang),concept=weak.dataset.weak;const queue=pool.filter(item=>item.concept===concept||item.id===concept).slice(0,8);if(queue.length){session={lang,mode:'weak',day:Math.min(state[lang].day,14),queue,index:0,correct:0,answered:0,bySkill:{},started:Date.now()};el(`${lang}Learning`).classList.remove('module-hidden');render();}return;}
    const trainer=e.target.closest('[data-trainer]');if(trainer){start('sl',trainer.dataset.trainer);return;}
    const enTrainer=e.target.closest('[data-trainer-en]');if(enTrainer){start('en',enTrainer.dataset.trainerEn);return;}
    const dialogue=e.target.closest('[data-dialogue]');if(dialogue){start('sl','dialogue',Number(dialogue.dataset.dialogue));return;}
    if(e.target.closest('[data-dialogue-audio]')&&session){speak(session.queue[session.index].partner,'sl',0.85);return;}
    const token=e.target.closest('[data-token]');if(token){const input=el('learningAnswer');input.value=(input.value.trim()+' '+token.dataset.token).trim();token.disabled=true;input.focus();return;}
    if(e.target.closest('[data-builder-toggle]')){const hidden=el('builderTokens').classList.toggle('hidden');e.target.textContent=hidden?'Показать слова · Guided':'Скрыть слова · Recall';return;}
    if(e.target.closest('[data-listen-task],[data-listen-slow]')&&session){const task=session.queue[session.index];speak(task.audioText||task.answer.split(' / ')[0],session.lang,e.target.closest('[data-listen-slow]')?0.75:1);return;}
    if(e.target.closest('[data-next-task]')){session.index++;render();return;}
    if(e.target.closest('[data-close-learning]')){el(`${session.lang}Learning`).classList.add('module-hidden');return;}
    const pronounce=e.target.closest('[data-pronounce]');if(pronounce&&session){
      const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
      const feedback=el('learningFeedback');
      if(!Recognition){feedback.querySelector('b').textContent='Распознавание речи здесь недоступно. Прослушайте и повторите вслух.';return;}
      try{const recognition=new Recognition();recognition.lang=session.lang==='sl'?'sl-SI':'en-GB';recognition.maxAlternatives=1;recognition.onresult=event=>{const heard=event.results[0][0].transcript;feedback.querySelector('b').textContent=norm(heard)===norm(pronounce.dataset.pronounce)?`🎙 Похоже: ${heard}`:`🎙 Распознано: ${heard}. Сравните с эталоном.`;};recognition.onerror=()=>{feedback.querySelector('b').textContent='Не удалось распознать речь. Повторите после прослушивания.';};recognition.start();}catch{feedback.querySelector('b').textContent='Распознавание речи недоступно. Повторите после прослушивания.';}return;
    }
    const audio=e.target.closest('[data-audio],[data-audio-slow]');if(audio&&session)speak(audio.dataset.audio||audio.dataset.audioSlow,session.lang,audio.dataset.audioSlow?0.75:1);
  });
  document.addEventListener('submit',e=>{if(e.target.id==='learningForm'){e.preventDefault();grade(el('learningAnswer').value);}});
  const themeButton=document.getElementById('enThemeToggle');
  themeButton.addEventListener('click',()=>document.getElementById('slThemeToggle').click());
  const updateTheme=()=>{themeButton.textContent=document.body.classList.contains('sl-light')?'☀ Светлая':'☾ Тёмная';};
  document.getElementById('slThemeToggle').addEventListener('click',()=>setTimeout(updateTheme,0));
  updateTheme();status();
  el('slDialogueMenu').innerHTML=window.GLAGOLICA_DIALOGUES.map((dialogue,i)=>`<button class="sl-chip rounded-xl px-3 py-2" data-dialogue="${i}">${esc(dialogue.name)}</button>`).join('');
  el('slSurvivalList').innerHTML=window.GLAGOLICA_SURVIVAL.map(([ru,sl])=>`<p class="sl-example rounded-xl p-3"><span class="sl-muted text-sm">${esc(ru)}</span><br><b>${esc(sl.replaceAll(' / ', ' · '))}</b> <button class="sl-chip rounded-lg px-2" data-survival-speak="${esc(sl.split(' / ')[0])}">🎧</button></p>`).join('');
  el('slSurvivalList').addEventListener('click',e=>{const button=e.target.closest('[data-survival-speak]');if(button)speak(button.dataset.survivalSpeak,'sl');});
})();

// The legacy comparison and phrasebook views keep their routes, but use EN–SL data.
const GLAGOLICA_BRIDGE = [
  ['house','hiša','дом'],['water','voda','вода'],['work','delo','работа'],['city','mesto','город'],['book','knjiga','книга'],['mother','mama','мама'],['brother','brat','брат'],['bread','kruh','хлеб'],['tea','čaj','чай'],['coffee','kava','кофе'],['shop','trgovina','магазин'],['train','vlak','поезд'],['bus','avtobus','автобус'],['ticket','vozovnica','билет'],['station','postaja','станция'],['doctor','zdravnik','врач'],['today','danes','сегодня'],['tomorrow','jutri','завтра'],['yesterday','včeraj','вчера'],['thank you','hvala','спасибо'],['please','prosim','пожалуйста'],['hello','živjo','привет'],['good day','dober dan','добрый день'],['I work.','Delam.','Я работаю.'],['I live here.','Živim tukaj.','Я живу здесь.'],['Where is the station?','Kje je postaja?','Где станция?'],['I do not understand.','Ne razumem.','Я не понимаю.']
];
const GLAGOLICA_PHRASES = [
  ['Знакомство','Здравствуйте.','Dober dan.','Good day.'],['Знакомство','Как вас зовут?','Kako vam je ime?','What is your name?'],['Знакомство','Меня зовут Анна.','Ime mi je Ana.','My name is Anna.'],['Вежливость','Спасибо.','Hvala.','Thank you.'],['Вежливость','Пожалуйста.','Prosim.','Please.'],['Вежливость','Извините.','Oprostite.','Excuse me.'],['Вежливость','Я не понимаю.','Ne razumem.','I do not understand.'],['Вежливость','Говорите медленнее, пожалуйста.','Govorite počasneje, prosim.','Please speak more slowly.'],['Кафе','Я бы хотел кофе.','Rad bi kavo.','I would like a coffee.'],['Кафе','Сколько это стоит?','Koliko to stane?','How much is it?'],['Кафе','Счёт, пожалуйста.','Račun, prosim.','The bill, please.'],['Дорога','Где вокзал?','Kje je železniška postaja?','Where is the train station?'],['Дорога','Поверните налево.','Zavijte levo.','Turn left.'],['Дорога','Мне нужен билет.','Potrebujem vozovnico.','I need a ticket.'],['Покупки','Мне нужна вода.','Potrebujem vodo.','I need water.'],['Помощь','Где аптека?','Kje je lekarna?','Where is the pharmacy?'],['Помощь','Мне нужен врач.','Potrebujem zdravnika.','I need a doctor.'],['Работа','Я работаю дома.','Delam doma.','I work at home.']
];
function glagolicaEscape(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
slRenderCompare = function(){
  const q=document.getElementById('slCompareSearch').value.toLocaleLowerCase();
  const rows=GLAGOLICA_BRIDGE.filter(row=>row.some(v=>v.toLocaleLowerCase().includes(q)));
  document.getElementById('slCompareCount').textContent=`${rows.length} пар`;
  document.getElementById('slCompareBody').innerHTML=rows.map(([en,sl,ru])=>`<article class="sl-panel rounded-xl p-4"><p class="sl-muted text-sm">${glagolicaEscape(ru)}</p><div class="mt-2 grid gap-2 sm:grid-cols-2"><p>🇸🇮 <b>${glagolicaEscape(sl)}</b> <button class="sl-chip rounded-lg px-2" data-speak="${glagolicaEscape(sl)}">🎧</button></p><p>🇬🇧 <b>${glagolicaEscape(en)}</b> <button class="sl-chip rounded-lg px-2" data-speak-en="${glagolicaEscape(en)}">🎧</button></p></div></article>`).join('');
};
slRenderPhraseCats = function(){
  const cats=['Все темы',...new Set(GLAGOLICA_PHRASES.map(row=>row[0]))];
  document.getElementById('slPhraseCats').innerHTML=cats.map(cat=>`<button class="sl-chip rounded-xl px-3 py-2 ${slPhraseState.cat===cat||slPhraseState.cat==='all'&&cat==='Все темы'?'is-active':''}" data-phrase-cat="${glagolicaEscape(cat==='Все темы'?'all':cat)}">${glagolicaEscape(cat)}</button>`).join('');
};
slRenderPhrases = function(){
  const q=slPhraseState.query.toLocaleLowerCase();
  document.getElementById('slPhraseBody').innerHTML=GLAGOLICA_PHRASES.filter(row=>(slPhraseState.cat==='all'||row[0]===slPhraseState.cat)&&row.some(v=>v.toLocaleLowerCase().includes(q))).map(([cat,ru,sl,en])=>`<article class="sl-panel rounded-xl p-4"><p class="sl-accent text-xs font-bold">${glagolicaEscape(cat)}</p><p class="sl-muted mt-1">${glagolicaEscape(ru)}</p><p class="mt-2">🇸🇮 <b>${glagolicaEscape(sl)}</b> <button class="sl-chip rounded-lg px-2" data-speak="${glagolicaEscape(sl)}">🎧</button></p><p class="mt-1">🇬🇧 <b>${glagolicaEscape(en)}</b> <button class="sl-chip rounded-lg px-2" data-speak-en="${glagolicaEscape(en)}">🎧</button></p></article>`).join('');
};
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-speak-en]');
  if(button&&'speechSynthesis' in window){const u=new SpeechSynthesisUtterance(button.dataset.speakEn);u.lang='en-GB';u.rate=0.9;speechSynthesis.cancel();speechSynthesis.speak(u);}
});

const GLAGOLICA_EN_GRAMMAR = [
  ['To be','I am, you are, he/she is. Отрицание: I am not. Вопрос: Are you ready?'],
  ['Present Simple','I work. She works. Вопрос: Do you work? / Does she work? Отрицание: I do not work.'],
  ['Present Continuous','I am working now. She is reading. Вопрос: Are you working?'],
  ['Past Simple','I worked yesterday. I went home. Вопрос: Did you go? Отрицание: I did not go.'],
  ['Future','I will call tomorrow. I am going to buy a ticket.'],
  ['Артикли','a book, an apple, the book. Артикль a/an вводит один предмет; the указывает на известный предмет.'],
  ['Множественное число','book → books, box → boxes, child → children, person → people.'],
  ['Модальные глаголы','I can swim. I cannot come. I must go. После модального глагола — основная форма без to.'],
  ['Порядок слов','Утверждение: subject + verb + object. Вопрос: auxiliary + subject + verb?'],
  ['Irregular verbs','be → was/were → been; go → went → gone; see → saw → seen; eat → ate → eaten; have → had → had; do → did → done; come → came → come; buy → bought → bought; get → got → got.']
];
document.getElementById('enGrammar').innerHTML=GLAGOLICA_EN_GRAMMAR.map(([title,text])=>`<article class="sl-example rounded-xl p-4"><h3 class="font-bold">${glagolicaEscape(title)}</h3><p class="sl-muted mt-2 text-sm">${glagolicaEscape(text)}</p></article>`).join('');

(() => {
  const wordPool=window.GLAGOLICA_VOCAB.flat();
  const box=document.getElementById('enGame');
  let game=null,timer=null;
  const pick=n=>[...wordPool].sort(()=>Math.random()-.5).slice(0,n);
  const saveRecord=(key,value)=>{try{const old=Number(localStorage.getItem(key)||0);if(value>old)localStorage.setItem(key,String(value));}catch{}};
  function match(){
    clearInterval(timer);const chosen=pick(6),tokens=chosen.flatMap((w,i)=>[{id:i,side:'en',text:w.en},{id:i,side:'ru',text:w.ru}]).sort(()=>Math.random()-.5);
    game={mode:'match',tokens,selected:null,found:new Set(),started:Date.now()};renderMatch();
  }
  function renderMatch(){
    box.innerHTML=`<p class="sl-muted mb-3">Найдите шесть пар EN ↔ RU.</p><div class="grid grid-cols-2 gap-2 sm:grid-cols-3">${game.tokens.map((t,i)=>`<button class="sl-chip rounded-xl px-3 py-3 ${game.found.has(t.id)?'opacity-40':''} ${game.selected===i?'is-active':''}" data-match-index="${i}" ${game.found.has(t.id)?'disabled':''}>${glagolicaEscape(t.text)}</button>`).join('')}</div><p id="enGameFeedback" class="sl-muted mt-3"></p>`;
  }
  function sprint(){
    clearInterval(timer);game={mode:'sprint',left:60,score:0,asked:0,question:null};nextSprint();
    timer=setInterval(()=>{if(!game||game.mode!=='sprint'){clearInterval(timer);return;}game.left--;const clock=document.getElementById('enSprintClock');if(clock)clock.textContent=`${game.left} с`;if(game.left<=0){clearInterval(timer);saveRecord('glagolicaEnSprintBest',game.score);box.innerHTML=`<h3 class="text-xl font-bold">Время вышло</h3><p class="mt-2">${game.score} из ${game.asked} верно. Рекорд: ${localStorage.getItem('glagolicaEnSprintBest')||game.score}.</p><button class="sl-chip mt-3 rounded-xl px-4 py-2" data-en-game="sprint">Ещё раз</button>`;}},1000);
  }
  function nextSprint(){
    const correct=pick(1)[0],options=[correct,...pick(8).filter(w=>w.en!==correct.en).slice(0,3)].sort(()=>Math.random()-.5);
    game.question={correct,options};
    box.innerHTML=`<p id="enSprintClock" class="sl-accent font-bold">${game.left} с</p><p class="mt-2 text-xl font-bold">${glagolicaEscape(correct.ru)}</p><div class="mt-3 grid gap-2 sm:grid-cols-2">${options.map((w,i)=>`<button class="sl-chip rounded-xl px-4 py-3" data-sprint-index="${i}">${glagolicaEscape(w.en)}</button>`).join('')}</div><p class="sl-muted mt-2">Верно: ${game.score} / ${game.asked}</p>`;
  }
  document.addEventListener('click',event=>{
    const start=event.target.closest('[data-en-game]');if(start){start.dataset.enGame==='match'?match():sprint();return;}
    const m=event.target.closest('[data-match-index]');if(m&&game?.mode==='match'){
      const i=Number(m.dataset.matchIndex),t=game.tokens[i];if(game.selected===null){game.selected=i;renderMatch();return;}
      const prev=game.tokens[game.selected];game.selected=null;
      if(prev.id===t.id&&prev.side!==t.side){game.found.add(t.id);renderMatch();if(game.found.size===6){const seconds=Math.max(1,Math.round((Date.now()-game.started)/1000));box.innerHTML+=`<p class="sl-accent mt-3 font-bold">Все пары найдены за ${seconds} с.</p>`;}}
      else{renderMatch();document.getElementById('enGameFeedback').textContent='Попробуйте другую пару.';}return;
    }
    const q=event.target.closest('[data-sprint-index]');if(q&&game?.mode==='sprint'){
      game.asked++;if(game.question.options[Number(q.dataset.sprintIndex)]===game.question.correct)game.score++;nextSprint();
    }
  });
})();

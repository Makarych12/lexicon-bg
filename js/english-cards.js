(() => {
  const cards=window.GLAGOLICA_EN_CARDS,core=window.GLAGOLICA_CARD_CORE;
  const byId=new Map(cards.map(card=>[card.id,card]));
  const el=id=>document.getElementById(id);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value).toLocaleLowerCase().normalize('NFC').replace(/ё/g,'е').replace(/é/g,'e').replace(/[‘’]/g,"'").replace(/[.,!?…;:]/g,'').replace(/\s+/g,' ').trim();
  const posLabel={verb:'глагол',noun:'существительное',adjective:'прилагательное',adverb:'наречие',pronoun:'местоимение',number:'число',phrase:'фраза'};
  const topics=window.GLAGOLICA_COURSE.en.map(day=>day[0]);
  const ui={query:'',topic:'all',pos:'all',fav:false,due:false};
  let practice=null;
  const photo=card=>card.photo&&core.photoUrl(card.photo.src,'medium');
  const photoLarge=card=>card.photo&&core.photoUrl(card.photo.src,'large');
  const image=(card,eager=false)=>card.photo?`<img class="sl-photo" src="${esc(photo(card))}" srcset="${esc(photo(card))} 1x, ${esc(photoLarge(card))} 2x" alt="" loading="${eager?'eager':'lazy'}" decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.remove()">`:'';
  function speak(value,rate=.86,pronunciation=''){
    if(typeof value!=='string'||!value.trim()||/[<>\u0400-\u04ff]/.test(value))return;
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){const feedback=el('enCardFeedback');if(feedback)feedback.textContent='Озвучка недоступна в этом браузере.';return;}
    const utterance=new SpeechSynthesisUtterance(value==='read'?(pronunciation==='past'?'red':'reed'):value);utterance.lang='en-GB';utterance.rate=rate;
    const voice=speechSynthesis.getVoices().find(item=>item.lang.toLowerCase().startsWith('en-gb'));
    if(voice)utterance.voice=voice;
    speechSynthesis.cancel();speechSynthesis.speak(utterance);
  }
  function stats(){
    const ids=cards.map(card=>card.id),s=core.srsStats('en',ids);
    el('enCardStats').textContent=`${s.total} карточек · ${s.started} начато · ${s.strong} закреплено · ${s.due} к повторению`;
    el('enCardProgress').style.width=`${Math.round(s.started/s.total*100)}%`;
    el('enCardReview').textContent=`Повторить карточки · ${s.due}`;
  }
  function filtered(){
    const q=ui.query.toLocaleLowerCase();
    return cards.filter(card=>(ui.topic==='all'||String(card.day)===ui.topic)&&(ui.pos==='all'||card.pos===ui.pos)&&(!ui.fav||core.favHas('en',card.id))&&(!ui.due||!core.srsCard('en',card.id)||core.srsCard('en',card.id).due<=Date.now())&&(!q||`${card.en} ${card.ru} ${topics[card.day]}`.toLocaleLowerCase().includes(q)));
  }
  function front(card,eager){
    const favorite=core.favHas('en',card.id),record=core.srsCard('en',card.id);
    return `<div class="card-face sl-face sl-front absolute inset-0 flex flex-col p-5"><div class="flex flex-wrap items-center gap-2"><span class="sl-tag sl-tag-level">A1</span><span class="sl-tag sl-tag-group">${esc(posLabel[card.pos]||card.pos)}</span>${card.irregular?'<span class="sl-tag sl-tag-alt">irregular</span>':''}</div><div class="sl-pic ${card.photo?'has-photo':''} mt-3" style="--pic-hue:${card.hue}"><span class="sl-pic-main" aria-hidden="true">${esc(card.pictogram)}</span>${image(card,eager)}</div><div class="flex flex-1 flex-col items-center justify-center text-center"><p class="sl-faint mb-1 text-xs font-semibold uppercase tracking-widest">${esc(topics[card.day])}</p><h3 class="text-3xl font-black tracking-tight">${esc(card.en)}</h3><p class="sl-accent mt-2 text-sm font-semibold">British English · en-GB</p><p class="sl-ink-2 mt-2 text-base font-semibold">${esc(card.ru)}</p></div><div class="flex items-center justify-between gap-2"><div class="flex gap-2"><button class="sl-btn focus-ring rounded-full px-3 py-2 text-xs font-bold" type="button" data-en-speak="${esc(card.en)}" aria-label="Произнести ${esc(card.en)}">🎧</button><button class="${favorite?'sl-btn-accent':'sl-btn'} focus-ring rounded-full px-3 py-2 text-xs font-bold" type="button" data-en-fav="${card.id}" aria-pressed="${favorite}" aria-label="Избранное">${favorite?'★':'☆'}</button></div><span class="sl-faint text-xs">${esc(core.srsWhen(record))}</span></div><p class="sl-faint mt-3 text-center text-[11px]">Нажмите, чтобы перевернуть</p></div>`;
  }
  function back(card){
    return `<div class="card-face card-back sl-face absolute inset-0 p-4 sm:p-5"><div class="flex items-start justify-between gap-2"><div><span class="sl-accent text-[11px] font-bold uppercase tracking-widest">A1 · ${esc(posLabel[card.pos]||card.pos)}</span><h3 class="mt-1 text-xl font-black">${esc(card.en)} <span class="sl-muted text-sm font-semibold">— ${esc(card.ru)}</span></h3></div><div class="flex shrink-0 gap-1"><button class="sl-btn focus-ring rounded-full px-3 py-1.5 text-xs" type="button" data-en-link="${card.id}" title="Ссылка на карточку">↗</button><button class="sl-btn focus-ring rounded-full px-3 py-1.5 text-xs" type="button" data-en-flip-back aria-label="Вернуться на лицевую сторону">↺</button></div></div><div class="mt-3 flex flex-wrap gap-3 text-xs font-bold uppercase tracking-widest" role="tablist"><button class="sl-inner-tab focus-ring pb-2 is-active" data-en-tab="overview" role="tab">Обзор</button><button class="sl-inner-tab focus-ring pb-2" data-en-tab="forms" role="tab">Формы</button><button class="sl-inner-tab focus-ring pb-2" data-en-tab="examples" role="tab">Примеры</button><button class="sl-inner-tab focus-ring pb-2" data-en-tab="practice" role="tab">Практика</button></div><div class="sl-back-body mt-3 pr-1" data-en-body></div></div>`;
  }
  function overview(card){
    const record=core.srsCard('en',card.id);
    return `<div class="grid gap-2 text-sm"><div class="sl-example"><p class="sl-faint text-[11px] font-bold uppercase tracking-widest">Значение</p><p class="mt-1"><b>${esc(card.en)}</b> — ${esc(card.ru)} · ${esc(posLabel[card.pos]||card.pos)}</p><p class="sl-muted mt-1">Тема: ${esc(topics[card.day])}</p></div><div class="sl-example"><p class="sl-faint text-[11px] font-bold uppercase tracking-widest">Произношение</p><p class="mt-1">Британский английский · en-GB</p><button class="sl-btn focus-ring mt-2 rounded-full px-3 py-1 text-xs" data-en-speak="${esc(card.en)}">🎧 Слушать</button></div><div class="sl-example"><p class="sl-faint text-[11px] font-bold uppercase tracking-widest">Повторение</p><p class="mt-1">${esc(core.srsWhen(record))}${record?` · ${record.ok} из ${record.seen} вспомнили`:''}</p><div class="mt-2 flex gap-2"><button class="sl-btn focus-ring rounded-full px-3 py-1.5 text-xs" data-en-grade="0">Не знаю</button><button class="sl-btn-accent focus-ring rounded-full px-3 py-1.5 text-xs" data-en-grade="1">Знаю</button></div></div></div>`;
  }
  function forms(card){
    return `<div class="grid gap-2 text-sm">${card.forms.map(([name,value])=>`<div class="sl-example flex items-center justify-between gap-2"><div><p class="sl-faint text-[11px] font-bold uppercase tracking-widest">${esc(name)}</p><b>${esc(value)}</b></div>${name!=='usage'&&!/—|обычно|не изменяется/.test(value)?`<button class="sl-btn focus-ring rounded-full px-2 py-1 text-xs" data-en-speak="${esc(value.split(' / ')[0])}" data-en-pronunciation="${card.en==='read'&&['past','past participle'].includes(name)?'past':''}">🎧</button>`:''}</div>`).join('')}${card.en==='read'?'<p class="sl-muted text-xs">Past read пишется так же, но произносится /red/.</p>':''}</div>`;
  }
  function examples(card){
    return `<div class="grid gap-2">${card.examples.map((sentence,i)=>`<div class="sl-example"><p class="sl-accent text-[11px] font-bold uppercase tracking-widest">Пример ${i+1}</p><p class="mt-1 text-sm font-semibold leading-6">${esc(sentence)}</p><p class="sl-muted mt-1 text-sm">${esc(card.exampleRu[i])}</p><button class="sl-btn focus-ring mt-2 rounded-full px-3 py-1 text-[11px]" data-en-speak="${esc(sentence)}">🎧 Слушать фразу</button></div>`).join('')}</div>`;
  }
  function practiceMenu(card){
    return `<p class="sl-muted text-sm">Напишите ответ по памяти. Ошибки вернут карточку в повторение.</p><div class="mt-3 grid gap-2">${availableModes(card).map(mode=>[mode,({'ru-en':'RU → EN','en-ru':'EN → RU',listening:'🎧 Listening',form:'Формы',photo:'Фото → EN',context:'Слово в контексте','form-choice':'Выбрать форму',grammar:'Артикль / предлог'})[mode]]).map(([mode,name])=>`<button class="sl-chip rounded-xl px-3 py-2 text-left" type="button" data-en-practice="${mode}">${name}</button>`).join('')}</div>`;
  }
  function setTab(scene,tab){
    const card=byId.get(scene.dataset.enCard),body=scene.querySelector('[data-en-body]');
    scene.querySelectorAll('[data-en-tab]').forEach(button=>button.classList.toggle('is-active',button.dataset.enTab===tab));
    scene.dataset.tab=tab;
    body.innerHTML=tab==='overview'?overview(card):tab==='forms'?forms(card):tab==='examples'?examples(card):practiceMenu(card);
    body.scrollTop=0;
  }
  function render(){
    const list=filtered();el('enCardCount').textContent=`Показано ${list.length} из ${cards.length}`;
    el('enWordList').innerHTML=list.map((card,i)=>`<article class="sl-scene ${core.themeReduced()?'':'sl-enter'}" style="animation-delay:${Math.min(i,10)*32}ms"><div class="card-inner relative h-full cursor-pointer" data-en-card="${card.id}" tabindex="0" role="button" aria-label="Карточка ${esc(card.en)}. Нажмите, чтобы перевернуть">${front(card,i<4)}${back(card)}</div></article>`).join('');
    stats();
  }
  function flip(scene,force){const on=typeof force==='boolean'?force:!scene.classList.contains('is-flipped');scene.classList.toggle('is-flipped',on);if(on&&!scene.querySelector('[data-en-body]').innerHTML)setTab(scene,'overview');}
  const formOptions=card=>card.forms.filter(([name,value])=>!['base','usage','I / we','cardinal','phrase'].includes(name)&&!(name==='singular'&&!['parents','vegetables'].includes(card.en))&&!/—|обычно|не изменяется/.test(value)&&value.split(' / ').every(part=>norm(part)!==norm(card.en)));
  const grammarFor=card=>({
    apple:['I would like ___ apple.','an',['a','an'],'Перед apple нужен an: слово начинается с гласного звука.'],
    hour:['We have ___ hour before lunch.','an',['a','an'],'Hour начинается с гласного звука: h не произносится.'],
    book:['She is reading ___ book.','a',['a','an'],'Перед book нужен a: первый звук согласный.'],
    'at home':['Are you ___ home?','at',['at','in','on'],'Дома — at home.'],
    Monday:['The shop is closed ___ Monday.','on',['at','in','on'],'С днями недели используется on.'],
    Tuesday:['Our lesson is ___ Tuesday.','on',['at','in','on'],'С днями недели используется on.'],
    Wednesday:['We meet ___ Wednesday.','on',['at','in','on'],'С днями недели используется on.'],
    Thursday:['I have a class ___ Thursday.','on',['at','in','on'],'С днями недели используется on.'],
    Friday:['We leave ___ Friday.','on',['at','in','on'],'С днями недели используется on.'],
    morning:['I study ___ the morning.','in',['at','in','on'],'Утром — in the morning.'],
    evening:['We cook ___ the evening.','in',['at','in','on'],'Вечером — in the evening.'],
    night:['I work ___ night.','at',['at','in','on'],'Ночью — at night.'],
    train:['She travels ___ train.','by',['by','on','at'],'Способ передвижения: by train, без артикля.'],
    bus:['I go to work ___ bus.','by',['by','in','at'],'Способ передвижения: by bus, без артикля.'],
    car:['We came ___ car.','by',['by','on','at'],'Способ передвижения: by car, без артикля.'],
  })[card.en];
  function contextFor(card){
    // Prefer the lemma, then an inflected form used in a reviewed example.
    const terms=[card.en,...card.forms.filter(([name])=>name!=='usage').flatMap(([,value])=>value.split(' / '))].filter(value=>value&&!/[—\u0400-\u04ff]/.test(value));
    for(const term of terms){
      const escaped=term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const pattern=new RegExp(`(?<![A-Za-z])${escaped}(?![A-Za-z])`,'ig');
      for(let i=0;i<card.examples.length;i++){
        const matches=[...card.examples[i].matchAll(pattern)];
        if(matches.length===1)return {question:card.examples[i].replace(pattern,'___'),answer:matches[0][0],translation:card.exampleRu[i],sentence:card.examples[i]};
      }
    }
    return null;
  }
  const availableModes=card=>['ru-en','en-ru','listening',...(contextFor(card)?['context']:[]),...(formOptions(card).length?['form','form-choice']:[]),...(grammarFor(card)?['grammar']:[]),...(card.photoSpecific?['photo']:[])];
  const shuffle=items=>items.map(value=>({value,key:Math.random()})).sort((a,b)=>a.key-b.key).map(item=>item.value);
  window.GLAGOLICA_EN_QUALITY={formOptions,contextFor,grammarFor,availableModes};
  const formQuestion=card=>{const options=formOptions(card);return options[Math.floor(Math.random()*options.length)];};
  function showPractice(forcedMode){
    if(!practice)return;window.speechSynthesis?.cancel();practice.answered=false;
    const card=practice.queue[practice.index];if(!card){finishPractice();return;}
    const modes=availableModes(card);
    const offset=practice.visits.get(card.id)||0;practice.visits.set(card.id,offset+1);
    const sequence=['ru-en','listening','context','form','en-ru','form-choice','grammar','photo'];
    const candidate=sequence[(practice.index+(core.srsCard('en',card.id)?.seen||0)+offset)%sequence.length];
    const mode=forcedMode||(practice.mode==='mixed'?(modes.includes(candidate)?candidate:modes[(practice.index+offset)%Math.min(modes.length,4)]):(modes.includes(practice.mode)?practice.mode:'ru-en'));
    const [formName,formValue]=formQuestion(card)||['base',card.en];
    const context=contextFor(card),grammar=grammarFor(card);
    practice.currentMode=mode;practice.formName=formName;
    practice.expected=mode==='en-ru'?card.ru:['form','form-choice'].includes(mode)?formValue:mode==='context'?context.answer:mode==='grammar'?grammar[1]:card.en;
    practice.speech=mode==='context'?context.sentence:mode==='grammar'?grammar[0].replace('___',grammar[1]):['form','form-choice'].includes(mode)?formValue.split(' / ')[0]:card.en;
    practice.explanation=mode==='context'?context.translation:mode==='grammar'?grammar[3]:['form','form-choice'].includes(mode)?`${formName}: ${card.en} → ${formValue}`:`${card.en} — ${card.ru}`;
    const question=mode==='ru-en'?`<p class="text-2xl font-bold">${esc(card.ru)}</p><p class="sl-muted mt-1">${esc(posLabel[card.pos]||card.pos)}</p>`:mode==='en-ru'?`<p class="text-2xl font-bold">${esc(card.en)}</p><p class="sl-muted mt-1">${esc(posLabel[card.pos]||card.pos)}</p>`:mode==='listening'?'<button class="sl-chip rounded-xl px-4 py-3" data-en-listen>🎧 Слушать слово</button>':['form','form-choice'].includes(mode)?`<p class="text-xl font-bold">${esc(formName)}: ${esc(card.en)}</p>`:mode==='context'?`<p class="text-xl font-bold">${esc(context.question)}</p><p class="sl-muted mt-2">Вставьте слово со значением «${esc(card.ru)}» в подходящей форме.</p>`:mode==='grammar'?`<p class="text-xl font-bold">${esc(grammar[0])}</p>`:`<div class="sl-pic has-photo max-w-sm" style="--pic-hue:${card.hue}">${image(card,true)}</div>`;
    const choices=mode==='grammar'?grammar[2]:mode==='form-choice'?[formValue,...shuffle([...new Set(card.forms.filter(([name,value])=>!['usage','phrase'].includes(name)&&!/[—\u0400-\u04ff]/.test(value)&&!value.split(' / ').some(part=>formValue.split(' / ').includes(part))).map(([,value])=>value))]).slice(0,2)]:null;
    const answerUI=choices?`<div class="mt-4 flex flex-wrap gap-2">${shuffle(choices).map(value=>`<button class="sl-chip rounded-xl px-4 py-3" data-en-choice="${esc(value)}">${esc(value)}</button>`).join('')}</div>`:'<form id="enCardPracticeForm" class="mt-4"><input id="enCardAnswer" class="sl-input w-full rounded-xl px-4 py-3" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ответ" required><button class="sl-chip is-active mt-3 rounded-xl px-5 py-3" type="submit">Проверить</button></form>';
    el('enCardPractice').innerHTML=`<div class="flex items-center justify-between gap-2"><p class="sl-accent text-xs font-bold uppercase tracking-widest">English Cards · практика ${practice.index+1}/${practice.queue.length}</p><button class="sl-chip rounded-lg px-3 py-1" data-en-close>Закрыть</button></div><h3 class="mt-3 text-xl font-black">${({ 'ru-en':'RU → EN','en-ru':'EN → RU',listening:'Listening',form:'Напишите форму',photo:'Фото → слово',context:'Слово в контексте','form-choice':'Выберите форму',grammar:'Артикль / предлог'})[mode]}</h3><div class="mt-4">${question}</div>${answerUI}<div id="enCardFeedback" class="mt-4"></div>`;
    el('enWordList').classList.add('module-hidden');el('enCardPractice').classList.remove('module-hidden');el('enCardPractice').scrollIntoView({behavior:'smooth',block:'start'});el('enCardAnswer')?.focus();
  }
  function startPractice(queue,mode){if(!queue.length)return;window.speechSynthesis?.cancel();practice={queue:[...queue],index:0,mode,right:0,seen:0,visits:new Map(),retried:new Set()};showPractice();}
  function grade(value){
    if(!practice||practice.answered)return;practice.answered=true;
    const card=practice.queue[practice.index],expected=practice.expected,accepted=[norm(expected),...expected.split(' / ').map(norm)];
    if(practice.currentMode==='en-ru')cards.filter(other=>other.en===card.en&&other.pos===card.pos).forEach(other=>accepted.push(norm(other.ru)));
    const right=accepted.includes(norm(value));
    core.srsGrade('en',card.id,right);
    if(!right&&practice.mode==='mixed'&&!practice.retried.has(card.id)){practice.retried.add(card.id);practice.queue.splice(Math.min(practice.index+4,practice.queue.length),0,card);}
    practice.seen++;if(right)practice.right++;
    const mode=practice.currentMode,feedback=el('enCardFeedback');
    feedback.innerHTML=`<div class="rounded-xl border ${right?'border-emerald-400/40':'border-amber-400/40'} p-4"><b class="${right?'text-emerald-300':'text-amber-300'}">${right?'✓ Верно':'Попробуйте ещё раз позже'}</b><p class="mt-2">${esc(expected.replaceAll(' / ',' · или '))}</p>${right?'':`<p class="sl-muted mt-2 text-sm">Ваш ответ: ${esc(value)}</p><p class="sl-muted mt-2 text-sm">${esc(practice.explanation)}</p>`}<div class="mt-3 flex flex-wrap gap-2"><button class="sl-chip rounded-xl px-3 py-2" data-en-speak="${esc(practice.speech)}" data-en-pronunciation="${card.en==='read'&&['past','past participle'].includes(practice.formName)&&['form','form-choice'].includes(mode)?'past':''}">🎧 Слушать</button><button class="sl-chip is-active rounded-xl px-4 py-2" data-en-next>Дальше →</button></div></div>`;
    el('enCardPracticeForm')?.remove();el('enCardPractice').querySelectorAll('[data-en-choice]').forEach(button=>button.disabled=true);stats();
  }
  function finishPractice(){
    const {right,seen}=practice;el('enCardPractice').innerHTML=`<h3 class="text-2xl font-black">Практика завершена · ${seen?Math.round(right/seen*100):0}%</h3><p class="sl-muted mt-2">${right} из ${seen} верно. Ошибочные карточки повторяются чаще и вернутся в SRS через 10 минут.</p><button class="sl-chip is-active mt-4 rounded-xl px-4 py-3" data-en-close>К карточкам</button>`;stats();practice=null;
  }
  el('enCardTopic').innerHTML='<option value="all">Все темы</option>'+topics.map((topic,i)=>`<option value="${i}">${esc(topic)}</option>`).join('');
  el('enWordSearch').addEventListener('input',e=>{ui.query=e.target.value.trim();render();});
  el('enCardTopic').addEventListener('change',e=>{ui.topic=e.target.value;render();});
  el('enCardPos').addEventListener('change',e=>{ui.pos=e.target.value;render();});
  el('enCardFavFilter').addEventListener('click',()=>{ui.fav=!ui.fav;el('enCardFavFilter').classList.toggle('is-active',ui.fav);el('enCardFavFilter').setAttribute('aria-pressed',String(ui.fav));render();});
  el('enCardDueFilter').addEventListener('click',()=>{ui.due=!ui.due;el('enCardDueFilter').classList.toggle('is-active',ui.due);el('enCardDueFilter').setAttribute('aria-pressed',String(ui.due));render();});
  el('enCardReview').addEventListener('click',()=>{
    const queue=core.srsQueue(cards,'en',card=>card.id);
    queue.sort((a,b)=>{const x=core.srsCard('en',a.id),y=core.srsCard('en',b.id);if(Boolean(x)!==Boolean(y))return x?-1:1;return (x?x.ok/Math.max(x.seen,1):0)-(y?y.ok/Math.max(y.seen,1):0)||(x?.due||0)-(y?.due||0);});
    startPractice(queue.slice(0,15),'mixed');
  });
  el('enWordList').addEventListener('click',event=>{
    const scene=event.target.closest('[data-en-card]');if(!scene)return;
    const card=byId.get(scene.dataset.enCard);
    const speakButton=event.target.closest('[data-en-speak]');if(speakButton){speak(speakButton.dataset.enSpeak,.86,speakButton.dataset.enPronunciation);return;}
    const fav=event.target.closest('[data-en-fav]');if(fav){core.favToggle('en',card.id);render();return;}
    if(event.target.closest('[data-en-flip-back]')){flip(scene,false);return;}
    const link=event.target.closest('[data-en-link]');if(link){core.copyLink(`en/card/${card.id}`,link);return;}
    const tab=event.target.closest('[data-en-tab]');if(tab){setTab(scene,tab.dataset.enTab);return;}
    const gradeButton=event.target.closest('[data-en-grade]');if(gradeButton){core.srsGrade('en',card.id,gradeButton.dataset.enGrade==='1');setTab(scene,'overview');stats();return;}
    const practiceButton=event.target.closest('[data-en-practice]');if(practiceButton){startPractice([card],practiceButton.dataset.enPractice);return;}
    if(event.target.closest('.card-back'))return;
    flip(scene);
  });
  el('enWordList').addEventListener('keydown',event=>{const scene=event.target.closest('[data-en-card]');if(scene&&event.target===scene&&(event.key==='Enter'||event.key===' ')){event.preventDefault();flip(scene);}});
  el('enCardPractice').addEventListener('click',event=>{
    const speakButton=event.target.closest('[data-en-speak]');if(speakButton){speak(speakButton.dataset.enSpeak,.86,speakButton.dataset.enPronunciation);return;}
    const choice=event.target.closest('[data-en-choice]');if(choice){grade(choice.dataset.enChoice);return;}
    if(event.target.closest('[data-en-listen]')){speak(practice.queue[practice.index].en);return;}
    if(event.target.closest('[data-en-next]')){practice.index++;showPractice();return;}
    if(event.target.closest('[data-en-close]')){window.speechSynthesis?.cancel();practice=null;el('enWordList').classList.remove('module-hidden');el('enCardPractice').classList.add('module-hidden');return;}
  });
  el('enCardPractice').addEventListener('error',event=>{if(event.target.matches('img')&&practice?.currentMode==='photo'&&!practice.answered)showPractice('ru-en');},true);
  el('enCardPractice').addEventListener('submit',event=>{if(event.target.id==='enCardPracticeForm'){event.preventDefault();grade(el('enCardAnswer').value);}});
  function route(){const match=location.hash.match(/^#en\/card\/(.+)$/);if(!match)return;const id=decodeURIComponent(match[1]);if(!byId.has(id))return;core.setLang('en',false);ui.query='';ui.topic='all';ui.pos='all';ui.fav=false;ui.due=false;el('enWordSearch').value='';el('enCardTopic').value='all';el('enCardPos').value='all';render();setTimeout(()=>{const scene=el('enWordList').querySelector(`[data-en-card="${CSS.escape(id)}"]`);if(scene){scene.scrollIntoView({block:'center'});flip(scene,true);}},100);}
  window.addEventListener('hashchange',route);
  render();if(location.hash.startsWith('#en/card/'))route();
})();

(() => {
  const cards=window.GLAGOLICA_EN_CARDS,core=window.GLAGOLICA_CARD_CORE;
  const byId=new Map(cards.map(card=>[card.id,card]));
  const el=id=>document.getElementById(id);
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=value=>String(value).toLocaleLowerCase().normalize('NFC').replace(/ё/g,'е').replace(/[.,!?…;:]/g,'').replace(/\s+/g,' ').trim();
  const posLabel={verb:'глагол',noun:'существительное',adjective:'прилагательное',adverb:'наречие',pronoun:'местоимение',number:'число',phrase:'фраза'};
  const topics=window.GLAGOLICA_COURSE.en.map(day=>day[0]);
  const ui={query:'',topic:'all',pos:'all',fav:false,due:false};
  let practice=null;
  const photo=card=>card.photo&&core.photoUrl(card.photo.src,'medium');
  const photoLarge=card=>card.photo&&core.photoUrl(card.photo.src,'large');
  const image=(card,eager=false)=>card.photo?`<img class="sl-photo" src="${esc(photo(card))}" srcset="${esc(photo(card))} 1x, ${esc(photoLarge(card))} 2x" alt="" loading="${eager?'eager':'lazy'}" decoding="async" onerror="this.parentElement.classList.remove('has-photo');this.remove()">`:'';
  function speak(value,rate=.86){
    if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){el('enCardPractice').textContent='Озвучка недоступна в этом браузере.';return;}
    const utterance=new SpeechSynthesisUtterance(value);utterance.lang='en-GB';utterance.rate=rate;
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
    return `<div class="grid gap-2 text-sm">${card.forms.map(([name,value])=>`<div class="sl-example flex items-center justify-between gap-2"><div><p class="sl-faint text-[11px] font-bold uppercase tracking-widest">${esc(name)}</p><b>${esc(value)}</b></div>${name!=='usage'&&!/—|обычно|не изменяется/.test(value)?`<button class="sl-btn focus-ring rounded-full px-2 py-1 text-xs" data-en-speak="${esc(card.en==='read'&&['past','past participle'].includes(name)?'Yesterday I read a book.':value.split(' / ')[0])}">🎧</button>`:''}</div>`).join('')}${card.en==='read'?'<p class="sl-muted text-xs">Past read пишется так же, но произносится /red/.</p>':''}</div>`;
  }
  function examples(card){
    return `<div class="grid gap-2">${card.examples.map((sentence,i)=>`<div class="sl-example"><p class="sl-accent text-[11px] font-bold uppercase tracking-widest">Пример ${i+1}</p><p class="mt-1 text-sm font-semibold leading-6">${esc(sentence)}</p><p class="sl-muted mt-1 text-sm">${esc(card.exampleRu[i])}</p><button class="sl-btn focus-ring mt-2 rounded-full px-3 py-1 text-[11px]" data-en-speak="${esc(sentence)}">🎧 Слушать фразу</button></div>`).join('')}</div>`;
  }
  function practiceMenu(card){
    return `<p class="sl-muted text-sm">Напишите ответ по памяти. Ошибки вернут карточку в повторение.</p><div class="mt-3 grid gap-2">${[['ru-en','RU → EN'],['en-ru','EN → RU'],['listening','🎧 Listening'],...(formOptions(card).length?[['form','Формы']]:[]),...(card.photoSpecific?[['photo','Фото → EN']]:[])].map(([mode,name])=>`<button class="sl-chip rounded-xl px-3 py-2 text-left" type="button" data-en-practice="${mode}">${name}</button>`).join('')}</div>`;
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
  const formOptions=card=>card.forms.filter(([name,value])=>!['base','usage','I / we','singular','cardinal'].includes(name)&&!/—|обычно|не изменяется/.test(value));
  const formQuestion=card=>{const options=formOptions(card);return options[Math.floor(Math.random()*options.length)];};
  function showPractice(){
    if(!practice)return;
    const card=practice.queue[practice.index];if(!card){finishPractice();return;}
    let mode=practice.mode==='mixed'?['ru-en','en-ru','listening','form','photo'][practice.index%5]:practice.mode;
    if(mode==='photo'&&!card.photoSpecific||mode==='form'&&!formOptions(card).length)mode='ru-en';
    const [formName,formValue]=formQuestion(card)||['base',card.en];practice.currentMode=mode;practice.expected=mode==='en-ru'?card.ru:mode==='form'?formValue:card.en;
    const question=mode==='ru-en'?`<p class="text-2xl font-bold">${esc(card.ru)}</p>`:mode==='en-ru'?`<p class="text-2xl font-bold">${esc(card.en)}</p><p class="sl-muted mt-1">${esc(posLabel[card.pos]||card.pos)}</p>`:mode==='listening'?'<button class="sl-chip rounded-xl px-4 py-3" data-en-listen>🎧 Слушать слово</button>':mode==='form'?`<p class="text-xl font-bold">${esc(formName)}: ${esc(card.en)}</p>`:`<div class="sl-pic has-photo max-w-sm" style="--pic-hue:${card.hue}">${image(card,true)}</div>`;
    el('enCardPractice').innerHTML=`<div class="flex items-center justify-between gap-2"><p class="sl-accent text-xs font-bold uppercase tracking-widest">English Cards · практика ${practice.index+1}/${practice.queue.length}</p><button class="sl-chip rounded-lg px-3 py-1" data-en-close>Закрыть</button></div><h3 class="mt-3 text-xl font-black">${({ 'ru-en':'RU → EN','en-ru':'EN → RU',listening:'Listening',form:'Напишите форму',photo:'Фото → слово'})[mode]}</h3><div class="mt-4">${question}</div><form id="enCardPracticeForm" class="mt-4"><input id="enCardAnswer" class="sl-input w-full rounded-xl px-4 py-3" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Ответ" required><button class="sl-chip is-active mt-3 rounded-xl px-5 py-3" type="submit">Проверить</button></form><div id="enCardFeedback" class="mt-4"></div>`;
    el('enCardPractice').classList.remove('module-hidden');el('enCardPractice').scrollIntoView({behavior:'smooth',block:'start'});el('enCardAnswer').focus();
  }
  function startPractice(queue,mode){if(!queue.length)return;practice={queue,index:0,mode,right:0,seen:0};showPractice();}
  function grade(value){
    const card=practice.queue[practice.index],expected=practice.expected,accepted=expected.split(' / ').map(norm);
    if(practice.currentMode==='en-ru')cards.filter(other=>other.en===card.en&&other.pos===card.pos).forEach(other=>accepted.push(norm(other.ru)));
    const right=accepted.includes(norm(value));
    core.srsGrade('en',card.id,right);practice.seen++;if(right)practice.right++;
    const mode=practice.currentMode,feedback=el('enCardFeedback');
    feedback.innerHTML=`<div class="rounded-xl border ${right?'border-emerald-400/40':'border-amber-400/40'} p-4"><b class="${right?'text-emerald-300':'text-amber-300'}">${right?'✓ Верно':'Попробуйте ещё раз позже'}</b><p class="mt-2">${esc(expected.replaceAll(' / ',' · или '))}</p>${right?'':`<p class="sl-muted mt-2 text-sm">Ваш ответ: ${esc(value)}</p>`}<div class="mt-3 flex flex-wrap gap-2"><button class="sl-chip rounded-xl px-3 py-2" data-en-speak="${esc(mode==='form'&&card.en==='read'&&expected==='read'?'Yesterday I read a book.':mode==='form'?expected.split(' / ')[0]:card.en)}">🎧 Слушать</button><button class="sl-chip is-active rounded-xl px-4 py-2" data-en-next>Дальше →</button></div></div>`;
    el('enCardPracticeForm').remove();stats();
  }
  function finishPractice(){
    const {right,seen}=practice;el('enCardPractice').innerHTML=`<h3 class="text-2xl font-black">Практика завершена · ${seen?Math.round(right/seen*100):0}%</h3><p class="sl-muted mt-2">${right} из ${seen} верно. Ошибочные карточки вернутся в повторение через 10 минут.</p><button class="sl-chip is-active mt-4 rounded-xl px-4 py-3" data-en-close>К карточкам</button>`;stats();practice=null;
  }
  el('enCardTopic').innerHTML='<option value="all">Все темы</option>'+topics.map((topic,i)=>`<option value="${i}">${esc(topic)}</option>`).join('');
  el('enWordSearch').addEventListener('input',e=>{ui.query=e.target.value.trim();render();});
  el('enCardTopic').addEventListener('change',e=>{ui.topic=e.target.value;render();});
  el('enCardPos').addEventListener('change',e=>{ui.pos=e.target.value;render();});
  el('enCardFavFilter').addEventListener('click',()=>{ui.fav=!ui.fav;el('enCardFavFilter').classList.toggle('is-active',ui.fav);el('enCardFavFilter').setAttribute('aria-pressed',String(ui.fav));render();});
  el('enCardDueFilter').addEventListener('click',()=>{ui.due=!ui.due;el('enCardDueFilter').classList.toggle('is-active',ui.due);el('enCardDueFilter').setAttribute('aria-pressed',String(ui.due));render();});
  el('enCardReview').addEventListener('click',()=>startPractice(core.srsQueue(cards,'en',card=>card.id).slice(0,15),'mixed'));
  el('enWordList').addEventListener('click',event=>{
    const scene=event.target.closest('[data-en-card]');if(!scene)return;
    const card=byId.get(scene.dataset.enCard);
    const speakButton=event.target.closest('[data-en-speak]');if(speakButton){speak(speakButton.dataset.enSpeak);return;}
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
    const speakButton=event.target.closest('[data-en-speak]');if(speakButton){speak(speakButton.dataset.enSpeak);return;}
    if(event.target.closest('[data-en-listen]')){speak(practice.queue[practice.index].en);return;}
    if(event.target.closest('[data-en-next]')){practice.index++;showPractice();return;}
    if(event.target.closest('[data-en-close]')){practice=null;el('enCardPractice').classList.add('module-hidden');return;}
  });
  el('enCardPractice').addEventListener('submit',event=>{if(event.target.id==='enCardPracticeForm'){event.preventDefault();grade(el('enCardAnswer').value);}});
  function route(){const match=location.hash.match(/^#en\/card\/(.+)$/);if(!match)return;const id=decodeURIComponent(match[1]);if(!byId.has(id))return;core.setLang('en',false);ui.query='';ui.topic='all';ui.pos='all';ui.fav=false;ui.due=false;el('enWordSearch').value='';el('enCardTopic').value='all';el('enCardPos').value='all';render();setTimeout(()=>{const scene=el('enWordList').querySelector(`[data-en-card="${CSS.escape(id)}"]`);if(scene){scene.scrollIntoView({block:'center'});flip(scene,true);}},100);}
  window.addEventListener('hashchange',route);
  render();if(location.hash.startsWith('#en/card/'))route();
})();

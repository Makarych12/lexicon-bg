// Executed inside Chromium by regression.py. Uses the real card UI and SRS engine.
window.runEnglishQualityBatch = (start, end) => {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const cards=GLAGOLICA_EN_CARDS,quality=GLAGOLICA_EN_QUALITY,core=GLAGOLICA_CARD_CORE;
  const synthesis=window.speechSynthesis,Utterance=window.SpeechSynthesisUtterance;
  const payloads=[];let cancels=0;
  Object.defineProperty(window,'speechSynthesis',{configurable:true,value:{getVoices:()=>[{lang:'en-GB',name:'Test British English'}],cancel:()=>cancels++,speak:utterance=>payloads.push({text:utterance.text,lang:utterance.lang,rate:utterance.rate})}});
  window.SpeechSynthesisUtterance=function(text){this.text=text;};
  const protectedState=['lexiconSrsSl','lexiconSlLearned','lexiconSlFavorites','lexiconEnFavorites','glagolicaLearningV1'].map(key=>[key,localStorage.getItem(key)]);
  const counts={cards:0,modes:{},wordAudio:0,formAudio:0,exampleAudio:0,feedbackAudio:0,listeningAudio:0};
  const click=(scope,selector)=>{const button=scope.querySelector(selector);assert(button,`Missing ${selector}`);button.click();return button;};
  const norm=s=>s.toLowerCase().replace(/é/g,'e').replace(/ё/g,'е').replace(/[.,!?…;:]/g,'').trim();
  try{
    for(const card of cards.slice(start,end)){
      const search=document.getElementById('enWordSearch');search.value=card.en;search.dispatchEvent(new Event('input'));
      const scene=document.querySelector(`[data-en-card="${card.id}"]`);assert(scene,card.id);
      click(scene,'[data-en-speak]');assert(payloads.at(-1).text===(card.en==='read'?'reed':card.en),`Word audio ${card.en}`);counts.wordAudio++;
      scene.click();click(scene,'[data-en-tab="forms"]');
      const buttons=[...scene.querySelectorAll('[data-en-body] [data-en-speak]')];
      for(const button of buttons){button.click();const expected=button.dataset.enSpeak==='read'?(button.dataset.enPronunciation==='past'?'red':'reed'):button.dataset.enSpeak;assert(payloads.at(-1).text===expected,`Form audio ${card.en}`);counts.formAudio++;}
      if(card.en==='read')assert(buttons.filter(b=>b.dataset.enPronunciation==='past').length===2,'Both past read forms use /red/');
      click(scene,'[data-en-tab="examples"]');
      const examples=[...scene.querySelectorAll('[data-en-body] [data-en-speak]')];assert(examples.length===3,card.id);
      examples.forEach((button,index)=>{button.click();assert(payloads.at(-1).text===card.examples[index],`Full example audio ${card.id}/${index}`);counts.exampleAudio++;});
      click(scene,'[data-en-tab="practice"]');
      const context=quality.contextFor(card),formOptions=quality.formOptions(card),grammar=quality.grammarFor(card);
      assert(formOptions.every(([,value])=>value.split(' / ').every(part=>norm(part)!==norm(card.en))),`Hint-identical form ${card.en}`);
      if(['fish','clothes','what','both','the two of us','the two of you','the two of them'].includes(card.en))assert(!formOptions.length,`Meaningless form task ${card.en}`);
      for(const mode of quality.availableModes(card)){
        const gradeBefore=core.srsCard('en',card.id)?.seen||0;
        click(scene,`[data-en-practice="${mode}"]`);
        const panel=document.getElementById('enCardPractice');
        assert(document.documentElement.scrollWidth<=innerWidth+1,`Mobile practice overflow: ${card.en}/${mode}`);
        assert(document.getElementById('enWordList').classList.contains('module-hidden'),`Background answer leak ${mode}`);
        let answer=card.en;
        if(mode==='en-ru')answer=card.ru;
        if(mode==='listening'){
          assert(!panel.textContent.includes(card.ru),`Listening RU leak ${card.en}`);
          assert(!panel.querySelector('[data-en-speak],img'),`Listening answer payload leak ${card.en}`);
          click(panel,'[data-en-listen]');assert(payloads.at(-1).text===(card.en==='read'?'reed':card.en),`Listening audio ${card.en}`);counts.listeningAudio++;
        }
        if(mode==='photo'){
          assert(card.photoSpecific&&panel.querySelector('img'),`Ineligible photo task ${card.en}`);
          assert(!panel.textContent.includes(card.ru),`Picture RU leak ${card.en}`);
          assert(!panel.querySelector('[data-en-speak]'),'Picture text/audio answer leak');
          assert(panel.querySelector('img').alt==='','Picture alt answer leak');
        }
        if(['form','form-choice'].includes(mode)){
          const label=panel.querySelector('.text-xl.font-bold').textContent.split(': ')[0];
          answer=formOptions.find(([name])=>name===label)?.[1];assert(answer,`Form label ${card.en}`);
          assert(!panel.querySelector('[data-en-speak]'),'Form spoken answer leak');
        }
        if(mode==='context'){answer=context.answer;assert(panel.querySelector('.text-xl.font-bold').textContent===context.question,`Cloze ${card.en}`);assert(context.question.includes('___'),`No gap ${card.en}`);}
        if(mode==='grammar')answer=grammar[1];
        if(panel.querySelector('[data-en-choice]')){
          const choices=[...panel.querySelectorAll('[data-en-choice]')];
          assert(choices.length>=2,`Too few choices ${card.en}`);
          assert(choices.filter(b=>b.dataset.enChoice.split(' / ').some(value=>answer.split(' / ').map(norm).includes(norm(value)))).length===1,`Ambiguous choices ${card.en}`);
          choices.find(b=>b.dataset.enChoice===answer).click();
        }else{
          document.getElementById('enCardAnswer').value=answer.split(' / ')[0];document.getElementById('enCardPracticeForm').requestSubmit();
        }
        assert(document.getElementById('enCardFeedback').textContent.includes('✓ Верно'),`Rejected correct answer: ${card.en}/${mode}/${answer}`);
        assert(core.srsCard('en',card.id).seen===gradeBefore+1,`SRS ${mode}`);
        click(panel,'[data-en-speak]');counts.feedbackAudio++;
        if(mode==='context')assert(payloads.at(-1).text===context.sentence,`Context feedback TTS ${card.en}`);
        if(mode==='grammar')assert(payloads.at(-1).text===grammar[0].replace('___',grammar[1]),`Grammar feedback TTS ${card.en}`);
        if(mode==='form-choice'){
          panel.querySelector('[data-en-choice]').click();assert(core.srsCard('en',card.id).seen===gradeBefore+1,'Double grade');
        }
        click(panel,'[data-en-close]');assert(!document.getElementById('enWordList').classList.contains('module-hidden'),'Cards not restored');
        counts.modes[mode]=(counts.modes[mode]||0)+1;
      }
      counts.cards++;
    }
    assert(payloads.every(p=>p.lang==='en-GB'&&p.text&&!/[<>\u0400-\u04ff]|usually|plural only/.test(p.text)),'Non-English/technical TTS payload');
    assert(cancels>=payloads.length,'Previous utterance not cancelled');
    for(const [key,value] of protectedState)assert(localStorage.getItem(key)===value,`Progress isolation ${key}`);
    return counts;
  }finally{
    Object.defineProperty(window,'speechSynthesis',{configurable:true,value:synthesis});window.SpeechSynthesisUtterance=Utterance;
    const search=document.getElementById('enWordSearch');search.value='';search.dispatchEvent(new Event('input'));
  }
};
window.runEnglishSessionQuality = () => {
  const assert=(condition,message)=>{if(!condition)throw new Error(message);};
  const core=GLAGOLICA_CARD_CORE;
  const now=Date.now;
  try{
    // Turn five cards into overdue mistakes without changing any storage keys.
    const weak=GLAGOLICA_EN_CARDS.slice(0,5);
    weak.forEach(card=>core.srsGrade('en',card.id,false));
    Date.now=()=>now()+11*60000;
    document.getElementById('enCardReview').click();
    const panel=document.getElementById('enCardPractice');
    const before=Number(panel.textContent.match(/практика 1\/(\d+)/)[1]);
    assert(before===5,'Only due cards should enter review');
    const input=document.getElementById('enCardAnswer');
    if(input){input.value='definitely wrong';document.getElementById('enCardPracticeForm').requestSubmit();}
    else panel.querySelector('[data-en-choice]').click();
    assert(panel.querySelector('#enCardFeedback .sl-muted'), 'Short correction explanation missing');
    panel.querySelector('[data-en-next]').click();
    const after=Number(panel.textContent.match(/практика 2\/(\d+)/)[1]);
    assert(after===before+1,'Mistake should return inside the same session');
    const headings=new Set([panel.querySelector('h3').textContent]);
    for(let i=0;i<12&&panel.querySelector('#enCardAnswer,[data-en-choice]');i++){
      const answer=panel.querySelector('#enCardAnswer');
      if(answer){answer.value='wrong';panel.querySelector('form').requestSubmit();}
      else panel.querySelector('[data-en-choice]').click();
      panel.querySelector('[data-en-next]').click();
      headings.add(panel.querySelector('h3').textContent);
    }
    assert(headings.size>=3,'Mixed session should alternate practice types');
    panel.querySelector('[data-en-close]').click();
    // Image failures need an answerable alternative, including offline first views.
    const search=document.getElementById('enWordSearch');search.value='bus';search.dispatchEvent(new Event('input'));
    const scene=document.querySelector('[data-en-card="en-8-1"]');scene.click();scene.querySelector('[data-en-tab="practice"]').click();scene.querySelector('[data-en-practice="photo"]').click();
    panel.querySelector('img').dispatchEvent(new Event('error'));
    assert(panel.querySelector('h3').textContent==='RU → EN'&&panel.querySelector('#enCardAnswer'),'Missing photo fallback task');
    panel.querySelector('[data-en-close]').click();
    search.value='';search.dispatchEvent(new Event('input'));
    return 'OK: short error explanations, SRS due selection, bounded same-session retries, mixed modes and unavailable-photo fallback';
  }finally{Date.now=now;}
};

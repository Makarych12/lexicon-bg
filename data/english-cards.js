// Enrich all 225 existing vocabulary rows without changing course IDs or progress.
(() => {
  const core=window.GLAGOLICA_CARD_CORE;
  // A photograph is used only when its subject actually illustrates the English meaning.
  // Abstract words and words with no unambiguous photo use a pictogram instead.
  const photoOverride={family:'jesti',mother:'ljubiti',father:'povedati',child:'roditi se',parents:'povedati',love:'ljubiti',bed:'pospraviti',kitchen:'kuhati',flat:'stanovati',bathroom:'umiti se',café:'naročiti',tea:'piti',glass:'voda',cup:'piti',breakfast:'pripraviti',lunch:'jesti',product:'prodajati',bag:'nakupovati',clothes:'obleči se',morning:'zbuditi se',school:'šola',teacher:'razlagati',office:'sodelovati',colleague:'sodelovati',street:'hoditi',train:'vlak','train station':'prispeti',road:'cesta',car:'avto',airport:'leteti',platform:'prispeti',food:'jesti',dinner:'jesti',soup:'skuhati',head:'razmišljati',hand:'dvigniti',leg:'hoditi',tired:'utruditi se',night:'zaspati',weekend:'počivati',question:'vprašanje',answer:'odgovor',help:'pomoč',big:'velik',small:'majhen',good:'dober',bad:'slab'};
  const directReject=new Set(['be','sit','open','buy','new','old','need','possible','important']);
  const visualFallback=new Set(['have','parents','want','product','leg','night','understand','repeat','show','know','big','small','good','bad']);
  const pictograms={I:'🙋',you:'👉',he:'👨',she:'👩',name:'🔤',hello:'👋',yes:'✅',no:'❌',who:'❔',what:'❔',where:'📍','where from':'🧭',how:'❔',be:'✨',have:'👐',mother:'👩‍👧',father:'👨‍👧',brother:'👦',sister:'👧',son:'👦',daughter:'👧',wife:'💍',husband:'💍',parents:'👨‍👩‍👧',person:'🧍',room:'🛋️',door:'🚪',sit:'🪑',open:'🚪',key:'🔑',coffee:'☕',bill:'🧾',menu:'📋',tasty:'😋',want:'💭',price:'🏷️',expensive:'💰',cheap:'🏷️',buy:'🛒',product:'📦',today:'📅',tomorrow:'➡️',yesterday:'⬅️',morning:'🌅',evening:'🌇',Monday:'📅',Tuesday:'📅',Wednesday:'📅',Thursday:'📅',Friday:'📅',week:'🗓️',hour:'🕒',minute:'⏱️',time:'⌚',when:'❔',work:'🛠️',busy:'📚','at home':'🏠',task:'✅',centre:'🎯',left:'⬅️',right:'➡️','straight ahead':'⬆️',nearby:'📍',far:'🗺️',turn:'↪️',park:'🌳',square:'🏙️',bridge:'🌉','traffic light':'🚦',map:'🗺️',bus:'🚌',ticket:'🎫',stop:'🚏',ride:'🚲',passenger:'🧍',timetable:'📋',two:'2️⃣',one:'1️⃣',three:'3️⃣',four:'4️⃣',five:'5️⃣',six:'6️⃣',seven:'7️⃣',eight:'8️⃣','the two of us':'👥','the two of you':'👥','the two of them':'👥',both:'👥',together:'🤝',meat:'🥩',fish:'🐟',cheese:'🧀',salt:'🧂',sugar:'🍬',plate:'🍽️',spoon:'🥄',fork:'🍴',vegetables:'🥕',fruit:'🍎',health:'❤️',pharmacy:'💊',hospital:'🏥',medicine:'💊',hurt:'🤕',fever:'🌡️',pain:'😣',eye:'👁️',ear:'👂',mouth:'👄',leg:'🦵',earlier:'⬅️',later:'➡️',soon:'⏳',always:'♾️',sometimes:'🔄',never:'🚫',day:'☀️',night:'🌙',previous:'⬅️',next:'➡️',month:'🗓️',year:'📆',past:'⬅️',future:'➡️',please:'🙏','thank you':'🙏','excuse me':'🙇',slowly:'🐢',well:'👍',understand:'💡',repeat:'🔁',show:'👆',know:'🧠',big:'📏',small:'📐',good:'👍',bad:'👎',here:'📍',there:'👉',correct:'✅',possible:'✅',important:'❗',new:'✨',old:'🕰️',need:'🙋'};
  const irregular={
    be:['is','was / were','been','being'],speak:['speaks','spoke','spoken','speaking'],have:['has','had','had','having'],sleep:['sleeps','slept','slept','sleeping'],sit:['sits','sat','sat','sitting'],drink:['drinks','drank','drunk','drinking'],eat:['eats','ate','eaten','eating'],buy:['buys','bought','bought','buying'],sell:['sells','sold','sold','selling'],pay:['pays','paid','paid','paying'],write:['writes','wrote','written','writing'],read:['reads','read','read','reading'],go:['goes','went','gone','going'],ride:['rides','rode','ridden','riding'],leave:['leaves','left','left','leaving'],cut:['cuts','cut','cut','cutting'],hurt:['hurts','hurt','hurt','hurting'],understand:['understands','understood','understood','understanding'],show:['shows','showed','shown','showing'],know:['knows','knew','known','knowing'],hear:['hears','heard','heard','hearing'],see:['sees','saw','seen','seeing']
  };
  const nounIrregular={child:'children',person:'people',wife:'wives',family:'families',city:'cities',bus:'buses',fish:'fish',glass:'glasses',clothes:'clothes',parents:'parents',vegetables:'vegetables',café:'cafés'};
  const mass=new Set(['coffee','tea','water','money','bread','milk','work','food','meat','cheese','salt','sugar','fruit','health','medicine']);
  const adjectiveIrregular={good:['better','best'],bad:['worse','worst'],big:['bigger','biggest'],tasty:['tastier','tastiest'],busy:['busier','busiest']};
  const noComparison=new Set(['previous','next','possible','correct']);
  const pronouns={I:['me','my','mine'],you:['you','your','yours'],he:['him','his','his'],she:['her','her','hers'],who:['whom','whose','—'],what:['what','—','—'],'the two of us':['the two of us','our','ours'],'the two of you':['the two of you','your','yours'],'the two of them':['the two of them','their','theirs'],both:['both','—','—']};
  const ordinals={one:'first',two:'second',three:'third',four:'fourth',five:'fifth',six:'sixth',seven:'seventh',eight:'eighth'};
  const regularThird=base=>/(s|sh|ch|x|z|o)$/.test(base)?`${base}es`:/[^aeiou]y$/.test(base)?`${base.slice(0,-1)}ies`:`${base}s`;
  const regularPast=base=>base.endsWith('e')?`${base}d`:/[^aeiou]y$/.test(base)?`${base.slice(0,-1)}ied`:`${base}ed`;
  const regularIng=base=>base.endsWith('ie')?`${base.slice(0,-2)}ying`:base.endsWith('e')&&!base.endsWith('ee')?`${base.slice(0,-1)}ing`:base==='stop'?`${base}ping`:`${base}ing`;
  const nounPlural=base=>nounIrregular[base]||(/[^aeiou]y$/.test(base)?`${base.slice(0,-1)}ies`:/(s|sh|ch|x|z)$/.test(base)?`${base}es`:`${base}s`);
  const formsFor=word=>{
    const term=word.en;
    if(word.pos==='verb'){
      if(term==='be')return [['I','am'],['you / we / they','are'],['he / she','is'],['past','was / were'],['past participle','been'],['-ing','being']];
      if(term==='be late')return [['I','am late'],['you / we / they','are late'],['he / she','is late'],['past (I / he / she)','was late'],['past (you / we / they)','were late'],['past participle','been late']];
      const [third,past,participle,ing]=irregular[term]||[regularThird(term),regularPast(term),regularPast(term),regularIng(term)];
      return [['I / we',term],['he / she',third],['past',past],['past participle',participle],['-ing',ing]];
    }
    if(word.pos==='noun'){
      if(term==='clothes'||term==='parents'||term==='vegetables')return [['plural',term],['singular',term==='clothes'?'—':term.slice(0,-1)],['usage',term==='clothes'?'plural only':'usually plural']];
      if(mass.has(term))return [['base',term],['plural','обычно неисчисляемое'],['usage',term==='coffee'||term==='tea'?`a ${term} / two ${term}s — порции`:term==='health'?'good health':`some ${term}`]];
      return [['singular',term],['plural',nounPlural(term)],['usage',term==='fish'?'one fish / two fish':`${/^[aeiou]/i.test(term)||term==='hour'?'an':'a'} ${term}`]];
    }
    if(word.pos==='adjective'){
      if(noComparison.has(term))return [['base',term],['comparison','обычно без степени сравнения']];
      const comp=adjectiveIrregular[term]||(term.length>6||term==='tired'||term==='expensive'?['more '+term,'most '+term]:[term.endsWith('e')?term+'r':term+'er',term.endsWith('e')?term+'st':term+'est']);
      return [['base',term],['comparative',comp[0]],['superlative',comp[1]]];
    }
    if(word.pos==='pronoun'){
      if(term.startsWith('the two of '))return [['phrase',term],['usage',term.replace('the two of ','both of ')]];
      if(term==='both')return [['base','both'],['usage','both of us / both of them']];
      return [['base',term],['object',pronouns[term]?.[0]||term],['possessive',pronouns[term]?.[1]||'—'],['independent',pronouns[term]?.[2]||'—']];
    }
    if(word.pos==='number')return [['cardinal',term],['ordinal',ordinals[term]||'—']];
    if(word.pos==='adverb'&&({well:1,far:1,slowly:1,soon:1})[term]){const pair={well:['better','best'],far:['farther / further','farthest / furthest'],slowly:['more slowly','most slowly'],soon:['sooner','soonest']}[term];return [['base',term],['comparative',pair[0]],['superlative',pair[1]]];}
    return [['base',term],['usage','не изменяется']];
  };
  const cards=window.GLAGOLICA_VOCAB.flatMap((day,dayIndex)=>day.map((word,index)=>{
    const directPhoto=directReject.has(word.en)?null:core.photoForSl(word.sl);
    const photo=visualFallback.has(word.en)?null:core.photoForSl(photoOverride[word.en]||'')||directPhoto||null;
    const clearPhoto=new Set(['house','window','table','water','book','bread','milk','apple','shop','money','school','doctor','city','train','road','car']);
    return {...word,id:`en-${dayIndex}-${index}`,day:dayIndex,photo,pictogram:pictograms[word.en]||'💬',photoSpecific:Boolean(photo&&clearPhoto.has(word.en)),forms:formsFor(word),examples:window.GLAGOLICA_EN_EXAMPLES[dayIndex][index],exampleRu:window.GLAGOLICA_EN_EXAMPLE_RU[dayIndex][index],irregular:Boolean(irregular[word.en]||word.en==='be late'),hue:[...word.en].reduce((n,c)=>(n*31+c.charCodeAt(0))%360,17)};
  }));
  if(cards.length!==225||cards.some(card=>card.examples.length!==3||card.exampleRu.length!==3))throw new Error('English cards dataset incomplete');
  window.GLAGOLICA_EN_CARDS=cards;
})();

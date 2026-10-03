// Enrich all 225 existing vocabulary rows without changing course IDs or progress.
(() => {
  // A photograph is used only when its subject actually illustrates the English meaning.
  // Abstract words and words with no unambiguous photo use a pictogram instead.
  // Photo selections are audited independently from the Slovene dictionary.
  const photoSelections = {
    "speak": {"src":"https://images.pexels.com/photos/10339902/pexels-photo-10339902.jpeg","page":"two-old-men-sitting-on-bench-in-park-in-autumn-10339902","author":"Reem  Mansour","practice":false},
    "family": {"src":"https://images.pexels.com/photos/4262174/pexels-photo-4262174.jpeg","page":"family-having-dinner-together-4262174","author":"August de Richelieu","practice":false},
    "mother": {"src":"https://images.pexels.com/photos/3889822/pexels-photo-3889822.jpeg","page":"photo-of-woman-carrying-toddler-3889822","author":"Taryn Elliott","practice":false},
    "father": {"src":"https://images.pexels.com/photos/8763195/pexels-photo-8763195.jpeg","page":"man-and-his-children-on-the-bed-8763195","author":"Pavel Danilyuk","practice":false},
    "child": {"src":"https://images.pexels.com/photos/4005590/pexels-photo-4005590.jpeg","page":"baby-lying-on-white-bed-4005590","author":"Vidal Balielo Jr.","practice":false},
    "friend": {"src":"https://images.pexels.com/photos/5047002/pexels-photo-5047002.jpeg","page":"women-holding-disposable-cups-laughing-5047002","author":"Ketut Subiyanto","practice":false},
    "love": {"src":"https://images.pexels.com/photos/3889822/pexels-photo-3889822.jpeg","page":"photo-of-woman-carrying-toddler-3889822","author":"Taryn Elliott","practice":false},
    "house": {"src":"https://images.pexels.com/photos/30992623/pexels-photo-30992623.jpeg","page":"charming-cottage-in-lush-garden-setting-30992623","author":"Marcel Condurachi","practice":true},
    "window": {"src":"https://images.pexels.com/photos/921294/pexels-photo-921294.png","page":"clear-glass-window-with-brown-and-white-wooden-frame-921294","author":"João  Jesus","practice":true},
    "bed": {"src":"https://images.pexels.com/photos/3872927/pexels-photo-3872927.jpeg","page":"pillows-on-the-bed-3872927","author":"Castorly Stock","practice":false},
    "tea": {"src":"https://images.pexels.com/photos/6838523/pexels-photo-6838523.jpeg","page":"hot-tea-on-outdoor-table-6838523","author":"Kampus Production","practice":false},
    "water": {"src":"https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg","page":"fluid-pouring-in-pint-glass-416528","author":"Pixabay","practice":true},
    "breakfast": {"src":"https://images.pexels.com/photos/16149475/pexels-photo-16149475.jpeg","page":"eggs-and-milk-breakfast-preparation-16149475","author":"Natali Yakovleva","practice":false},
    "order": {"src":"https://images.pexels.com/photos/36799163/pexels-photo-36799163.jpeg","page":"waiter-taking-order-in-a-cozy-restaurant-setting-36799163","author":"khezez  | خزاز","practice":false},
    "shop": {"src":"https://images.pexels.com/photos/4437148/pexels-photo-4437148.jpeg","page":"various-products-on-half-empty-store-shelves-4437148","author":"Roy Broo","practice":false},
    "money": {"src":"https://images.pexels.com/photos/10356910/pexels-photo-10356910.png","page":"money-euro-corporate-money-background-10356910","author":"Tim Heckmann","practice":true},
    "bread": {"src":"https://images.pexels.com/photos/8599723/pexels-photo-8599723.jpeg","page":"a-loaf-of-bread-8599723","author":"Polina Tankilevitch","practice":true},
    "milk": {"src":"https://images.pexels.com/photos/5946733/pexels-photo-5946733.jpeg","page":"5946733","practice":true},
    "apple": {"src":"https://images.pexels.com/photos/4117425/pexels-photo-4117425.jpeg","page":"close-up-photo-of-apple-4117425","author":"AS Photography","practice":true},
    "teacher": {"src":"https://images.pexels.com/photos/6502822/pexels-photo-6502822.jpeg","page":"a-female-teacher-tutoring-her-male-student-6502822","author":"Thirdman","practice":false},
    "doctor": {"src":"https://images.pexels.com/photos/20100299/pexels-photo-20100299.jpeg","page":"stethoscope-in-doctor-hands-20100299","author":"Felipe Queiroz","practice":false},
    "office": {"src":"https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg","page":"men-sitting-at-the-desks-in-an-office-and-using-computers-6804068","author":"cottonbro studio","practice":false},
    "colleague": {"src":"https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg","page":"men-sitting-at-the-desks-in-an-office-and-using-computers-6804068","author":"cottonbro studio","practice":false},
    "work": {"src":"https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg","page":"carpenter-working-with-wood-on-industrial-saw-32357250","author":"HONG SON","practice":false},
    "study": {"src":"https://images.pexels.com/photos/8617988/pexels-photo-8617988.jpeg","page":"a-desk-globe-on-a-wooden-desk-in-a-classroom-8617988","author":"Yan Krukau","practice":false},
    "read": {"src":"https://images.pexels.com/photos/346735/pexels-photo-346735.jpeg","page":"man-reading-book-346735","author":"Porapak Apichodilok","practice":false},
    "finish": {"src":"https://images.pexels.com/photos/10313865/pexels-photo-10313865.jpeg","page":"a-marathoner-finishing-a-race-10313865","author":"RUN 4 FFWPU","practice":false},
    "city": {"src":"https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg","page":"a-view-of-prague-16922421","author":"Diego F. Parra","practice":false},
    "street": {"src":"https://images.pexels.com/photos/10121600/pexels-photo-10121600.jpeg","page":"people-walking-on-a-pedestrian-lane-10121600","author":"Otto Rascon","practice":false},
    "go": {"src":"https://images.pexels.com/photos/11798079/pexels-photo-11798079.jpeg","page":"people-walking-on-pathway-between-trees-11798079","author":"Chris F","practice":false},
    "train": {"src":"https://images.pexels.com/photos/33968153/pexels-photo-33968153.jpeg","page":"bustling-scene-at-york-train-station-platform-33968153","author":"Mike Norris","practice":true},
    "train station": {"src":"https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg","page":"train-arriving-at-a-station-9993828","author":"Marcus Ireland","practice":false},
    "road": {"src":"https://images.pexels.com/photos/30729231/pexels-photo-30729231.jpeg","page":"quiet-mountain-village-street-scene-with-cars-30729231","author":"Dhanraj Priyadarshi","practice":true},
    "car": {"src":"https://images.pexels.com/photos/10971731/pexels-photo-10971731.jpeg","page":"cars-parked-on-the-street-10971731","author":"Mario Amé","practice":true},
    "arrive": {"src":"https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg","page":"train-arriving-at-a-station-9993828","author":"Marcus Ireland","practice":false},
    "leave": {"src":"https://images.pexels.com/photos/7446973/pexels-photo-7446973.jpeg","page":"man-in-red-coat-and-woman-in-red-poncho-holding-hands-and-suitcases-7446973","author":"Gustavo Fring","practice":false},
    "be late": {"src":"https://images.pexels.com/photos/3888018/pexels-photo-3888018.jpeg","page":"man-in-a-purple-suit-running-beside-blue-and-white-train-3888018","author":"Andrea Piacquadio","practice":false},
    "platform": {"src":"https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg","page":"train-arriving-at-a-station-9993828","author":"Marcus Ireland","practice":false},
    "soup": {"src":"https://images.pexels.com/photos/34640219/pexels-photo-34640219.jpeg","page":"enamel-pot-on-gas-stove-with-steaming-soup-34640219","author":"betül nur akyürek","practice":false},
    "cook": {"src":"https://images.pexels.com/photos/8629103/pexels-photo-8629103.jpeg","page":"a-person-cooking-over-the-stove-using-a-frying-pan-8629103","author":"Kampus Production","practice":false},
    "cut": {"src":"https://images.pexels.com/photos/11646501/pexels-photo-11646501.jpeg","page":"a-top-view-of-a-bread-knife-and-a-sliced-loaf-11646501","author":"adrian vieriu","practice":false},
    "head": {"src":"https://images.pexels.com/photos/7105550/pexels-photo-7105550.jpeg","page":"close-up-of-a-girl-with-hand-on-chin-looking-afar-7105550","author":"Kindel Media","practice":false},
    "hand": {"src":"https://images.pexels.com/photos/15516830/pexels-photo-15516830.jpeg","page":"a-person-holding-a-hand-painted-pink-15516830","author":"Ludovic Delot","practice":false},
    "tired": {"src":"https://images.pexels.com/photos/8961615/pexels-photo-8961615.jpeg","page":"a-woman-in-a-plaid-shirt-sitting-8961615","author":"Mikael Blomkvist","practice":false},
    "weekend": {"src":"https://images.pexels.com/photos/1229753/pexels-photo-1229753.jpeg","page":"person-lying-on-hammock-between-trees-at-daytime-1229753","author":"Max Andrey","practice":false},
    "question": {"src":"https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg","page":"question-mark-on-chalk-board-356079","author":"Pixabay","practice":false},
    "help": {"src":"https://images.pexels.com/photos/10638724/pexels-photo-10638724.jpeg","page":"close-up-shot-of-two-people-holding-hands-10638724","author":"Nathan Marcam","practice":false},
    "ask": {"src":"https://images.pexels.com/photos/32094079/pexels-photo-32094079.jpeg","page":"classroom-learning-with-engaged-students-studying-32094079","author":"Nasirun Khan","practice":false},
    "hear": {"src":"https://images.pexels.com/photos/29527897/pexels-photo-29527897.jpeg","page":"elderly-man-enjoying-outdoor-concert-at-twilight-29527897","author":"William Gevorg Urban","practice":false},
    "see": {"src":"https://images.pexels.com/photos/1720080/pexels-photo-1720080.jpeg","page":"woman-in-purple-cardigan-using-binoculars-1720080","author":"Ricky Esquivel","practice":false},
    "bus": {"src":"https://images.pexels.com/photos/19736818/pexels-photo-19736818.jpeg","page":"19736818","practice":true},
    "room": {"src":"https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg","page":"1643383","practice":false},
    "door": {"src":"https://images.pexels.com/photos/11350641/pexels-photo-11350641.jpeg","page":"11350641","practice":true},
    "flat": {"src":"https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg","page":"1571460","practice":false},
    "coffee": {"src":"https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg","page":"302899","practice":true},
    "clothes": {"src":"https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg","page":"996329","practice":true},
    "food": {"src":"https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg","page":"1640777","practice":true},
    "meat": {"src":"https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg","page":"2338407","practice":false},
    "fish": {"src":"https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg","page":"725991","practice":false},
    "cheese": {"src":"https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg","page":"821365","practice":true},
    "sugar": {"src":"https://images.pexels.com/photos/2523650/pexels-photo-2523650.jpeg","page":"2523650","practice":true},
    "vegetables": {"src":"https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg","page":"5425893","practice":true},
    "fruit": {"src":"https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg","page":"1132047","practice":true},
    "hospital": {"src":"https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg","page":"668300","practice":false},
    "map": {"src":"https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg","page":"592753","practice":true},
    "table": {"src":"https://images.pexels.com/photos/2098913/pexels-photo-2098913.jpeg","page":"2098913","practice":true},
    "key": {"src":"https://images.pexels.com/photos/5599449/pexels-photo-5599449.jpeg","page":"5599449","practice":true},
    "buy": {"src":"https://images.pexels.com/photos/17160607/pexels-photo-17160607.jpeg","page":"17160607","practice":false},
    "airport": {"src":"https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg","page":"1008155","practice":false},
    "book": {"src":"https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg","page":"46274","practice":true},
    "sleep": {"src":"https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg","page":"3771069","practice":false},
    "drink": {"src":"https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg","page":"1458671","practice":false},
    "café": {"src":"https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg","page":"260922","practice":false},
    "lunch": {"src":"https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg","page":"70497","practice":false},
    "dinner": {"src":"https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg","page":"262978","practice":false},
    "bag": {"src":"https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg","page":"904350","practice":true},
    "kitchen": {"src":"https://images.pexels.com/photos/1757313/pexels-photo-1757313.jpeg","page":"1757313","practice":true},
    "bathroom": {"src":"https://images.pexels.com/photos/6782573/pexels-photo-6782573.jpeg","page":"6782573","practice":true},
    "cup": {"src":"https://images.pexels.com/photos/18334760/pexels-photo-18334760.jpeg","page":"18334760","practice":true},
    "glass": {"src":"https://images.pexels.com/photos/12984537/pexels-photo-12984537.jpeg","page":"12984537","practice":true},
    "plate": {"src":"https://images.pexels.com/photos/18677610/pexels-photo-18677610.jpeg","page":"18677610","practice":true},
    "park": {"src":"https://images.pexels.com/photos/10135374/pexels-photo-10135374.jpeg","page":"10135374","practice":true},
    "bridge": {"src":"https://images.pexels.com/photos/7562170/pexels-photo-7562170.jpeg","page":"7562170","practice":true},
    "pharmacy": {"src":"https://images.pexels.com/photos/13119976/pexels-photo-13119976.jpeg","page":"13119976","practice":false},
    "traffic light": {"src":"https://images.pexels.com/photos/35818849/pexels-photo-35818849.jpeg","page":"35818849","practice":true},
    "spoon": {"src":"https://images.pexels.com/photos/12021477/pexels-photo-12021477.jpeg","page":"12021477","practice":true},
    "eye": {"src":"https://images.pexels.com/photos/4823600/pexels-photo-4823600.jpeg","page":"4823600","practice":true},
    "salt": {"src":"https://images.pexels.com/photos/6690894/pexels-photo-6690894.jpeg","page":"6690894","practice":false},
    "fork": {"src":"https://images.pexels.com/photos/106346/pexels-photo-106346.jpeg","page":"106346","practice":true},
    "ear": {"src":"https://images.pexels.com/photos/7480268/pexels-photo-7480268.jpeg","page":"7480268","practice":true},
    "medicine": {"src":"https://images.pexels.com/photos/3683102/pexels-photo-3683102.jpeg","page":"3683102","practice":true},
    "mouth": {"src":"https://images.pexels.com/photos/13586575/pexels-photo-13586575.jpeg","page":"13586575","practice":true}
  };
  const pictograms={I:'🙋',you:'👉',he:'👨',she:'👩',name:'🔤',hello:'👋',yes:'✅',no:'❌',who:'❔',what:'❔',where:'📍','where from':'🧭',how:'❔',be:'✨',have:'👐',mother:'👩‍👧',father:'👨‍👧',brother:'👦',sister:'👧',son:'👦',daughter:'👧',wife:'💍',husband:'💍',parents:'👨‍👩‍👧',person:'🧍',room:'🛋️',door:'🚪',sit:'🪑',open:'🚪',key:'🔑',coffee:'☕',bill:'🧾',menu:'📋',tasty:'😋',want:'💭',price:'🏷️',expensive:'💰',cheap:'🏷️',buy:'🛒',product:'📦',today:'📅',tomorrow:'➡️',yesterday:'⬅️',morning:'🌅',evening:'🌇',Monday:'📅',Tuesday:'📅',Wednesday:'📅',Thursday:'📅',Friday:'📅',week:'🗓️',hour:'🕒',minute:'⏱️',time:'⌚',when:'❔',work:'🛠️',busy:'📚','at home':'🏠',task:'✅',centre:'🎯',left:'⬅️',right:'➡️','straight ahead':'⬆️',nearby:'📍',far:'🗺️',turn:'↪️',park:'🌳',square:'🏙️',bridge:'🌉','traffic light':'🚦',map:'🗺️',bus:'🚌',ticket:'🎫',stop:'🚏',ride:'🚲',passenger:'🧍',timetable:'📋',two:'2️⃣',one:'1️⃣',three:'3️⃣',four:'4️⃣',five:'5️⃣',six:'6️⃣',seven:'7️⃣',eight:'8️⃣','the two of us':'👥','the two of you':'👥','the two of them':'👥',both:'👥',together:'🤝',meat:'🥩',fish:'🐟',cheese:'🧀',salt:'🧂',sugar:'🍬',plate:'🍽️',spoon:'🥄',fork:'🍴',vegetables:'🥕',fruit:'🍎',health:'❤️',pharmacy:'💊',hospital:'🏥',medicine:'💊',hurt:'🤕',fever:'🌡️',pain:'😣',eye:'👁️',ear:'👂',mouth:'👄',leg:'🦵',earlier:'⬅️',later:'➡️',soon:'⏳',always:'♾️',sometimes:'🔄',never:'🚫',day:'☀️',night:'🌙',previous:'⬅️',next:'➡️',month:'🗓️',year:'📆',past:'⬅️',future:'➡️',please:'🙏','thank you':'🙏','excuse me':'🙇',slowly:'🐢',well:'👍',understand:'💡',repeat:'🔁',show:'👆',know:'🧠',big:'📏',small:'📐',good:'👍',bad:'👎',here:'📍',there:'👉',correct:'✅',possible:'✅',important:'❗',new:'✨',old:'🕰️',need:'🙋'};
  const irregular={
    be:['is','was / were','been','being'],come:['comes','came','come','coming'],speak:['speaks','spoke','spoken','speaking'],have:['has','had','had','having'],sleep:['sleeps','slept','slept','sleeping'],sit:['sits','sat','sat','sitting'],drink:['drinks','drank','drunk','drinking'],eat:['eats','ate','eaten','eating'],buy:['buys','bought','bought','buying'],sell:['sells','sold','sold','selling'],pay:['pays','paid','paid','paying'],write:['writes','wrote','written','writing'],read:['reads','read','read','reading'],go:['goes','went','gone','going'],ride:['rides','rode','ridden','riding'],leave:['leaves','left','left','leaving'],cut:['cuts','cut','cut','cutting'],hurt:['hurts','hurt','hurt','hurting'],understand:['understands','understood','understood','understanding'],show:['shows','showed','shown','showing'],know:['knows','knew','known','knowing'],hear:['hears','heard','heard','hearing'],see:['sees','saw','seen','seeing'],
  };
  const nounIrregular={child:'children',person:'people',wife:'wives',family:'families',city:'cities',bus:'buses',fish:'fish',glass:'glasses',clothes:'clothes',parents:'parents',vegetables:'vegetables',café:'cafés'};
  const mass=new Set(['coffee','tea','water','money','bread','milk','work','food','meat','cheese','salt','sugar','fruit','health','medicine','help','time','past','future','soup','pain']);
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
      if(term==='be late')return [['I','am late'],['you / we / they','are late'],['he / she','is late'],['past (I / he / she)','was late'],['past (you / we / they)','were late'],['past participle','been late'],['-ing','being late']];
      const [third,past,participle,ing]=irregular[term]||[regularThird(term),regularPast(term),regularPast(term),regularIng(term)];
      return [['I / we',term],['he / she',third],['past',past],['past participle',participle],['-ing',ing]];
    }
    if(word.pos==='noun'){
      if(term==='clothes')return [['plural','clothes'],['singular','—'],['usage','plural only; some clothes']];
      if(term==='parents'||term==='vegetables')return [['plural',term],['singular',term.slice(0,-1)],['usage','usually plural']];
      if(mass.has(term))return [['base',term],['plural','обычно неисчисляемое'],['usage',term==='coffee'||term==='tea'?`a ${term} / two ${term}s — порции`:({health:'good health',past:'in the past',future:'in the future',time:'some time / two times (два раза)',help:'some help',pain:'in pain / a pain in my leg',soup:'some soup / two soups — порции'})[term]||`some ${term}`]];
      if(['breakfast','lunch','dinner'].includes(term))return [['singular',term],['plural',nounPlural(term)],['usage',`have ${term} / a big ${term}`]];
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
      if(term==='who')return [['base','who'],['object','who / whom'],['possessive','whose'],['usage','Whom is formal; who is usual in conversation.']];
      return [['base',term],['object',pronouns[term]?.[0]||term],['possessive',pronouns[term]?.[1]||'—'],['independent',pronouns[term]?.[2]||'—']];
    }
    if(word.pos==='number')return [['cardinal',term],['ordinal',ordinals[term]||'—']];
    if(word.pos==='adverb'&&({well:1,far:1,slowly:1,soon:1})[term]){const pair={well:['better','best'],far:['farther / further','farthest / furthest'],slowly:['more slowly','most slowly'],soon:['sooner','soonest']}[term];return [['base',term],['comparative',pair[0]],['superlative',pair[1]]];}
    return [['base',term],['usage','не изменяется']];
  };
  const cards=window.GLAGOLICA_VOCAB.flatMap((day,dayIndex)=>day.map((word,index)=>{
    const selection=photoSelections[word.en];
    const photo=selection || null;
    const englishRu=({'en-9-2':'мы вдвоём','en-9-3':'мы вдвоём','en-9-4':'вы вдвоём','en-9-5':'они вдвоём'})[`en-${dayIndex}-${index}`]||word.ru;
    return {...word,ru:englishRu,id:`en-${dayIndex}-${index}`,day:dayIndex,photo,pictogram:pictograms[word.en]||'💬',photoSpecific:Boolean(photo&&selection.practice===true),forms:formsFor(word),examples:window.GLAGOLICA_EN_EXAMPLES[dayIndex][index],exampleRu:window.GLAGOLICA_EN_EXAMPLE_RU[dayIndex][index],irregular:Boolean(irregular[word.en]||word.en==='be late'),hue:[...word.en].reduce((n,c)=>(n*31+c.charCodeAt(0))%360,17)};
  }));
  if(cards.length!==225||cards.some(card=>card.examples.length!==3||card.exampleRu.length!==3))throw new Error('English cards dataset incomplete');
  window.GLAGOLICA_EN_CARDS=cards;
})();

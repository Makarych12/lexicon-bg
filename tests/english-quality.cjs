// Dataset audit, including comparison with the committed compatibility baseline.
// Run: node tests/english-quality.cjs [--json]
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process');
function load(baseline=false,synthetic=null){
  const read=f=>baseline?cp.execFileSync('git',['show',`HEAD:${f}`],{encoding:'utf8'}):fs.readFileSync(f,'utf8');
  const ctx={window:{}};vm.createContext(ctx);
  const maps=[...read('index.html').matchAll(/const (slPhotos|slWordPhotos)\s*=\s*({[^\n]+});/g)].map(m=>JSON.parse(m[2]));
  ctx.window.GLAGOLICA_CARD_CORE={photoForSl(lemma){const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');for(const map of maps)for(const [key,value] of Object.entries(map))if(fold(key)===fold(lemma))return value;return null;}};
  for(const f of ['data/vocabulary.js','data/vocabulary-extra.js','data/english-card-examples.js','data/english-card-translations.js','data/english-cards.js']){if(f==='data/english-cards.js'&&synthetic)ctx.window.GLAGOLICA_VOCAB[0][0]={...ctx.window.GLAGOLICA_VOCAB[0][0],en:synthetic,pos:'verb'};vm.runInContext(read(f),ctx,{filename:f});}
  return JSON.parse(JSON.stringify(ctx.window.GLAGOLICA_EN_CARDS));
}
const cards=load(),before=load(true),forms=(term,pos)=>Object.fromEntries(cards.find(c=>c.en===term&&(!pos||c.pos===pos)).forms);
assert.equal(cards.length,225);assert.deepEqual(cards.map(c=>c.id),before.map(c=>c.id));
assert.deepEqual(cards.map(c=>[c.en,c.sl,c.day,c.pos]),before.map(c=>[c.en,c.sl,c.day,c.pos]));
const sentences=new Set(),normalized=new Set();
for(const c of cards){
  assert.equal(c.examples.length,3,c.id);assert.equal(c.exampleRu.length,3,c.id);
  c.examples.forEach((en,i)=>{
    assert(en.trim()&&c.exampleRu[i].trim(),c.id);assert(!/[<>\u0400-\u04ff]/.test(en),c.id);
    assert(/[\u0400-\u04ff]/.test(c.exampleRu[i]),c.id);
    assert(!sentences.has(en),`Duplicate: ${en}`);sentences.add(en);
    const key=en.toLowerCase().replace(/[.,!?;:]/g,'').replace(/\s+/g,' ').trim();
    assert(!normalized.has(key),`Normalized duplicate: ${en}`);normalized.add(key);
  });
  assert(c.photo||c.pictogram,c.id);if(c.photo){assert(/^https:\/\/images\.pexels\.com\/photos\/\d+\//.test(c.photo.src),c.en);assert(c.photo.page,c.en);}
  if(c.photoSpecific)assert(c.photo,c.en);
}
const irregular={be:['is','was / were','been','being'],have:['has','had','had','having'],go:['goes','went','gone','going'],speak:['speaks','spoke','spoken','speaking'],write:['writes','wrote','written','writing'],read:['reads','read','read','reading'],see:['sees','saw','seen','seeing'],hear:['hears','heard','heard','hearing'],know:['knows','knew','known','knowing'],eat:['eats','ate','eaten','eating'],drink:['drinks','drank','drunk','drinking'],buy:['buys','bought','bought','buying'],sell:['sells','sold','sold','selling'],pay:['pays','paid','paid','paying'],leave:['leaves','left','left','leaving'],ride:['rides','rode','ridden','riding'],sleep:['sleeps','slept','slept','sleeping'],sit:['sits','sat','sat','sitting'],cut:['cuts','cut','cut','cutting'],hurt:['hurts','hurt','hurt','hurting'],show:['shows','showed','shown','showing'],understand:['understands','understood','understood','understanding']};
for(const [term,expected] of Object.entries(irregular)){const f=forms(term,'verb');assert.deepEqual(['he / she','past','past participle','-ing'].map(k=>f[k]),expected,term);}
const regular={love:['loves','loved','loving'],live:['lives','lived','living'],open:['opens','opened','opening'],close:['closes','closed','closing'],want:['wants','wanted','wanting'],order:['orders','ordered','ordering'],work:['works','worked','working'],study:['studies','studied','studying'],start:['starts','started','starting'],finish:['finishes','finished','finishing'],arrive:['arrives','arrived','arriving'],cook:['cooks','cooked','cooking'],repeat:['repeats','repeated','repeating'],ask:['asks','asked','asking'],answer:['answers','answered','answering'],help:['helps','helped','helping'],need:['needs','needed','needing']};
for(const [term,expected] of Object.entries(regular)){const f=forms(term,'verb');assert.deepEqual(['he / she','past','-ing'].map(k=>f[k]),expected,term);assert.equal(f['past participle'],expected[1],term);}
assert.equal(Object.keys(irregular).length+Object.keys(regular).length+1,cards.filter(c=>c.pos==='verb').length);
assert.deepEqual(load(false,'come')[0].forms.map(([,value])=>value),['come','comes','came','come','coming']);
assert.equal(forms('be late')['-ing'],'being late');assert.equal(forms('be late')['past participle'],'been late');
for(const [term,plural] of Object.entries({child:'children',person:'people',wife:'wives',family:'families',city:'cities',bus:'buses',fish:'fish',glass:'glasses',café:'cafés',clothes:'clothes',parents:'parents',vegetables:'vegetables'}))assert.equal(forms(term).plural,plural,term);
for(const term of ['coffee','tea','water','money','bread','milk','food','meat','cheese','salt','sugar','fruit','health','medicine','time','past','future','soup','pain'])assert.equal(forms(term).plural,'обычно неисчисляемое',term);
assert.equal(forms('help','noun').plural,'обычно неисчисляемое');assert.equal(forms('parents').singular,'parent');assert.equal(forms('vegetables').singular,'vegetable');
for(const [term,values] of Object.entries({good:['better','best'],bad:['worse','worst'],big:['bigger','biggest'],busy:['busier','busiest'],tasty:['tastier','tastiest'],small:['smaller','smallest'],new:['newer','newest'],old:['older','oldest'],expensive:['more expensive','most expensive'],important:['more important','most important'],tired:['more tired','most tired'],cheap:['cheaper','cheapest']}))assert.deepEqual([forms(term).comparative,forms(term).superlative],values,term);
for(const term of ['previous','next','possible','correct'])assert(!forms(term).comparative,term);
for(const [term,value] of Object.entries({I:'me',you:'you',he:'him',she:'her'}))assert.equal(forms(term).object,value);
for(const term of ['the two of us','the two of you','the two of them'])assert.equal(forms(term).phrase,term);
const duplicateGroups=Object.values(Object.groupBy(cards,c=>c.en)).filter(group=>group.length>1);
assert.deepEqual(duplicateGroups.map(g=>g[0].en).sort(),['answer','doctor','help','the two of us','together','two','work'].sort());
const protectedFiles=['index.html','js/learning.js','data/vocabulary.js','data/vocabulary-extra.js','data/course.js','data/dialogues.js','data/deep-practice.js','data/practice.js','data/lesson-plan.js'];
for(const file of protectedFiles)assert.equal(fs.readFileSync(file,'utf8'),cp.execFileSync('git',['show',`HEAD:${file}`],{encoding:'utf8'}),`Protected Slovene/shared file changed: ${file}`);
const counts={cards:cards.length,pairs:sentences.size,changedEnglish:0,changedRussian:0,newPhotoCards:0,removedPhotoCards:0,photos:cards.filter(c=>c.photo).length,uniquePhotos:new Set(cards.filter(c=>c.photo).map(c=>c.photo.src)).size,fallback:cards.filter(c=>!c.photo).length,changedFormCards:0,changedFormRows:0,pictureExercises:cards.filter(c=>c.photoSpecific).length};
cards.forEach((c,i)=>{const b=before[i];c.examples.forEach((e,j)=>{counts.changedEnglish+=e!==b.examples[j];counts.changedRussian+=c.exampleRu[j]!==b.exampleRu[j];});counts.newPhotoCards+=Boolean(c.photo&&c.photo.src!==b.photo?.src);counts.removedPhotoCards+=Boolean(!c.photo&&b.photo);if(JSON.stringify(c.forms)!==JSON.stringify(b.forms)){counts.changedFormCards++;const old=Object.fromEntries(b.forms),current=Object.fromEntries(c.forms);counts.changedFormRows+=new Set([...Object.keys(old),...Object.keys(current)].filter(key=>old[key]!==current[key])).size;}});
if(process.argv.includes('--photos')){console.log(JSON.stringify([...new Set(cards.filter(c=>c.photo).map(c=>c.photo.src))]));process.exit(0);}
console.log(JSON.stringify(counts,null,2));
const dump=process.argv.find(arg=>arg.startsWith('--dump='));if(dump)fs.writeFileSync(dump.slice(7),JSON.stringify(cards,null,2));
console.log('OK: IDs, protected files, 675 unique bilingual pairs, all 40 verbs, plurals, uncountables, pronouns, comparisons and deliberate duplicate groups');

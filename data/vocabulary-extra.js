// Additional core A1 lemmas, grouped to match the 15 lessons.
window.GLAGOLICA_VOCAB_EXTRA = [
 `кто|kdo|who|pronoun;что|kaj|what|pronoun;где|kje|where|adverb;откуда|od kod|where from|adverb;как|kako|how|adverb;быть|biti|be|verb;говорить|govoriti|speak|verb`,
 `сын|sin|son|noun;дочь|hči|daughter|noun;жена|žena|wife|noun;муж|mož|husband|noun;родители|starši|parents|noun;иметь|imeti|have|verb;любить|imeti rad|love|verb`,
 `жить|živeti|live|verb;спать|spati|sleep|verb;сидеть|sedeti|sit|verb;открыть|odpreti|open|verb;закрыть|zapreti|close|verb;ключ|ključ|key|noun;ванная|kopalnica|bathroom|noun`,
 `пить|piti|drink|verb;есть|jesti|eat|verb;хотеть|hoteti|want|verb;заказать|naročiti|order|verb;вкусный|okusen|tasty|adjective;стакан|kozarec|glass|noun;чашка|skodelica|cup|noun`,
 `купить|kupiti|buy|verb;продать|prodati|sell|verb;платить|plačati|pay|verb;дешёвый|poceni|cheap|adjective;товар|izdelek|product|noun;сумка|torba|bag|noun;одежда|oblačila|clothes|noun`,
 `когда|kdaj|when|adverb;время|čas|time|noun;минута|minuta|minute|noun;вторник|torek|Tuesday|noun;среда|sreda|Wednesday|noun;четверг|četrtek|Thursday|noun;пятница|petek|Friday|noun`,
 `работать|delati|work|verb;учиться|učiti se|study|verb;писать|pisati|write|verb;читать|brati|read|verb;начать|začeti|start|verb;закончить|končati|finish|verb;задача|naloga|task|noun`,
 `идти|iti|go|verb;поворот|ovinek|turn|noun;парк|park|park|noun;площадь|trg|square|noun;мост|most|bridge|noun;светофор|semafor|traffic light|noun;карта|zemljevid|map|noun`,
 `ехать|peljati se|ride|verb;приехать|prispeti|arrive|verb;уехать|oditi|leave|verb;опоздать|zamuditi|be late|verb;пассажир|potnik|passenger|noun;платформа|peron|platform|noun;расписание|vozni red|timetable|noun`,
 `один|en|one|number;три|tri|three|number;четыре|štiri|four|number;пять|pet|five|number;шесть|šest|six|number;семь|sedem|seven|number;восемь|osem|eight|number`,
 `готовить|kuhati|cook|verb;резать|rezati|cut|verb;тарелка|krožnik|plate|noun;ложка|žlica|spoon|noun;вилка|vilice|fork|noun;овощи|zelenjava|vegetables|noun;фрукты|sadje|fruit|noun`,
 `болеть|boleti|hurt|verb;температура|vročina|fever|noun;усталый|utrujen|tired|adjective;боль|bolečina|pain|noun;глаз|oko|eye|noun;ухо|uho|ear|noun;рот|usta|mouth|noun`,
 `прошлый|prejšnji|previous|adjective;следующий|naslednji|next|adjective;месяц|mesec|month|noun;год|leto|year|noun;выходные|konec tedna|weekend|noun;прошедшее|preteklost|past|noun;будущее|prihodnost|future|noun`,
 `понимать|razumeti|understand|verb;повторить|ponoviti|repeat|verb;спросить|vprašati|ask|verb;ответить|odgovoriti|answer|verb;помочь|pomagati|help|verb;показать|pokazati|show|verb;знать|vedeti|know|verb`,
 `слышать|slišati|hear|verb;видеть|videti|see|verb;нуждаться|potrebovati|need|verb;возможный|možen|possible|adjective;важный|pomemben|important|adjective;правильный|pravilen|correct|adjective;вместе|skupaj|together|adverb`
].map(day=>day.split(';').map(row=>{const [ru,sl,en,pos]=row.split('|');return {ru,sl,en,pos,level:'A1',priority:'core'};}));
window.GLAGOLICA_VOCAB.forEach((day,i)=>day.push(...window.GLAGOLICA_VOCAB_EXTRA[i]));

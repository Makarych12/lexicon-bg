// Context-first production drills. Each row: Russian prompt, Slovene answer, skill, explanation, concept.
window.GLAGOLICA_DEEP = {
  cases: [
    ['Я живу в школе.','Živim v šoli.','case','Место: v + mestnik; šola → šoli.','mestnik'],
    ['Я живу в Любляне.','Živim v Ljubljani.','case','Место: v + mestnik; Ljubljana → Ljubljani.','mestnik'],
    ['Я работаю в магазине.','Delam v trgovini.','case','Место: v + mestnik; trgovina → trgovini.','mestnik'],
    ['Я работаю на работе.','Delam v službi.','case','Место: v + mestnik; služba → službi.','mestnik'],
    ['Я иду в школу.','Grem v šolo.','case','Направление: v + tožilnik; šola → šolo.','tozilnik'],
    ['Я иду в магазин.','Grem v trgovino.','case','Направление: v + tožilnik; trgovina → trgovino.','tozilnik'],
    ['Я вижу собаку.','Vidim psa.','case','Мужской одушевлённый объект: pes → psa.','tozilnik'],
    ['Я вижу город.','Vidim mesto.','case','Средний род: mesto сохраняет форму в tožilnik.','tozilnik'],
    ['Нет книги.','Ni knjige.','case','После ni: rodilnik; knjiga → knjige.','rodilnik'],
    ['Я говорю о книге.','Govorim o knjigi.','case','После o: mestnik; knjiga → knjigi.','mestnik'],
    ['Я стою перед школой.','Stojim pred šolo.','case','Положение после pred: orodnik; šola → šolo.','orodnik'],
    ['Я иду к дому.','Grem proti hiši.','case','После proti: dajalnik; hiša → hiši.','dajalnik']
  ],
  dual: [
    ['Мы вдвоём работаем.','Midva delava.','dual','Двое мужчин или смешанная пара: midva + delava.','dual_verb'],
    ['Мы вдвоём (женщины) идём домой.','Midve greva domov.','dual','Две женщины: midve + greva.','dual_verb'],
    ['У нас двоих два билета.','Imava dve vozovnici.','dual','Два участника: imava; две женские вещи: dve vozovnici.','dual_noun'],
    ['Пойдём вдвоём на кофе?','Greva na kavo?','dual','Вопрос о совместном действии двоих: greva.','dual_verb'],
    ['Мы оба устали (мужчины).','Oba sva utrujena.','dual','Oba и sva для двух мужчин; utrujena — форма двойственного числа.','dual_adjective'],
    ['Вы вдвоём (женщины) работаете.','Vidve delata.','dual','Две женщины: vidve + delata.','dual_verb'],
    ['Они вдвоём (женщины) дома.','Onidve sta doma.','dual','Две женщины: onidve + sta.','dual_verb']
  ],
  contrast: [
    ['Я дома.','Sem doma.','verb','Я: sem. Двое: sva. Несколько: smo.','biti'],
    ['Мы вдвоём дома.','Sva doma.','dual','Двое: sva; не smo.','biti'],
    ['Мы (трое или больше) дома.','Smo doma.','verb','Трое и больше: smo.','biti'],
    ['У меня есть время.','Imam čas.','verb','Я: imam. Двое: imava.','imeti'],
    ['У нас двоих есть время.','Imava čas.','dual','Двое: imava.','imeti'],
    ['У нас (трое или больше) есть время.','Imamo čas.','verb','Трое и больше: imamo.','imeti'],
    ['Я иду домой.','Grem domov.','verb','Я: grem; двое: greva; несколько: gremo.','iti'],
    ['Мы вдвоём идём домой.','Greva domov.','dual','Двое: greva.','iti'],
    ['Мы (трое или больше) идём домой.','Gremo domov.','verb','Трое и больше: gremo.','iti'],
    ['Ты идёшь домой.','Greš domov.','verb','Второе лицо единственного числа: greš.','iti'],
    ['Он идёт домой.','Gre domov.','verb','Третье лицо единственного числа: gre.','iti'],
    ['Вы (несколько человек) идёте домой.','Greste domov.','verb','Второе лицо множественного числа: greste.','iti'],
    ['Они идут домой.','Gredo domov.','verb','Третье лицо множественного числа: gredo.','iti'],
    ['Я работаю дома.','Delam doma.','verb','Я: delam. Двое: delava. Несколько: delamo.','delati'],
    ['Мы вдвоём работаем дома.','Delava doma.','dual','Двое: delava.','delati'],
    ['Мы (трое или больше) работаем дома.','Delamo doma.','verb','Трое и больше: delamo.','delati']
  ],
  caseforms: [
    ['hiša → rodilnik, ед. число','hiše','case-form','После ni часто нужен rodilnik: ni hiše.','rodilnik'],
    ['hiša → dajalnik, ед. число','hiši','case-form','После proti: proti hiši.','dajalnik'],
    ['žena → tožilnik, ед. число','ženo','case-form','Одушевлённый женский объект: vidim ženo.','tozilnik'],
    ['mesto → orodnik, ед. число','mestom','case-form','После pred: pred mestom.','orodnik'],
    ['pes → tožilnik, ед. число','psa','case-form','Мужской одушевлённый объект: vidim psa.','tozilnik'],
    ['konj → orodnik, ед. число','konjem','case-form','После s/z: s konjem.','orodnik'],
    ['noč → rodilnik, ед. число','noči','case-form','Форма rodilnik: konec noči.','rodilnik']
  ],
  casefill: [
    ['Govorim o __ (knjiga).','knjigi','case-fill','После o нужен mestnik: o knjigi.','mestnik'],
    ['Ni __ (šola).','šole','case-fill','После ni нужен rodilnik: ni šole.','rodilnik'],
    ['Grem proti __ (hiša).','hiši','case-fill','После proti нужен dajalnik: proti hiši.','dajalnik'],
    ['Stojim pred __ (mesto).','mestom','case-fill','После pred при местонахождении нужен orodnik.','orodnik'],
    ['Vidim __ (pes).','psa','case-fill','Одушевлённый мужской объект: pes → psa.','tozilnik'],
    ['Grem z __ (vlak).','vlakom','case-fill','Транспорт после z: z vlakom.','orodnik']
  ],
  dualsteps: [
    ['Midva delava. Сколько людей?','двое','dual-step','Midva и окончание -va показывают двух участников.','dual_recognition'],
    ['Мы вдвоём работаем: midva __','delava','dual-step','Глагол delati: midva delava.','dual_verb'],
    ['Я работаю дома → мы вдвоём (мужчины) работаем дома.','Midva delava doma.','dual-step','Singular delam → dual delava.','dual_verb'],
    ['Я иду домой → мы вдвоём (женщины) идём домой.','Midve greva domov. / Medve greva domov.','dual-step','Для двух женщин: midve/medve + greva.','dual_verb'],
    ['Мы (трое) дома → мы вдвоём дома.','Sva doma.','dual-step','Plural smo → dual sva.','biti'],
    ['Мы (трое) работаем → мы вдвоём работаем.','Delava.','dual-step','Plural delamo → dual delava.','dual_verb']
  ]
};
window.GLAGOLICA_WORD_EXAMPLES = {
  jaz:'Jaz sem Ana.', ime:'Ime mi je Ana.', družina:'To je moja družina.', mama:'To je moja mama.', hiša:'To je hiša.', soba:'To je moja soba.', kava:'Rad bi kavo.', čaj:'Pijem čaj.', voda:'Pijem vodo.', trgovina:'Kje je trgovina?', knjiga:'To je knjiga.', danes:'Danes delam.', jutri:'Jutri delam.', delo:'Grem na delo.', šola:'Živim blizu šole.', mesto:'Grem v mesto.', levo:'Zavijte levo.', vlak:'Kdaj odpelje vlak?', avtobus:'Grem z avtobusom.', dva:'Imava dva otroka.', dve:'Imava dve vozovnici.', hrana:'Hrana je dobra.', juha:'Všeč mi je juha.', zdravje:'Zdravje je pomembno.', glava:'Boli me glava.', prej:'Pridem prej.', prosim:'Vodo, prosim.', hvala:'Hvala za pomoč.', velik:'To je velik dom.', tukaj:'Živim tukaj.'
};
// Human-reviewed alternatives. Never accept a rearrangement merely because it has the same words.
window.GLAGOLICA_ACCEPTED_VARIANTS = {
  '2-1':['Domov grem.'],
  '5-2':['Delam jutri.'],
  '6-0':['Doma delam.'],
  '6-2':['Ne delam jutri.'],
  '7-1':['V center grem.'],
  '8-3':['Na postajo gremo.'],
  '9-1':['Domov greva.']
};

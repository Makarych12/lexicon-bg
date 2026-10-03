// Russian prompt | Slovene lemma | English lemma | part of speech. Each row belongs to one course day.
window.GLAGOLICA_VOCAB = [
  `я|jaz|I|pronoun;ты|ti|you|pronoun;он|on|he|pronoun;она|ona|she|pronoun;имя|ime|name|noun;привет|živjo|hello|phrase;да|da|yes|adverb;нет|ne|no|adverb`,
  `семья|družina|family|noun;мать|mama|mother|noun;отец|oče|father|noun;брат|brat|brother|noun;сестра|sestra|sister|noun;ребёнок|otrok|child|noun;друг|prijatelj|friend|noun;человек|človek|person|noun`,
  `дом|hiša|house|noun;комната|soba|room|noun;дверь|vrata|door|noun;окно|okno|window|noun;стол|miza|table|noun;кровать|postelja|bed|noun;кухня|kuhinja|kitchen|noun;квартира|stanovanje|flat|noun`,
  `кафе|kavarna|café|noun;кофе|kava|coffee|noun;чай|čaj|tea|noun;вода|voda|water|noun;счёт|račun|bill|noun;меню|jedilni list|menu|noun;завтрак|zajtrk|breakfast|noun;обед|kosilo|lunch|noun`,
  `магазин|trgovina|shop|noun;цена|cena|price|noun;деньги|denar|money|noun;книга|knjiga|book|noun;хлеб|kruh|bread|noun;молоко|mleko|milk|noun;яблоко|jabolko|apple|noun;дорогой|drag|expensive|adjective`,
  `сегодня|danes|today|adverb;завтра|jutri|tomorrow|adverb;вчера|včeraj|yesterday|adverb;утро|jutro|morning|noun;вечер|večer|evening|noun;понедельник|ponedeljek|Monday|noun;неделя|teden|week|noun;час|ura|hour|noun`,
  `работа|delo|work|noun;школа|šola|school|noun;учитель|učitelj|teacher|noun;врач|zdravnik|doctor|noun;офис|pisarna|office|noun;коллега|sodelavec|colleague|noun;занятой|zaposlen|busy|adjective;дома|doma|at home|adverb`,
  `город|mesto|city|noun;улица|ulica|street|noun;центр|središče|centre|noun;лево|levo|left|adverb;право|desno|right|adverb;прямо|naravnost|straight ahead|adverb;рядом|blizu|nearby|adverb;далеко|daleč|far|adverb`,
  `поезд|vlak|train|noun;автобус|avtobus|bus|noun;билет|vozovnica|ticket|noun;вокзал|železniška postaja|train station|noun;остановка|postaja|stop|noun;дорога|cesta|road|noun;машина|avto|car|noun;аэропорт|letališče|airport|noun`,
  `два|dva|two|number;две|dve|two|number;мы вдвоём (мужчины)|midva|the two of us|pronoun;мы вдвоём (женщины)|medve / midve|the two of us|pronoun;вы вдвоём (мужчины)|vidva|the two of you|pronoun;они вдвоём (мужчины)|onadva|the two of them|pronoun;вместе|skupaj|together|adverb;оба|oba|both|pronoun`,
  `еда|hrana|food|noun;суп|juha|soup|noun;мясо|meso|meat|noun;рыба|riba|fish|noun;сыр|sir|cheese|noun;соль|sol|salt|noun;сахар|sladkor|sugar|noun;ужин|večerja|dinner|noun`,
  `здоровье|zdravje|health|noun;голова|glava|head|noun;рука|roka|hand|noun;нога|noga|leg|noun;врач|zdravnik|doctor|noun;аптека|lekarna|pharmacy|noun;больница|bolnišnica|hospital|noun;лекарство|zdravilo|medicine|noun`,
  `раньше|prej|earlier|adverb;позже|pozneje|later|adverb;скоро|kmalu|soon|adverb;всегда|vedno|always|adverb;иногда|včasih|sometimes|adverb;никогда|nikoli|never|adverb;день|dan|day|noun;ночь|noč|night|noun`,
  `пожалуйста|prosim|please|phrase;спасибо|hvala|thank you|phrase;извините|oprostite|excuse me|phrase;вопрос|vprašanje|question|noun;ответ|odgovor|answer|noun;медленно|počasi|slowly|adverb;хорошо|dobro|well|adverb;помощь|pomoč|help|noun`,
  `большой|velik|big|adjective;маленький|majhen|small|adjective;хороший|dober|good|adjective;плохой|slab|bad|adjective;новый|nov|new|adjective;старый|star|old|adjective;здесь|tukaj|here|adverb;там|tam|there|adverb`
].map(day=>day.split(';').map(row=>{const [ru,sl,en,pos]=row.split('|');return {ru,sl,en,pos,level:'A1',priority:'core'};}));

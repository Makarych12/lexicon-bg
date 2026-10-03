window.GLAGOLICA_DIALOGUES = [
  {name:'Знакомство',turns:[['Živjo! Kako ti je ime?','Меня зовут Анна.','Ime mi je Ana.'],['Od kod si?','Я из России.','Sem iz Rusije.']]},
  {name:'Кафе',turns:[['Dober dan. Kaj želite?','Я бы хотел кофе.','Rad bi kavo. / Rada bi kavo.'],['Še kaj?','Счёт, пожалуйста.','Račun, prosim.']]},
  {name:'Магазин',turns:[['Dober dan. Vam lahko pomagam?','Мне нужна вода.','Potrebujem vodo.'],['Seveda. Še kaj?','Сколько это стоит?','Koliko to stane?']]},
  {name:'Вокзал',turns:[['Kam potujete?','В Любляну, пожалуйста.','V Ljubljano, prosim.'],['Enosmerno ali povratno?','Билет в одну сторону, пожалуйста.','Enosmerno vozovnico, prosim.']]},
  {name:'Транспорт',turns:[['Ali čakate avtobus?','Да, я жду автобус.','Da, čakam avtobus.'],['Kateri avtobus potrebujete?','Мне нужен автобус до центра.','Potrebujem avtobus do središča.']]},
  {name:'Жильё',turns:[['Ali imate rezervacijo?','Да, у меня есть бронь.','Da, imam rezervacijo.'],['Kako vam je ime?','Меня зовут Анна.','Ime mi je Ana.']]},
  {name:'Работа',turns:[['Kje delate?','Я работаю дома.','Delam doma.'],['Ali delate danes?','Сегодня я не работаю.','Danes ne delam.']]},
  {name:'Время',turns:[['Koliko je ura?','Сейчас десять часов.','Ura je deset.'],['Kdaj se dobimo?','Завтра утром.','Jutri zjutraj.']]},
  {name:'День и дата',turns:[['Kateri dan je danes?','Сегодня понедельник.','Danes je ponedeljek.'],['Kdaj imate čas?','Завтра.','Jutri.']]},
  {name:'Дорога',turns:[['Oprostite, kaj iščete?','Где вокзал?','Kje je železniška postaja?'],['Naravnost in potem levo.','Спасибо за помощь.','Hvala za pomoč.']]},
  {name:'Семья',turns:[['Ali imate brata?','Да, у меня есть брат.','Da, imam brata.'],['Kje živi?','Он живёт здесь.','Živi tukaj.']]},
  {name:'Здоровье',turns:[['Kako se počutite?','У меня болит голова.','Boli me glava.'],['Potrebujete zdravnika?','Да, мне нужен врач.','Da, potrebujem zdravnika.']]},
  {name:'Обычный разговор',turns:[['Kako si?','Хорошо, спасибо.','Dobro, hvala.'],['Kaj delaš danes?','Сегодня я работаю дома.','Danes delam doma.']]}
];
window.GLAGOLICA_SURVIVAL = [
  ['Добрый день.','Dober dan.'],['Привет.','Živjo.'],['Спасибо.','Hvala.'],['Пожалуйста.','Prosim.'],['Извините.','Oprostite.'],['Я не понимаю.','Ne razumem.'],['Говорите медленнее, пожалуйста.','Govorite počasneje, prosim.'],['Повторите, пожалуйста.','Ponovite, prosim.'],['Сколько это стоит?','Koliko to stane?'],['Где вокзал?','Kje je železniška postaja?'],['Мне нужна вода.','Potrebujem vodo.'],['Я бы хотел кофе.','Rad bi kavo. / Rada bi kavo.'],['Вы говорите по-английски?','Ali govorite angleško?'],['Где туалет?','Kje je stranišče?'],['Мне нужна помощь.','Potrebujem pomoč.'],['Где аптека?','Kje je lekarna?'],['Мне нужен врач.','Potrebujem zdravnika.'],['Мне нужен билет.','Potrebujem vozovnico.'],['Когда отправляется поезд?','Kdaj odpelje vlak?'],['Счёт, пожалуйста.','Račun, prosim.']
];
// First response selects a local follow-up. Existing linear turns remain fallbacks.
window.GLAGOLICA_DIALOGUE_BRANCHES = {
  0:[
    {answer:'Ime mi je Ana.',partner:'Veseli me, Ana. Od kod si?',ru:'Я из России.',next:'Sem iz Rusije.'},
    {answer:'Ime mi je Marko.',partner:'Veseli me, Marko. Od kod si?',ru:'Я из Словении.',next:'Sem iz Slovenije.'}
  ],
  1:[
    {answer:'Rad bi kavo. / Rada bi kavo.',partner:'Tukaj je kava. Še kaj?',ru:'Счёт, пожалуйста.',next:'Račun, prosim.'},
    {answer:'Rad bi čaj. / Rada bi čaj.',partner:'Tukaj je čaj. Še kaj?',ru:'Нет, спасибо.',next:'Ne, hvala.'},
    {answer:'Eno kavo, prosim.',partner:'Tukaj je kava. Še kaj?',ru:'Счёт, пожалуйста.',next:'Račun, prosim.'}
  ],
  2:[
    {answer:'Potrebujem vodo.',partner:'Voda je tukaj. Še kaj?',ru:'Нет, спасибо.',next:'Ne, hvala.'},
    {answer:'Potrebujem kruh.',partner:'Kruh je tukaj. Še kaj?',ru:'Сколько это стоит?',next:'Koliko to stane?'}
  ],
  3:[
    {answer:'V Ljubljano, prosim.',partner:'Enosmerno ali povratno?',ru:'Билет в одну сторону, пожалуйста.',next:'Enosmerno vozovnico, prosim.'},
    {answer:'V Maribor, prosim.',partner:'Enosmerno ali povratno?',ru:'Билет туда и обратно, пожалуйста.',next:'Povratno vozovnico, prosim.'}
  ],
  4:[
    {answer:'Da, čakam avtobus.',partner:'Kam greste?',ru:'В центр.',next:'V središče.'},
    {answer:'Ne, čakam vlak.',partner:'Kam greste?',ru:'В Любляну.',next:'V Ljubljano.'}
  ],
  5:[
    {answer:'Da, imam rezervacijo.',partner:'Kako vam je ime?',ru:'Меня зовут Анна.',next:'Ime mi je Ana.'},
    {answer:'Ne, nimam rezervacije.',partner:'Želite sobo?',ru:'Да, пожалуйста.',next:'Da, prosim.'}
  ],
  6:[
    {answer:'Delam doma.',partner:'Ali delate danes?',ru:'Да, сегодня я работаю.',next:'Da, danes delam.'},
    {answer:'Delam v pisarni.',partner:'Ali delate danes?',ru:'Сегодня я не работаю.',next:'Danes ne delam.'}
  ],
  9:[
    {answer:'Kje je železniška postaja?',partner:'Naravnost in potem levo.',ru:'Спасибо за помощь.',next:'Hvala za pomoč.'},
    {answer:'Kje je lekarna?',partner:'Naravnost in potem desno.',ru:'Спасибо.',next:'Hvala.'}
  ],
  11:[
    {answer:'Boli me glava.',partner:'Potrebujete zdravnika?',ru:'Да, мне нужен врач.',next:'Da, potrebujem zdravnika.'},
    {answer:'Slabo se počutim.',partner:'Potrebujete pomoč?',ru:'Да, мне нужна помощь.',next:'Da, potrebujem pomoč.'}
  ],
  12:[
    {answer:'Dobro, hvala.',partner:'Kaj delaš danes?',ru:'Сегодня я работаю дома.',next:'Danes delam doma.'},
    {answer:'Slabo se počutim.',partner:'Potrebujete pomoč?',ru:'Да, мне нужна помощь.',next:'Da, potrebujem pomoč.'}
  ]
};
window.GLAGOLICA_BRANCH_PROMPTS = {
  0:'Представьтесь как Анна или Марко.',1:'Закажите кофе или чай.',2:'Попросите воду или хлеб.',3:'Попросите билет в Любляну или Марибор.',4:'Скажите, что ждёте автобус или поезд.',5:'Скажите, есть ли у вас бронь.',6:'Скажите, что работаете дома или в офисе.',9:'Спросите, где вокзал или аптека.',11:'Скажите, что болит голова, или что плохо себя чувствуете.',12:'Ответьте, что всё хорошо, или что вы плохо себя чувствуете.'
};

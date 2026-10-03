# English Cards: Quality Pass

Дата: 3 октября 2026 (Europe/Sofia).

Проведена редакторская проверка всех 225 карточек, 675 английских примеров и соответствующих русских переводов. Все существующие ID и порядок карточек сохранены. Словенские данные, общий движок, ключи localStorage и формат SRS не изменены.

## Результат

| Показатель | Количество |
| --- | ---: |
| Карточки / пары EN–RU | 225 / 675 |
| Изменены английские примеры | 155 |
| Изменены русские переводы примеров | 175 |
| Карточки с новой или заменённой фотографией | 44 |
| Убраны неточные фотографии | 11 |
| Карточки с фотографией / уникальные снимки | 95 / 88 |
| Визуальный fallback | 130 |
| Изменены таблицы форм / строки таблиц | 12 / 32 |
| Карточки с Picture → EN | 38 |

Счётчики сравнивают итоговые данные с состоянием HEAD на начало работы. «Строки форм» включают исправленные пояснения к исчисляемости и употреблению, а также добавленные или удалённые строки; это не 32 ошибки в неправильных глаголах.

## Что исправлено

- Right показывает направление, stop — остановку как существительное, earlier — наречие, help как существительное — помощь. Убраны словенские гендерные уточнения из четырёх английских подсказок the two of us/you/them; исходные словенские записи сохранены.
- Устранены неточные переводы времён и бытовых выражений; разнообразили дни недели, числа, семью, покупки, транспорт и прилагательные. Повторяющиеся персонажи Anna/Peter удалены. Исправлены пять дополнительно найденных почти копий предложений.
- Help, time, past, future, soup и pain имеют пояснения к основному неисчисляемому значению. У be late добавлено being late; для who объяснены who/whom. У breakfast/lunch/dinner исправлено употребление артикля. Come отсутствует среди 225 слов, но его неправильные формы добавлены в справочник и проверены отдельной фикстурой без добавления карточки.
- Формы, совпадающие с подсказкой, служебные значения и неизменяемые выражения не превращаются в задания на ввод формы. Исходное написание past read сохраняется в таблице; для изолированной озвучки используются английские омофоны reed (/riːd/) и red (/red/) с меткой времени. Вместо формы больше не произносится посторонняя фраза.
- Слово в контексте доступно у 224 карточек, выбор формы — у 165, артикль/предлог — у 15. Смешанная очередь сначала выбирает слабые просроченные карточки, затем новые; тип задания меняется с учётом предыдущих ответов. Ошибка возвращает карточку один раз через несколько заданий и обновляет прежний SRS.
- Карточки скрываются на время практики. Listening и Picture → EN не содержат перевод, текст ответа, озвучку ответа или раскрывающий alt до проверки. Если фото не загрузилось, появляется RU → EN.
- Фотографии явно привязаны к английским значениям. Все используемые снимки просмотрены в контактных листах; неподходящие найденные кандидаты отброшены. Например, для bus выбран [автобус Pexels](https://www.pexels.com/photo/a-bus-in-a-city-19736818/), для spoon — снимок ложки. Фото для семьи, профессий и действий используются как иллюстрации, но не допускаются в Picture → EN, если ответ неоднозначен.
- Сохранены прежние photo URL variants, lazy loading и отдельный кэш фотографий `glagolica-photos-v1`; версия оболочки изменена на `glagolica-shell-v11`.

Намеренные повторы English lemma сохранены: work/answer/help — разные части речи; doctor — две темы курса; two и the two of us — две исходные строки общего двуязычного курса; together — два тематических употребления. У каждой карточки собственные примеры и прежний ID.

## Проверки и пределы проверки

- `node tests/english-quality.cjs`: 225 ID, неизменность защищённых файлов, все 675 непустых EN/RU пар, точные и нормализованные дубликаты, все 40 глаголов, неправильные plurals, mass nouns, местоимения и степени сравнения.
- `python3 tests/english-content.py`: 227 475 сравнений предложений; нет почти копий по порогам: пересечение слов ≥ 0.7, сходство символов ≥ 0.88. Общие полезные конструкции A1 остаются; тест не доказывает отсутствие любого мыслимого сходства.
- `python3 tests/regression.py`: все 225 английских карточек во всех применимых режимах (1282 задания), 225 слов, 540 кнопок форм, 675 полных примеров, 225 Listening и 1282 кнопки ответа. Также ошибка/повтор внутри сессии, объяснения, недоступное фото, изоляция ключей прогресса, словенская регрессия, прямые ссылки, mobile 360/390/412/768/1280, English Practice на 360, PWA/offline и отсутствие ошибок консоли.
- `python3 tests/english-photos.py`: 88 уникальных оригиналов и оба действующих размера — всего 264 URL, HTTP 200 и image content type.
- `node --check`: все JS/CJS файлы и встроенный скрипт index.html; `git diff --check`.

Редакторская оценка естественности и смысловой точности переводов выполнена при чтении пар; автоматические тесты проверяют перечисленные инварианты, а не доказывают качество языка. TTS проверяется записью payload, языка en-GB и отмены речи в браузере; звучание всех системных голосов акустически не проверялось. Доступность фото подтверждена на дату проверки, фотографии для офлайн сохраняются по мере просмотра.

## Изменённые файлы

`data/english-card-examples.js`, `data/english-card-translations.js`, `data/english-cards.js`, `js/english-cards.js`, `sw.js`, `README.md`, `tests/regression.py`, `tests/english-quality.cjs`, `tests/english-content.py`, `tests/english-browser-quality.js`, `tests/english-photos.py`, `QUALITY_EN.md`.

## Покарточный журнал

Для каждой строки прочитаны три пары EN/RU и проверена таблица форм. Числа EN/RU — количество фактически изменённых примеров/переводов. Фото — ссылка на просмотренный снимок; fallback означает намеренное отсутствие фотографии. Picture включён только после отдельной оценки однозначности изображения.

| ID | Слово | EN изменено | RU изменено | Формы изменены | Визуал | Picture |
| --- | --- | ---: | ---: | --- | --- | --- |
| en-0-0 | I | 0 | 0 | — | fallback | — |
| en-0-1 | you | 0 | 1 | — | fallback | — |
| en-0-2 | he | 0 | 0 | — | fallback | — |
| en-0-3 | she | 0 | 0 | — | fallback | — |
| en-0-4 | name | 1 | 1 | — | fallback | — |
| en-0-5 | hello | 2 | 2 | — | fallback | — |
| en-0-6 | yes | 0 | 0 | — | fallback | — |
| en-0-7 | no | 0 | 1 | — | fallback | — |
| en-0-8 | who | 0 | 0 | да | fallback | — |
| en-0-9 | what | 0 | 0 | — | fallback | — |
| en-0-10 | where | 0 | 0 | — | fallback | — |
| en-0-11 | where from | 1 | 1 | — | fallback | — |
| en-0-12 | how | 0 | 1 | — | fallback | — |
| en-0-13 | be | 0 | 0 | — | fallback | — |
| en-0-14 | speak | 1 | 1 | — | [фото](https://images.pexels.com/photos/10339902/pexels-photo-10339902.jpeg) | — |
| en-1-0 | family | 1 | 1 | — | [фото](https://images.pexels.com/photos/4262174/pexels-photo-4262174.jpeg) | — |
| en-1-1 | mother | 1 | 1 | — | [фото](https://images.pexels.com/photos/3889822/pexels-photo-3889822.jpeg) | — |
| en-1-2 | father | 1 | 1 | — | [фото](https://images.pexels.com/photos/8763195/pexels-photo-8763195.jpeg) | — |
| en-1-3 | brother | 1 | 1 | — | fallback | — |
| en-1-4 | sister | 1 | 1 | — | fallback | — |
| en-1-5 | child | 1 | 1 | — | [фото](https://images.pexels.com/photos/4005590/pexels-photo-4005590.jpeg) | — |
| en-1-6 | friend | 1 | 1 | — | [фото](https://images.pexels.com/photos/5047002/pexels-photo-5047002.jpeg) | — |
| en-1-7 | person | 1 | 1 | — | fallback | — |
| en-1-8 | son | 1 | 1 | — | fallback | — |
| en-1-9 | daughter | 1 | 1 | — | fallback | — |
| en-1-10 | wife | 1 | 1 | — | fallback | — |
| en-1-11 | husband | 1 | 1 | — | fallback | — |
| en-1-12 | parents | 1 | 1 | — | fallback | — |
| en-1-13 | have | 0 | 0 | — | fallback | — |
| en-1-14 | love | 1 | 1 | — | [фото](https://images.pexels.com/photos/3889822/pexels-photo-3889822.jpeg) | — |
| en-2-0 | house | 1 | 1 | — | [фото](https://images.pexels.com/photos/30992623/pexels-photo-30992623.jpeg) | да |
| en-2-1 | room | 0 | 0 | — | [фото](https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg) | — |
| en-2-2 | door | 1 | 1 | — | [фото](https://images.pexels.com/photos/11350641/pexels-photo-11350641.jpeg) | да |
| en-2-3 | window | 1 | 1 | — | [фото](https://images.pexels.com/photos/921294/pexels-photo-921294.png) | да |
| en-2-4 | table | 1 | 1 | — | [фото](https://images.pexels.com/photos/2098913/pexels-photo-2098913.jpeg) | да |
| en-2-5 | bed | 1 | 1 | — | [фото](https://images.pexels.com/photos/3872927/pexels-photo-3872927.jpeg) | — |
| en-2-6 | kitchen | 1 | 1 | — | [фото](https://images.pexels.com/photos/1757313/pexels-photo-1757313.jpeg) | да |
| en-2-7 | flat | 1 | 1 | — | [фото](https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg) | — |
| en-2-8 | live | 1 | 1 | — | fallback | — |
| en-2-9 | sleep | 1 | 1 | — | [фото](https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg) | — |
| en-2-10 | sit | 0 | 0 | — | fallback | — |
| en-2-11 | open | 1 | 1 | — | fallback | — |
| en-2-12 | close | 1 | 2 | — | fallback | — |
| en-2-13 | key | 0 | 0 | — | [фото](https://images.pexels.com/photos/5599449/pexels-photo-5599449.jpeg) | да |
| en-2-14 | bathroom | 0 | 1 | — | [фото](https://images.pexels.com/photos/6782573/pexels-photo-6782573.jpeg) | да |
| en-3-0 | café | 1 | 1 | — | [фото](https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg) | — |
| en-3-1 | coffee | 0 | 0 | — | [фото](https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg) | да |
| en-3-2 | tea | 0 | 0 | — | [фото](https://images.pexels.com/photos/6838523/pexels-photo-6838523.jpeg) | — |
| en-3-3 | water | 0 | 0 | — | [фото](https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg) | да |
| en-3-4 | bill | 1 | 1 | — | fallback | — |
| en-3-5 | menu | 0 | 0 | — | fallback | — |
| en-3-6 | breakfast | 0 | 0 | да | [фото](https://images.pexels.com/photos/16149475/pexels-photo-16149475.jpeg) | — |
| en-3-7 | lunch | 0 | 0 | да | [фото](https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg) | — |
| en-3-8 | drink | 0 | 0 | — | [фото](https://images.pexels.com/photos/1458671/pexels-photo-1458671.jpeg) | — |
| en-3-9 | eat | 0 | 0 | — | fallback | — |
| en-3-10 | want | 0 | 1 | — | fallback | — |
| en-3-11 | order | 0 | 0 | — | [фото](https://images.pexels.com/photos/36799163/pexels-photo-36799163.jpeg) | — |
| en-3-12 | tasty | 1 | 1 | — | fallback | — |
| en-3-13 | glass | 1 | 1 | — | [фото](https://images.pexels.com/photos/12984537/pexels-photo-12984537.jpeg) | да |
| en-3-14 | cup | 0 | 0 | — | [фото](https://images.pexels.com/photos/18334760/pexels-photo-18334760.jpeg) | да |
| en-4-0 | shop | 0 | 0 | — | [фото](https://images.pexels.com/photos/4437148/pexels-photo-4437148.jpeg) | — |
| en-4-1 | price | 1 | 1 | — | fallback | — |
| en-4-2 | money | 0 | 0 | — | [фото](https://images.pexels.com/photos/10356910/pexels-photo-10356910.png) | да |
| en-4-3 | book | 0 | 0 | — | [фото](https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg) | да |
| en-4-4 | bread | 1 | 1 | — | [фото](https://images.pexels.com/photos/8599723/pexels-photo-8599723.jpeg) | да |
| en-4-5 | milk | 0 | 0 | — | [фото](https://images.pexels.com/photos/5946733/pexels-photo-5946733.jpeg) | да |
| en-4-6 | apple | 0 | 0 | — | [фото](https://images.pexels.com/photos/4117425/pexels-photo-4117425.jpeg) | да |
| en-4-7 | expensive | 1 | 1 | — | fallback | — |
| en-4-8 | buy | 0 | 0 | — | [фото](https://images.pexels.com/photos/17160607/pexels-photo-17160607.jpeg) | — |
| en-4-9 | sell | 1 | 1 | — | fallback | — |
| en-4-10 | pay | 0 | 1 | — | fallback | — |
| en-4-11 | cheap | 1 | 1 | — | fallback | — |
| en-4-12 | product | 2 | 3 | — | fallback | — |
| en-4-13 | bag | 1 | 1 | — | [фото](https://images.pexels.com/photos/904350/pexels-photo-904350.jpeg) | да |
| en-4-14 | clothes | 1 | 2 | да | [фото](https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg) | да |
| en-5-0 | today | 1 | 1 | — | fallback | — |
| en-5-1 | tomorrow | 0 | 0 | — | fallback | — |
| en-5-2 | yesterday | 1 | 1 | — | fallback | — |
| en-5-3 | morning | 1 | 1 | — | fallback | — |
| en-5-4 | evening | 1 | 1 | — | fallback | — |
| en-5-5 | Monday | 1 | 1 | — | fallback | — |
| en-5-6 | week | 0 | 0 | — | fallback | — |
| en-5-7 | hour | 1 | 1 | — | fallback | — |
| en-5-8 | when | 0 | 0 | — | fallback | — |
| en-5-9 | time | 0 | 0 | да | fallback | — |
| en-5-10 | minute | 1 | 1 | — | fallback | — |
| en-5-11 | Tuesday | 3 | 3 | — | fallback | — |
| en-5-12 | Wednesday | 2 | 2 | — | fallback | — |
| en-5-13 | Thursday | 2 | 2 | — | fallback | — |
| en-5-14 | Friday | 2 | 2 | — | fallback | — |
| en-6-0 | work | 1 | 1 | — | [фото](https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg) | — |
| en-6-1 | school | 0 | 0 | — | fallback | — |
| en-6-2 | teacher | 1 | 1 | — | [фото](https://images.pexels.com/photos/6502822/pexels-photo-6502822.jpeg) | — |
| en-6-3 | doctor | 0 | 0 | — | [фото](https://images.pexels.com/photos/20100299/pexels-photo-20100299.jpeg) | — |
| en-6-4 | office | 1 | 1 | — | [фото](https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg) | — |
| en-6-5 | colleague | 1 | 1 | — | [фото](https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg) | — |
| en-6-6 | busy | 0 | 0 | — | fallback | — |
| en-6-7 | at home | 0 | 0 | — | fallback | — |
| en-6-8 | work | 1 | 1 | — | [фото](https://images.pexels.com/photos/32357250/pexels-photo-32357250.jpeg) | — |
| en-6-9 | study | 0 | 0 | — | [фото](https://images.pexels.com/photos/8617988/pexels-photo-8617988.jpeg) | — |
| en-6-10 | write | 1 | 1 | — | fallback | — |
| en-6-11 | read | 0 | 0 | — | [фото](https://images.pexels.com/photos/346735/pexels-photo-346735.jpeg) | — |
| en-6-12 | start | 0 | 0 | — | fallback | — |
| en-6-13 | finish | 0 | 0 | — | [фото](https://images.pexels.com/photos/10313865/pexels-photo-10313865.jpeg) | — |
| en-6-14 | task | 1 | 1 | — | fallback | — |
| en-7-0 | city | 0 | 0 | — | [фото](https://images.pexels.com/photos/16922421/pexels-photo-16922421.jpeg) | — |
| en-7-1 | street | 0 | 0 | — | [фото](https://images.pexels.com/photos/10121600/pexels-photo-10121600.jpeg) | — |
| en-7-2 | centre | 0 | 0 | — | fallback | — |
| en-7-3 | left | 1 | 1 | — | fallback | — |
| en-7-4 | right | 1 | 1 | — | fallback | — |
| en-7-5 | straight ahead | 1 | 1 | — | fallback | — |
| en-7-6 | nearby | 1 | 1 | — | fallback | — |
| en-7-7 | far | 0 | 0 | — | fallback | — |
| en-7-8 | go | 0 | 0 | — | [фото](https://images.pexels.com/photos/11798079/pexels-photo-11798079.jpeg) | — |
| en-7-9 | turn | 1 | 1 | — | fallback | — |
| en-7-10 | park | 1 | 1 | — | [фото](https://images.pexels.com/photos/10135374/pexels-photo-10135374.jpeg) | да |
| en-7-11 | square | 1 | 1 | — | fallback | — |
| en-7-12 | bridge | 1 | 1 | — | [фото](https://images.pexels.com/photos/7562170/pexels-photo-7562170.jpeg) | да |
| en-7-13 | traffic light | 1 | 2 | — | [фото](https://images.pexels.com/photos/35818849/pexels-photo-35818849.jpeg) | да |
| en-7-14 | map | 1 | 1 | — | [фото](https://images.pexels.com/photos/592753/pexels-photo-592753.jpeg) | да |
| en-8-0 | train | 0 | 0 | — | [фото](https://images.pexels.com/photos/33968153/pexels-photo-33968153.jpeg) | да |
| en-8-1 | bus | 0 | 0 | — | [фото](https://images.pexels.com/photos/19736818/pexels-photo-19736818.jpeg) | да |
| en-8-2 | ticket | 0 | 0 | — | fallback | — |
| en-8-3 | train station | 0 | 0 | — | [фото](https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg) | — |
| en-8-4 | stop | 1 | 1 | — | fallback | — |
| en-8-5 | road | 1 | 1 | — | [фото](https://images.pexels.com/photos/30729231/pexels-photo-30729231.jpeg) | да |
| en-8-6 | car | 0 | 1 | — | [фото](https://images.pexels.com/photos/10971731/pexels-photo-10971731.jpeg) | да |
| en-8-7 | airport | 0 | 0 | — | [фото](https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg) | — |
| en-8-8 | ride | 1 | 1 | — | fallback | — |
| en-8-9 | arrive | 0 | 0 | — | [фото](https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg) | — |
| en-8-10 | leave | 1 | 2 | — | [фото](https://images.pexels.com/photos/7446973/pexels-photo-7446973.jpeg) | — |
| en-8-11 | be late | 1 | 1 | да | [фото](https://images.pexels.com/photos/3888018/pexels-photo-3888018.jpeg) | — |
| en-8-12 | passenger | 1 | 1 | — | fallback | — |
| en-8-13 | platform | 0 | 0 | — | [фото](https://images.pexels.com/photos/9993828/pexels-photo-9993828.jpeg) | — |
| en-8-14 | timetable | 2 | 2 | — | fallback | — |
| en-9-0 | two | 1 | 1 | — | fallback | — |
| en-9-1 | two | 1 | 1 | — | fallback | — |
| en-9-2 | the two of us | 1 | 2 | — | fallback | — |
| en-9-3 | the two of us | 1 | 1 | — | fallback | — |
| en-9-4 | the two of you | 0 | 0 | — | fallback | — |
| en-9-5 | the two of them | 1 | 1 | — | fallback | — |
| en-9-6 | together | 1 | 1 | — | fallback | — |
| en-9-7 | both | 1 | 1 | — | fallback | — |
| en-9-8 | one | 2 | 2 | — | fallback | — |
| en-9-9 | three | 1 | 1 | — | fallback | — |
| en-9-10 | four | 1 | 1 | — | fallback | — |
| en-9-11 | five | 1 | 1 | — | fallback | — |
| en-9-12 | six | 1 | 1 | — | fallback | — |
| en-9-13 | seven | 1 | 1 | — | fallback | — |
| en-9-14 | eight | 1 | 1 | — | fallback | — |
| en-10-0 | food | 1 | 1 | — | [фото](https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg) | да |
| en-10-1 | soup | 1 | 1 | да | [фото](https://images.pexels.com/photos/34640219/pexels-photo-34640219.jpeg) | — |
| en-10-2 | meat | 0 | 0 | — | [фото](https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg) | — |
| en-10-3 | fish | 1 | 1 | — | [фото](https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg) | — |
| en-10-4 | cheese | 1 | 1 | — | [фото](https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg) | да |
| en-10-5 | salt | 1 | 1 | — | [фото](https://images.pexels.com/photos/6690894/pexels-photo-6690894.jpeg) | — |
| en-10-6 | sugar | 0 | 1 | — | [фото](https://images.pexels.com/photos/2523650/pexels-photo-2523650.jpeg) | да |
| en-10-7 | dinner | 1 | 1 | да | [фото](https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg) | — |
| en-10-8 | cook | 0 | 0 | — | [фото](https://images.pexels.com/photos/8629103/pexels-photo-8629103.jpeg) | — |
| en-10-9 | cut | 1 | 2 | — | [фото](https://images.pexels.com/photos/11646501/pexels-photo-11646501.jpeg) | — |
| en-10-10 | plate | 1 | 1 | — | [фото](https://images.pexels.com/photos/18677610/pexels-photo-18677610.jpeg) | да |
| en-10-11 | spoon | 1 | 1 | — | [фото](https://images.pexels.com/photos/12021477/pexels-photo-12021477.jpeg) | да |
| en-10-12 | fork | 1 | 1 | — | [фото](https://images.pexels.com/photos/106346/pexels-photo-106346.jpeg) | да |
| en-10-13 | vegetables | 1 | 1 | — | [фото](https://images.pexels.com/photos/5425893/pexels-photo-5425893.jpeg) | да |
| en-10-14 | fruit | 0 | 0 | — | [фото](https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg) | да |
| en-11-0 | health | 1 | 1 | — | fallback | — |
| en-11-1 | head | 1 | 2 | — | [фото](https://images.pexels.com/photos/7105550/pexels-photo-7105550.jpeg) | — |
| en-11-2 | hand | 1 | 1 | — | [фото](https://images.pexels.com/photos/15516830/pexels-photo-15516830.jpeg) | — |
| en-11-3 | leg | 1 | 1 | — | fallback | — |
| en-11-4 | doctor | 1 | 1 | — | [фото](https://images.pexels.com/photos/20100299/pexels-photo-20100299.jpeg) | — |
| en-11-5 | pharmacy | 0 | 0 | — | [фото](https://images.pexels.com/photos/13119976/pexels-photo-13119976.jpeg) | — |
| en-11-6 | hospital | 1 | 1 | — | [фото](https://images.pexels.com/photos/668300/pexels-photo-668300.jpeg) | — |
| en-11-7 | medicine | 1 | 2 | — | [фото](https://images.pexels.com/photos/3683102/pexels-photo-3683102.jpeg) | да |
| en-11-8 | hurt | 1 | 1 | — | fallback | — |
| en-11-9 | fever | 1 | 1 | — | fallback | — |
| en-11-10 | tired | 1 | 1 | — | [фото](https://images.pexels.com/photos/8961615/pexels-photo-8961615.jpeg) | — |
| en-11-11 | pain | 0 | 1 | да | fallback | — |
| en-11-12 | eye | 1 | 1 | — | [фото](https://images.pexels.com/photos/4823600/pexels-photo-4823600.jpeg) | да |
| en-11-13 | ear | 1 | 1 | — | [фото](https://images.pexels.com/photos/7480268/pexels-photo-7480268.jpeg) | да |
| en-11-14 | mouth | 1 | 1 | — | [фото](https://images.pexels.com/photos/13586575/pexels-photo-13586575.jpeg) | да |
| en-12-0 | earlier | 1 | 1 | — | fallback | — |
| en-12-1 | later | 0 | 0 | — | fallback | — |
| en-12-2 | soon | 1 | 1 | — | fallback | — |
| en-12-3 | always | 1 | 1 | — | fallback | — |
| en-12-4 | sometimes | 1 | 1 | — | fallback | — |
| en-12-5 | never | 1 | 1 | — | fallback | — |
| en-12-6 | day | 0 | 0 | — | fallback | — |
| en-12-7 | night | 1 | 1 | — | fallback | — |
| en-12-8 | previous | 1 | 2 | — | fallback | — |
| en-12-9 | next | 0 | 0 | — | fallback | — |
| en-12-10 | month | 1 | 1 | — | fallback | — |
| en-12-11 | year | 1 | 1 | — | fallback | — |
| en-12-12 | weekend | 1 | 1 | — | [фото](https://images.pexels.com/photos/1229753/pexels-photo-1229753.jpeg) | — |
| en-12-13 | past | 1 | 1 | да | fallback | — |
| en-12-14 | future | 0 | 0 | да | fallback | — |
| en-13-0 | please | 0 | 1 | — | fallback | — |
| en-13-1 | thank you | 0 | 0 | — | fallback | — |
| en-13-2 | excuse me | 0 | 0 | — | fallback | — |
| en-13-3 | question | 0 | 0 | — | [фото](https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg) | — |
| en-13-4 | answer | 1 | 1 | — | fallback | — |
| en-13-5 | slowly | 1 | 1 | — | fallback | — |
| en-13-6 | well | 1 | 1 | — | fallback | — |
| en-13-7 | help | 1 | 1 | да | [фото](https://images.pexels.com/photos/10638724/pexels-photo-10638724.jpeg) | — |
| en-13-8 | understand | 0 | 0 | — | fallback | — |
| en-13-9 | repeat | 1 | 1 | — | fallback | — |
| en-13-10 | ask | 0 | 0 | — | [фото](https://images.pexels.com/photos/32094079/pexels-photo-32094079.jpeg) | — |
| en-13-11 | answer | 0 | 0 | — | fallback | — |
| en-13-12 | help | 0 | 0 | — | [фото](https://images.pexels.com/photos/10638724/pexels-photo-10638724.jpeg) | — |
| en-13-13 | show | 0 | 0 | — | fallback | — |
| en-13-14 | know | 1 | 1 | — | fallback | — |
| en-14-0 | big | 3 | 3 | — | fallback | — |
| en-14-1 | small | 1 | 1 | — | fallback | — |
| en-14-2 | good | 0 | 0 | — | fallback | — |
| en-14-3 | bad | 0 | 0 | — | fallback | — |
| en-14-4 | new | 1 | 1 | — | fallback | — |
| en-14-5 | old | 3 | 3 | — | fallback | — |
| en-14-6 | here | 1 | 1 | — | fallback | — |
| en-14-7 | there | 1 | 1 | — | fallback | — |
| en-14-8 | hear | 0 | 0 | — | [фото](https://images.pexels.com/photos/29527897/pexels-photo-29527897.jpeg) | — |
| en-14-9 | see | 0 | 0 | — | [фото](https://images.pexels.com/photos/1720080/pexels-photo-1720080.jpeg) | — |
| en-14-10 | need | 0 | 0 | — | fallback | — |
| en-14-11 | possible | 2 | 2 | — | fallback | — |
| en-14-12 | important | 2 | 2 | — | fallback | — |
| en-14-13 | correct | 0 | 0 | — | fallback | — |
| en-14-14 | together | 1 | 1 | — | fallback | — |

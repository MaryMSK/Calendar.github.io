(function(selector) { //это селектор того элемента, в котором мы работаем

    /* Получение календаря по его селектору 
    let calendar = document.querySelector(selector); */

    initCalendar(document.querySelector(selector)); //здесь убрали переменную calendar,чтобы ее никто не мог использовать

    //Эта функция сначала инициализирует календарь
    function initCalendar(calendar) {

        //Эти функции отображают текущую дату, год и месяц
        let date = new Date(); //1ое: сначала мы показываем календарь за текущую дату
        let showedYear = date.getFullYear();
        let showedMonth = date.getMonth();

        //Вместо глобальных переменных создали объект current
        let current = {
            year: showedYear,
            month: showedMonth,
            date: date.getDate()
        };


        let dates = calendar.querySelector('.dates'); //Получение дат внутри календаря
        let info = calendar.querySelector('.info'); //Получение года и месяца

        //Эта функция отвечает за отрисовку календаря
        drawCalendar(showedYear, showedMonth, current, calendar); //2ое: мы командуем отрисовать календарь

        //Получение кнопок для перелистывания календарного месяца
        let prev = calendar.querySelector('.prev');
        let next = calendar.querySelector('.next');

        //Добавляем к prev обработчик события с функциями
        prev.addEventListener('click', function() { //3е: затем навешиваем события на кнопки
            showedYear = getPrevYear(showedYear, showedMonth);
            showedMonth = getPrevMonth(showedMonth);

            drawCalendar(showedYear, showedMonth, current, calendar);
        });

        //Добавляем к next обработчик события с функциями
        next.addEventListener('click', function() {
            showedYear = getNextYear(showedYear, showedMonth);
            showedMonth = getNextMonth(showedMonth);

            drawCalendar(showedYear, showedMonth, current, calendar);
        });

        //Функция каждый раз отрисовывает календарь
        function drawCalendar(showedYear, showedMonth, current, calendar) {
            drawDates(showedYear, showedMonth, dates); //Функция отрисовывает календарь
            showInfo(showedYear, showedMonth, info); //Функция изменяет год и месяц
            showCurrentDate(showedYear, showedMonth, current, dates);
        }
    }

    //Функция показывает текущий день
    function showCurrentDate(showedYear, showedMonth, current, dates) {
        if (
            showedYear == current['year'] &&
            showedMonth == current['month']
        ) {
            let tds = dates.querySelectorAll('td');

            for (let i = 0; i < tds.length; i++) {
                if (tds[i].innerHTML == current['date']) {
                    tds[i].classList.add('active');
                    break;
                }
            }
        }
    }

    //Функция перелистывает год назад
    function getPrevYear(year, month) {
        if (month == 0) {
            return year - 1;
        } else {
            return year;
        }
    }

    //Функция перелистывает месяц назад
    function getPrevMonth(month) {
        if (month == 0) {
            return 11;
        } else {
            return month - 1;
        }
    }

    //Функция перелистывает год вперед
    function getNextYear(year, month) {
        if (month == 11) {
            return year + 1;
        } else {
            return year;
        }
    }

    //Функция перелистывает месяц вперед
    function getNextMonth(month) {
        if (month == 11) {
            return 0;
        } else {
            return month + 1;
        }
    }

    //Функция показывает инф. об изменяющемся годе и месяце в календаре
    function showInfo(year, month, elem) {
        elem.innerHTML = getMonthName(month) + ' ' + year;
    }

    /* Функция параметром принимает номер месяца(от 0 до 11), 
    а возвращает название соответствующее этому месяцу. */
    function getMonthName(num) {
        let months = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[num];
    }

    /* Функция drawDates должна внутри элемента dates отрисовать табличку с датами.
    1ый параметр: год, 2ой: месяц, 3ий: даты - изменяющаяся часть таблицы. */
    function drawDates(year, month, dates) {
        let arr = []; // создали пустой массив
        let firstDateOfMonth = 1;
        let lastDateOfMonth = getLastDayOfMonth(year, month);

        /* Функция параметром принимает год и месяц, и должна вернуть
        какое кол-во пустых элементов нужно добавить в начало календаря. */
        let unshiftElemsNum = getUnshiftElemsNum(year, month);

        /* Функция параметром принимает год и месяц, и должна вернуть
            какое кол-во пустых элементов нужно добавить в конец календаря. */
        let pushElemsNum = getPushElemsNum(year, month);

        //Заполняем пустой массив числами месяца
        arr = createArr(firstDateOfMonth, lastDateOfMonth);

        //Доб. в начало массива пустые элементы
        arr = unshiftElems(unshiftElemsNum, '', arr);

        // Доб. в конец массива пустые элементы
        arr = pushElems(pushElemsNum, '', arr);

        //Эта функция разбивает массив по 7 элементов.
        arr = chunkArr(7, arr);

        /*  Эта функция берет наш многомерный массив с числами и создает 
        строки(<tr></tr>)и ячейки(<td></td>) в таблице, затем кладет их в элемент dates. */
        createTable(arr, dates);
    }

    /* 1ый параметр функции: многомерный массив чисел, которые нужно отрисовывать.
    2ой: родительский элемент parent, который принимает функция, в котором
    он будет строить табличку. */
    function createTable(arr, parent) { //parent это то место, где рисуется таблица(даты)
        parent.innerHTML = ' '; //перед тем как рисовать таблицу нужно очистить parent

        for (let i = 0; i < arr.length; i++) { //цикл идет по многомерному массиву
            let tr = document.createElement('tr');

            for (let j = 0; j < arr[i].length; j++) { //цикл идет по подмассивам
                let td = document.createElement('td'); //td кладем в элементы перебираемого массива
                td.innerHTML = arr[i][j]; //обращение к элементам двухмерного массива
                tr.appendChild(td); // каждый td мы кладем в tr
            }
            parent.appendChild(tr); //в самом конце первого цикла нужно tr доб. в конец parent
        }
    }

    /* Функция параметром будет принимать числа и возвращать 
    массив с этими числами. */
    function createArr(from, to) {
        let arr = [];
        for (let i = from; i <= to; i++) {
            arr.push(i);
        }
        return arr;
    }

    /* Функция принимает параметры: 1ый:сколько элементов мы кладем в начало 
    массива, 2ой: какие элементы, 3ий: в какой массив. */
    function unshiftElems(num, elem, arr) {
        for (let i = 0; i < num; i++) {
            arr.unshift(elem)
        }
        return arr;
    }

    //Аналогичная функция, которая доб. элементы уже в конец массива.
    function pushElems(num, elem, arr) {
        for (let i = 0; i < num; i++) {
            arr.push(elem)
        }
        return arr;
    }

    //Получение последнего дня месяца
    function getLastDayOfMonth(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDate();
    }

    //Получение последнего дня месяца.
    /* function getLastDayOfMonth(year, month) {
        if (month == 1) {
            if (isLeap(year)) {
                return 29;
            } else {
                return 28;
            }
        } else {
            let days = [31, undefined, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            return days[month];
        }
    }


    //Високосный год или нет
    function isLeap(year) {
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            return true;
        } else {
            return false;
        }
    }
    */

    //Добавление пустых элем. в начало календаря.
    function getUnshiftElemsNum(year, month) {
        let jsDayNum = getFirstWeekDayOfMonthNum(year, month);
        let realDayNum = getRealDayOfWeekNum(jsDayNum);
        return realDayNum - 1;
    }

    //Добавление пустых элем. в конец календаря.
    function getPushElemsNum(year, month) {
        let jsDayNum = getLastWeekDayOfMonthNum(year, month);
        let realDayNum = getRealDayOfWeekNum(jsDayNum);
        return 7 - realDayNum;
    }

    /* Функция разбивает многомерный массив чисел в календаре на подмассивы(5), 
    в каждом из которых лежит по 7 элементов. */
    function chunkArr(num, arr) {
        let result = [];
        let chunk = [];
        let iterCount = arr.length / num;

        for (let i = 0; i < iterCount; i++) {
            chunk = arr.splice(0, num);
            result.push(chunk);
        }
        return result;
    }

    //Получение реального дня недели
    function getRealDayOfWeekNum(jsNumOfDay) {
        if (jsNumOfDay == 0) {
            return 7;
        } else {
            return jsNumOfDay;
        }
    }

    /* Эта функция нужна для того,чтобы найти 
    первый день недели в начале месяца. */
    function getFirstWeekDayOfMonthNum(year, month) {
        let date = new Date(year, month, 1);
        return date.getDay();
    }


    /* Эта функция нужна для того, чтобы найти последний
     день недели в конце месяца. */
    function getLastWeekDayOfMonthNum(year, month) {
        let date = new Date(year, month + 1, 0);
        return date.getDay();
    }
}('#calendar'));
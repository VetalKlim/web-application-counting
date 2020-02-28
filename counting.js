window.onload = function() {

    let arrStatus = { // статус открытых уровней
        level_1: true,
        level_2: false,
        level_3: false,
        level_4: false,
        level_5: false,
        level_6: false,
        level_7: false,
        level_8: false,
        level_9: false,
        level_10: false,
        level_11: false,
        level_12: false,
        level_13: false,
        level_14: false,
        level_15: false
    }
    let levelSuccess = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]; // переменная успешных поеденных уровней
    let minutes = 15; // интервал времени в минутах.
    let milliseconds = minutes * 60000; // переводим минуты в миллисекунды.
    let timeoutID; // переменная setTimeout  функции interval() - хранит активность;
    var timeInterval; // переменная  setTimeout функции timer1() - хранит активность;



    // ________________________конструктор для модальных окон ___________________
    function Modal(obj) {
        this.modal = document.querySelector(obj.modal);
        this.overlay = document.querySelector(obj.overlay);
        this.visible = obj.visible;
        let context = this;
        this.open = function(content) { // метод для открытия модального окна 
            context.modal.innerHTML = content;
            context.overlay.classList.add(context.visible);
            context.modal.classList.add(context.visible);
        }
        this.close = function() { // метод для закрытия модального окна 
            context.overlay.classList.remove(context.visible);
            context.modal.classList.remove(context.visible);
        }
        context.overlay.onclick = context.close; // закрытие по overlay
    }

    let modal = new Modal({
        modal: '.modal-block', // все модальные окна по классу
        overlay: '.overlay', // обертка для модального окна
        visible: 'active' // класс для переключения видимости модальных окон
    });



    // ____функция которая изначально раскрашивает блоки в цвета на активные и не активные________
    function beginningOfTheGame() {
        let level = document.querySelectorAll('.modal');
        for (let i = 0; i < level.length; i++) {
            if (level.length) {
                level[0].classList.remove('level-close');
            }
            level[i].classList.add('level-close');
        }
    }
    beginningOfTheGame();


    // ________________метод который запускает интервал по времени на похождение игры 
    function interval(time) {
        timer1();
        timeoutID = setTimeout(function() {
            let modalError = document.getElementById('modal-Error');
            modal.open(modalError.innerHTML);
            document.querySelector('.overlay').style.pointerEvents = 'none';
            document.getElementById('startOver').style.pointerEvents = 'none';
            let blockModalNoActive = document.querySelectorAll('.block-modal');
            for (let i = 0; i < blockModalNoActive.length; i++) {
                blockModalNoActive[i].style.pointerEvents = 'none';
            };
            let closeExitGame = document.getElementById('start-over');
            closeExitGame.addEventListener('click', function() {
                modal.close();
                statusCleansing();
                dataCleansing();
                clearTimeout(timeInterval);
                interval(milliseconds);
                document.getElementById("countdown").className = "visible";
                document.getElementById("deadline-message").className = "hidden";
                let blockModalActive = document.querySelectorAll('.block-modal');
                for (let i = 0; i < blockModalActive.length; i++) {
                    blockModalActive[i].style.pointerEvents = 'auto';
                };
                document.getElementById('startOver').style.pointerEvents = 'auto';
            });
        }, time);
    }
    interval(milliseconds);


    //________________________ функция таймер___________
    function timer1() {
        function getTimeRemaining(endtime) {
            let t = Date.parse(endtime) - Date.parse(new Date());
            let seconds = Math.floor((t / 1000) % 60);
            let minutes = Math.floor((t / 1000 / 60) % 60);
            return {
                total: t,
                minutes: minutes,
                seconds: seconds
            };
        }

        function initializeClock(id, endtime) {
            let clock = document.getElementById(id);
            let minutesSpan = clock.querySelector(".minutes");
            let secondsSpan = clock.querySelector(".seconds");

            function updateClock() {
                let t = getTimeRemaining(endtime);
                if (t.total <= 0) {
                    document.getElementById("countdown").className = "hidden";
                    document.getElementById("deadline-message").className = "visible";
                    return true;
                };
                minutesSpan.innerHTML = ("0" + t.minutes).slice(-2);
                secondsSpan.innerHTML = ("0" + t.seconds).slice(-2);
            }
            updateClock();
            timeInterval = setInterval(updateClock, 1000);
        }
        let deadline = new Date(Date.parse(new Date()) + minutes * 60 * 1000); // for endless timer
        initializeClock("countdown", deadline);
    }


    function statusCleansing() { // функция которая изменяет объект arrStatus в начальное положение
        for (let key in arrStatus) {
            arrStatus[key] = false;
            arrStatus.level_1 = true;
        }
        console.log(arrStatus);
        let modal = document.querySelectorAll('.modal');
        for (let i = 0; i < modal.length; i++) {
            modal[i].classList.remove('level-passed');
            modal[i].classList.add('level-close');
            modal[i].classList.remove('modal-h');
        }
        modal[0].classList.remove('level-close');
        let text = document.querySelectorAll('.text');
        for (let i = 0; i < text.length; i++) {
            text[i].innerHTML = '';
        }
    }

    function dataCleansing() { // метод который изменяет данные массива  levelSuccess в начальное положение
        levelSuccess = levelSuccess.fill(false);
        console.log(levelSuccess);
    };


    function successCheck() { // поверка все ли уровни пройдены   true или  false
        return result = levelSuccess.every(function(el) {
            return el === true;
        });
    }

    function actionAfterSuccessCheck() { // функция которая проверяет работает с результатом метода successCheck() на истину или ложь :
        if (successCheck()) { //true
            let content = document.getElementById('modal-Success');
            modal.open(content.innerHTML);
            console.log(levelSuccess);
            let closeExitGame = document.getElementById('start-over');
            closeExitGame.addEventListener('click', function() {
                modal.close();
                statusCleansing();
                dataCleansing();
                clearTimeout(timeoutID);
                timer1();
            }, false);
        } else { // false
            let content = document.getElementById('modal-Error');
            modal.open(content.innerHTML);
        }
    }

    function startOver() { // функция которая перезапускает игру по новой.
        let btnStart = document.getElementById('startOver');
        btnStart.addEventListener('click', function() {
            let continueTheGame = document.getElementById('continueTheGame');
            modal.open(continueTheGame.innerHTML);
            let nextGame = document.getElementById('next-game'); // выходим и дальше играем.
            nextGame.onclick = function() {
                modal.close();
            }
            let exitGame = document.getElementById('start-over'); // перезапускает игру по новой.
            exitGame.onclick = function() {
                modal.close();
                statusCleansing();
                dataCleansing();
                clearTimeout(timeoutID);
                clearTimeout(timeInterval);
                interval(milliseconds);
                document.getElementById("countdown").className = "visible";
                document.getElementById("deadline-message").className = "hidden";
            }
        });
    }
    startOver();


    // __________________функция случайность 
    function mtRandom(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }


    //____________________ функция которая проверяет результат на правильность_____________________
    function checkCalculation(compRes, myResult, add, close) {
        let result = compRes;
        let myRes = +document.getElementById(myResult).value;
        let next;
        if (result === myRes) {
            if (close) {
                document.getElementById(close).classList.remove('level-close');
                document.getElementById(close).classList.remove('modal-h');
            }
            document.getElementById(add).classList.add('level-passed');
            let success = document.getElementById('result');
            success.style.color = 'green';
            success.style.fontSize = '20px';
            next = true;
        } else {
            let err = document.getElementById('result');
            err.innerHTML = 'Ответ не верный, попробуй еще раз!';
            err.style.color = 'red';
            err.style.fontSize = '20px';
            next = false;
        }
        console.log(next);
        return next;
    }



    // __________________________1-й уровень_________________________________
    function levelGame1() {
        let num1;
        let num2;
        checkRes;
        document.getElementById('modal-1').onclick = function() {
            document.querySelector('.overlay').style.pointerEvents = 'auto';
            let next = arrStatus.level_1;
            if (next) {
                document.getElementById('modal-1').classList.add('modal-h');
                let cont = document.getElementById('modal-1_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level-num1').innerHTML = mtRandom(1, 100);
                num2 = document.getElementById('level-num2').innerHTML = mtRandom(1, 100);
                console.log(resultCalculation1());
                let btn = document.getElementById('ok-level-1');
                btn.onclick = checkRes;
            }
        }

        function resultCalculation1() {
            let result = +num1 + +num2;
            return result;
        };

        function checkRes() {
            let resultComp = resultCalculation1();
            let result = checkCalculation(resultComp, 'level-res1', 'modal-1', 'modal-2');
            if (result) {
                modal.close();
                document.getElementById('text-1').innerHTML = 'уровень пройден';
                document.getElementById("text-2").innerHTML = 'уровень открыт!';
                document.getElementById('modal-1').classList.remove('modal-h');
                arrStatus.level_2 = true;
                arrStatus.level_1 = false;
                levelSuccess[0] = true;
            } else {
                arrStatus.level_2 = false;
                levelSuccess[0] = false;
            }
        }
    }
    levelGame1();

    // __________________________2-й уровень_________________________________
    function levelGame2() {
        let num1, num2, num3;
        document.getElementById('modal-2').onclick = function() {
            let next = arrStatus.level_2; // передаем результат функции level_1() - false либо true.
            if (next) {
                cont = document.getElementById('modal-2_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_2-num1').innerHTML = mtRandom(3, 20);
                num2 = document.getElementById('level_2-num2').innerHTML = mtRandom(4, 31);
                num3 = document.getElementById('level_2-num3').innerHTML = mtRandom(3, 30);
                console.log(resultCalculation2());
                document.getElementById('modal-2').classList.add('modal-h');
                let btn = document.getElementById('ok-level-2');
                btn.onclick = checkRes2;
            }
        }

        function resultCalculation2() {
            let res = +num1 + +num2 + +num3;
            return res;
        }

        function checkRes2() {
            let resultComp = resultCalculation2();
            let result = checkCalculation(resultComp, 'level-res2', 'modal-2', 'modal-3');
            if (result) {
                modal.close();
                document.getElementById("text-2").innerHTML = 'уровень пройден';
                document.getElementById("text-3").innerHTML = 'уровень открыт!';
                document.getElementById('modal-2').classList.remove('modal-h');
                arrStatus.level_3 = true;
                arrStatus.level_2 = false;
                levelSuccess[1] = true;
            } else {
                arrStatus.level_3 = false;
                levelSuccess[1] = false;
            }
        }
    }
    levelGame2();

    // __________________________3-й уровень_________________________________
    function levelGame3() {
        let num1, num2, num3;
        document.getElementById('modal-3').onclick = function() {
            let next = arrStatus.level_3;
            if (next) {
                let cont = document.getElementById('modal-3_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_3-num1').innerHTML = mtRandom(2, 60);
                num2 = document.getElementById('level_3-num2').innerHTML = mtRandom(3, 60);
                num3 = document.getElementById('level_3-num3').innerHTML = mtRandom(0, 20);
                console.log(resultCalculation3());
                document.getElementById('modal-3').classList.add('modal-h');
                let btn = document.getElementById('ok-level-3');
                btn.onclick = checkRes3;
            }
        }

        function resultCalculation3() {
            let res = +num1 + +num2 - +num3;;
            return res;
        }

        function checkRes3() {
            let resultComp = resultCalculation3();
            let result = checkCalculation(resultComp, 'level-res3', 'modal-3', 'modal-4');
            if (result) {
                modal.close();
                document.getElementById('text-3').innerHTML = 'уровень пройден';
                document.getElementById('text-4').innerHTML = 'уровень открыт!';
                document.getElementById('modal-3').classList.remove('modal-h');
                arrStatus.level_4 = true;
                arrStatus.level_3 = false;
                levelSuccess[2] = true;
            } else {
                arrStatus.level_4 = false;
                levelSuccess.success_15 = false;
                levelSuccess[2] = false;
            }
        }
    }
    levelGame3();

    // __________________________4 уровень_________________________________
    function levelGame4() {
        let num1, num2, num3, num4;
        document.getElementById('modal-4').onclick = function() {
            let next = arrStatus.level_4;
            if (next) {
                let cont = document.getElementById('modal-4_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_4-num1').innerHTML = mtRandom(50, 100);
                num2 = document.getElementById('level_4-num2').innerHTML = mtRandom(50, 100);
                num3 = document.getElementById('level_4-num3').innerHTML = mtRandom(30, 50);
                num4 = document.getElementById('level_4-num4').innerHTML = mtRandom(30, 50);
                console.log(resultCalculation4());
                document.getElementById('modal-4').classList.add('modal-h');
                let btn = document.getElementById('ok-level-4');
                btn.onclick = checkRes4;
            }

            function resultCalculation4() {
                let res = (+num1 + +num2) - (+num3 + +num4);
                return res;
            }

            function checkRes4() {
                let resultComp = resultCalculation4();
                let result = checkCalculation(resultComp, 'level-res4', 'modal-4', 'modal-5');
                if (result) {
                    modal.close();
                    document.getElementById('text-4').innerHTML = 'уровень пройден';
                    document.getElementById('text-5').innerHTML = 'уровень открыт!';
                    document.getElementById('modal-4').classList.remove('modal-h');
                    arrStatus.level_5 = true;
                    arrStatus.level_4 = false;
                    levelSuccess[3] = true;
                } else {
                    arrStatus.level_5 = false;
                    levelSuccess[3] = false;
                }
            }
        }
    }
    levelGame4();

    // __________________________5 уровень_________________________________
    function levelGame5() {
        let num1, num2, num3, num4;
        document.getElementById('modal-5').onclick = function() {
            let next = arrStatus.level_5;
            if (next) {
                let cont = document.getElementById('modal-5_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_5-num1').innerHTML = mtRandom(30, 50);
                num2 = document.getElementById('level_5-num2').innerHTML = mtRandom(5, 30);
                num3 = document.getElementById('level_5-num3').innerHTML = mtRandom(40, 100);
                num4 = document.getElementById('level_5-num4').innerHTML = mtRandom(2, 40);
                console.log(resultCalculation5());
                document.getElementById('modal-5').classList.add('modal-h');
                let btn = document.getElementById('ok-level-5');
                btn.onclick = checkRes5;
            }
        }

        function resultCalculation5() {

            let res = (+num1 - +num2) + (+num3 - +num4);
            return res;
        }

        function checkRes5() {
            let resultComp = resultCalculation5();
            let result = checkCalculation(resultComp, 'level-res5', 'modal-5', 'modal-6');
            if (result) {
                modal.close();
                document.getElementById('text-5').innerHTML = 'уровень пройден';
                document.getElementById('text-6').innerHTML = 'уровень открыт!';
                document.getElementById('modal-5').classList.remove('modal-h');
                arrStatus.level_6 = true;
                arrStatus.level_5 = false;
                levelSuccess[4] = true;
            } else {
                arrStatus.level_6 = false;
                levelSuccess[4] = false;
            }
        }
    }
    levelGame5();

    //  __________________________6 уровень_________________________________
    function levelGame6() {
        let num1, num2, num3, num4;
        document.getElementById('modal-6').onclick = function() {
            let next = arrStatus.level_6;
            if (next) {
                let cont = document.getElementById('modal-6_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_6-num1').innerHTML = mtRandom(2, 8);
                num2 = document.getElementById('level_6-num2').innerHTML = mtRandom(2, 8);
                num3 = document.getElementById('level_6-num3').innerHTML = mtRandom(2, 8);
                num4 = document.getElementById('level_6-num4').innerHTML = mtRandom(2, 8);
                document.getElementById('modal-6').classList.add('modal-h');
                console.log(resultCalculation6());
                let btn = document.getElementById('ok-level-6');
                btn.onclick = checkRes6;
            }
        }

        function resultCalculation6() {
            let res = +num1 * +num2 + +num3 * +num4;
            return res;
        }

        function checkRes6() {
            let resultComp = resultCalculation6();
            let result = checkCalculation(resultComp, 'level-res6', 'modal-6', 'modal-7');
            if (result) {
                modal.close();
                document.getElementById('text-6').innerHTML = 'уровень пройден';
                document.getElementById('text-7').innerHTML = 'уровень открыт!';
                document.getElementById('modal-6').classList.remove('modal-h');
                arrStatus.level_7 = true;
                arrStatus.level_6 = false;
                levelSuccess[5] = true;
            } else {
                arrStatus.level_7 = false;
                levelSuccess[5] = false;
            }
        }
    }

    levelGame6();

    //  __________________________7 уровень_________________________________
    function levelGame7() {
        let num1, num2, num3, num4;
        document.getElementById('modal-7').onclick = function() {
            let next = arrStatus.level_7;
            if (next) {
                let cont = document.getElementById('modal-7_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_7-num1').innerHTML = mtRandom(1, 10);
                num2 = document.getElementById('level_7-num2').innerHTML = mtRandom(1, 10);
                num3 = document.getElementById('level_7-num3').innerHTML = mtRandom(1, 10);
                num4 = document.getElementById('level_7-num4').innerHTML = mtRandom(1, 10);
                document.getElementById('modal-7').classList.add('modal-h');
                console.log(resultCalculation7());
                let btn = document.getElementById('ok-level-7');
                btn.onclick = checkRes7;
            }
        }

        function resultCalculation7() {
            let res = +num1 * +num2 + +num3 * +num4;
            return res;
        }

        function checkRes7() {
            modal.close();
            let resultComp = resultCalculation7();
            let result = checkCalculation(resultComp, 'level-res7', 'modal-7', 'modal-8');
            if (result) {
                document.getElementById('text-7').innerHTML = 'уровень пройден';
                document.getElementById('text-8').innerHTML = 'уровень открыт!';
                document.getElementById('modal-7').classList.remove('modal-h');
                arrStatus.level_8 = true;
                arrStatus.level_7 = false;
                levelSuccess[6] = true;
            } else {
                arrStatus.level_8 = false;
                levelSuccess[6] = false;
            }
        }
    }
    levelGame7();
    //  __________________________8 уровень_________________________________
    function levelGame8() {
        let num1, num2, num3, num4;
        document.getElementById('modal-8').onclick = function() {
            let next = arrStatus.level_8;
            if (next) {
                let cont = document.getElementById('modal-8_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_8-num1').innerHTML = mtRandom(80, 100);
                num2 = document.getElementById('level_8-num2').innerHTML = mtRandom(1, 70);
                num3 = document.getElementById('level_8-num3').innerHTML = mtRandom(20, 40);
                num4 = document.getElementById('level_8-num4').innerHTML = mtRandom(1, 20);
                document.getElementById('modal-8').classList.add('modal-h');
                console.log(resultCalculation8());
                let btn = document.getElementById('ok-level-8');
                btn.onclick = checkRes8;
            }
        }

        function resultCalculation8() {
            let res = +num1 - +num2 + +num3 - +num4;
            return res;
        }

        function checkRes8() {
            let resultComp = resultCalculation8();
            let result = checkCalculation(resultComp, 'level-res8', 'modal-8', 'modal-9');
            if (result) {
                modal.close();
                document.getElementById('text-8').innerHTML = 'уровень пройден';
                document.getElementById('text-9').innerHTML = 'уровень открыт!';
                document.getElementById('modal-8').classList.remove('modal-h');
                arrStatus.level_9 = true;
                arrStatus.level_8 = false;
                levelSuccess[7] = true;
            } else {
                arrStatus.level_9 = false;
                levelSuccess[7] = false;
            }
        }
    }
    levelGame8();
    //  __________________________9 уровень_________________________________
    function levelGame9() {
        let num1, num2, num3, num4;
        document.getElementById('modal-9').onclick = function() {
            let next = arrStatus.level_9;
            if (next) {
                let cont = document.getElementById('modal-9_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_9-num1').innerHTML = mtRandom(40, 100);
                num2 = document.getElementById('level_9-num2').innerHTML = mtRandom(10, 20);
                num3 = document.getElementById('level_9-num3').innerHTML = mtRandom(5, 10);
                num4 = document.getElementById('level_9-num4').innerHTML = mtRandom(0, 100);
                document.getElementById('modal-9').classList.add('modal-h');
                console.log(resultCalculation9());
                let btn = document.getElementById('ok-level-9');
                btn.onclick = checkRes9;
            }
        }

        function resultCalculation9() {
            let res = +num1 - +num2 - +num3 + +num4;
            return res;
        }

        function checkRes9() {
            let resultComp = resultCalculation9();
            let result = checkCalculation(resultComp, 'level-res9', 'modal-9', 'modal-10');
            if (result) {
                modal.close();
                document.getElementById('text-9').innerHTML = 'уровень пройден';
                document.getElementById('text-10').innerHTML = 'уровень открыт!';
                document.getElementById('modal-9').classList.remove('modal-h');
                arrStatus.level_10 = true;
                arrStatus.level_9 = false;
                levelSuccess[8] = true;
            } else {
                arrStatus.level_10 = false;
                levelSuccess[8] = false;
            }
        }
    }
    levelGame9();
    //  __________________________10 уровень_________________________________
    function levelGame10() {
        let num1, num2, num3, num4;
        document.getElementById('modal-10').onclick = function() {
            let next = arrStatus.level_10;
            if (next) {
                cont = document.getElementById('modal-10_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_10-num1').innerHTML = mtRandom(50, 100);
                num2 = document.getElementById('level_10-num2').innerHTML = mtRandom(30, 50);
                num3 = document.getElementById('level_10-num3').innerHTML = mtRandom(30, 100);
                num4 = document.getElementById('level_10-num4').innerHTML = mtRandom(20, 30);
                document.getElementById('modal-10').classList.add('modal-h');
                console.log(resultCalculation10());
                let btn = document.getElementById('ok-level-10');
                btn.onclick = checkRes10;
            }
        }

        function resultCalculation10() {
            let res = +num1 + +num2 + (+num3 - +num4);
            return res;
        }

        function checkRes10() {
            let resultComp = resultCalculation10();
            let result = checkCalculation(resultComp, 'level-res10', 'modal-10', 'modal-11');
            if (result) {
                modal.close();
                document.getElementById('text-10').innerHTML = 'уровень пройден';
                document.getElementById('text-11').innerHTML = 'уровень открыт!';
                document.getElementById('modal-10').classList.remove('modal-h');
                arrStatus.level_11 = true;
                arrStatus.level_10 = false;
                levelSuccess[9] = true;
            } else {
                arrStatus.level_11 = false;
                levelSuccess[9] = false;
            }
        }
    }
    levelGame10();
    //  __________________________11 уровень_________________________________
    function levelGame11() {
        let num1, num2, num3, num4;
        document.getElementById('modal-11').onclick = function() {
            let next = arrStatus.level_11;
            if (next) {
                let cont = document.getElementById('modal-11_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_11-num1').innerHTML = mtRandom(5, 10);
                num2 = document.getElementById('level_11-num2').innerHTML = mtRandom(5, 10);
                num3 = document.getElementById('level_11-num3').innerHTML = mtRandom(1, 5);
                num4 = document.getElementById('level_11-num4').innerHTML = mtRandom(1, 5);
                document.getElementById('modal-11').classList.add('modal-h');
                console.log(resultCalculation11());
                let btn = document.getElementById('ok-level-11');
                btn.onclick = checkRes11;
            }
        }

        function resultCalculation11() {
            let res = +num1 * +num2 - +num3 * +num4;
            return res;
        }

        function checkRes11() {
            let resultComp = resultCalculation11();
            let result = checkCalculation(resultComp, 'level-res11', 'modal-11', 'modal-12');
            if (result) {
                modal.close();
                document.getElementById('text-11').innerHTML = 'уровень пройден';
                document.getElementById('text-12').innerHTML = 'уровень открыт!';
                document.getElementById('modal-11').classList.remove('modal-h');
                arrStatus.level_12 = true;
                arrStatus.level_11 = false;
                levelSuccess[10] = true;
            } else {
                arrStatus.level_12 = false;
                levelSuccess[10] = false;
            }
        }
    }

    levelGame11();
    //  __________________________12 уровень_________________________________
    function levelGame12() {
        let num1, num2, num3, num4;
        document.getElementById('modal-12').onclick = function() {
            let next = arrStatus.level_12;
            if (next) {
                let cont = document.getElementById('modal-12_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_12-num1').innerHTML = mtRandom(90, 100);
                num2 = document.getElementById('level_12-num2').innerHTML = mtRandom(0, 70);
                num3 = document.getElementById('level_12-num3').innerHTML = mtRandom(1, 9);
                num4 = document.getElementById('level_12-num4').innerHTML = mtRandom(1, 9);
                document.getElementById('modal-12').classList.add('modal-h');
                console.log(resultCalculation12());
                let btn = document.getElementById('ok-level-12');
                btn.onclick = checkRes12;
            }
        }

        function resultCalculation12() {
            let res = +num1 - +num2 + +num3 * +num4;
            return res;
        }

        function checkRes12() {
            let resultComp = resultCalculation12();
            let result = checkCalculation(resultComp, 'level-res12', 'modal-12', 'modal-13');
            if (result) {
                modal.close();
                document.getElementById('text-12').innerHTML = 'уровень пройден';
                document.getElementById('text-13').innerHTML = 'уровень открыт!';
                document.getElementById('modal-12').classList.remove('modal-h');
                arrStatus.level_13 = true;
                arrStatus.level_12 = false;
                levelSuccess[11] = true;
            } else {
                arrStatus.level_13 = false;
                levelSuccess[11] = false;
            }
        }
    }
    levelGame12()
        //  __________________________13 уровень_________________________________
    function levelGame13() {
        let num1, num2, num3, num4;
        document.getElementById('modal-13').onclick = function() {
            let next = arrStatus.level_13;
            if (next) {
                let cont = document.getElementById('modal-13_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_13-num1').innerHTML = mtRandom(8, 10);
                num2 = document.getElementById('level_13-num2').innerHTML = mtRandom(5, 10);
                num3 = document.getElementById('level_13-num3').innerHTML = mtRandom(20, 40);
                num4 = document.getElementById('level_13-num4').innerHTML = mtRandom(2, 20);
                document.getElementById('modal-13').classList.add('modal-h');
                console.log(resultCalculation13());
                let btn = document.getElementById('ok-level-13');
                btn.onclick = checkRes13;
            }
        }

        function resultCalculation13() {
            let res = +num1 * +num2 - +num3 + +num4;
            return res;
        }

        function checkRes13() {
            let resultComp = resultCalculation13();
            let result = checkCalculation(resultComp, 'level-res13', 'modal-13', 'modal-14');
            if (result) {
                modal.close();
                document.getElementById('text-13').innerHTML = 'уровень пройден';
                document.getElementById('text-14').innerHTML = 'уровень открыт!';
                document.getElementById('modal-13').classList.remove('modal-h');
                arrStatus.level_14 = true;
                arrStatus.level_13 = false;
                levelSuccess[12] = true;
            } else {
                arrStatus.level_14 = false;
                levelSuccess[12] = false;
            }
        }
    }
    levelGame13();
    //  __________________________14 уровень_________________________________
    function levelGame14() {
        let num1, num2, num3, num4, num5;
        document.getElementById('modal-14').onclick = function() {
            let next = arrStatus.level_14;
            if (next) {
                let cont = document.getElementById('modal-14_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_14-num1').innerHTML = mtRandom(80, 100);
                num2 = document.getElementById('level_14-num2').innerHTML = mtRandom(0, 80);
                num3 = document.getElementById('level_14-num3').innerHTML = mtRandom(1, 9);
                num4 = document.getElementById('level_14-num4').innerHTML = mtRandom(1, 9);
                num5 = document.getElementById('level_14-num5').innerHTML = mtRandom(0, 100);
                document.getElementById('modal-14').classList.add('modal-h');
                console.log(resultCalculation14());
                let btn = document.getElementById('ok-level-14');
                btn.onclick = checkRes14;
            }
        }

        function resultCalculation14() {
            let res = +num1 - +num2 + +num3 * num4 + num5;
            return res;
        }

        function checkRes14() {
            let resultComp = resultCalculation14();
            let result = checkCalculation(resultComp, 'level-res14', 'modal-14', 'modal-15');
            if (result) {
                modal.close();
                document.getElementById('text-14').innerHTML = 'уровень пройден';
                document.getElementById('text-15').innerHTML = 'уровень открыт!';
                document.getElementById('modal-14').classList.remove('modal-h');
                arrStatus.level_15 = true;
                arrStatus.level_14 = false;
                levelSuccess[13] = true;
            } else {
                arrStatus.level_15 = false;
                levelSuccess[13] = false;
            }
        }
    }
    levelGame14();

    //  __________________________15 уровень_________________________________
    function levelGame15() {
        let num1, num2, num3, num4, num5, num6;
        document.getElementById('modal-15').onclick = function() {
            let next = arrStatus.level_15;
            if (next) {
                let cont = document.getElementById('modal-15_content');
                modal.open(cont.innerHTML);
                num1 = document.getElementById('level_15-num1').innerHTML = mtRandom(30, 60);
                num2 = document.getElementById('level_15-num2').innerHTML = mtRandom(30, 60);
                num3 = document.getElementById('level_15-num3').innerHTML = mtRandom(20, 50);
                num4 = document.getElementById('level_15-num4').innerHTML = mtRandom(20, 50);
                num5 = document.getElementById('level_15-num5').innerHTML = mtRandom(10, 40);
                num6 = document.getElementById('level_15-num6').innerHTML = mtRandom(10, 40);
                document.getElementById('modal-15').classList.add('modal-h');
                console.log(resultCalculation15());
                let btn = document.getElementById('ok-level-15');
                btn.onclick = checkRes15;
            }
        }

        function resultCalculation15() {
            let res = +num1 + +num2 - +num3 + +num4 - +num5 + +num6;
            return res;
        }

        function checkRes15() {
            let resultComp = resultCalculation15();
            let result = checkCalculation(resultComp, 'level-res15', 'modal-15');
            if (result) {
                document.getElementById('text-15').innerHTML = 'уровень пройден';
                document.getElementById('modal-15').classList.remove('modal-h');
                arrStatus.level_15 = true;
                levelSuccess[14] = true;
                modal.open();
                actionAfterSuccessCheck();
                clearTimeout(timeoutID);
                clearTimeout(timeInterval);
            } else {
                arrStatus.level_15 = false;
                levelSuccess[14] = false;
            }
        }
    }
    levelGame15();

}
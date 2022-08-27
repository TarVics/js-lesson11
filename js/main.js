/*
Зробити свій розпорядок дня.

У вас має бути більше ніж 10 асинхронних дій з випадковими затримками.
Вам необхідно синхронізувати всі свої дії за допомогою Promise та async await (Код має бути написаний окремо)
Затримка має бути НЕ в порядку зростання, а будь-яка. При тому ваші дії мають бути синхронізовані.

Наприклад.

    Прокинутись - 0.3 с
    Поснідати - 1 с
    Піти в душ - 0.5 с
    Дочекатись автобус - 3 с
    Пообідати - 1 с

    І так далі
*/

const daySchedule = [
    { description: 'Прокидаюсь', duration: [4, 5] },
    // Це завдання починає виконуватись разом із наступним і завершується до моменту старту завдання 'Снідаю'
    { description: 'Приготування сніданку на плиті', duration: [20, 30] },
    { description: 'Займаюсь гантелями', duration: [10, 15] }, // Ланцюжки [1] та [2, 3] виконуються одночасно
    { description: 'Прийом душу', duration: [5, 8] },          //
    { description: 'Снідаю', duration: [10, 20] },
    { description: 'Їду на роботу', duration: [45, 60] },
    { description: 'Працюю', duration: [225, 250] },
    { description: 'Обідаю', duration: [20, 60] },
    { description: 'Працюю', duration: [225, 250] },
    { description: 'їду додому', duration: [45, 60] },
    { description: 'Заняття на тренажері', duration: [60, 65] },
    { description: 'Прийом душу', duration: [15, 20] },
    { description: 'Вечеряю', duration: [30, 60] },
    { description: 'Дивлюсь телевізор', duration: [120, 180] },
    { description: 'Готуюсь до сну', duration: [15, 20] }
];

// Шукаємо мінімальне значення часу, яке буде виконуватись 100 мс.
// Всі інші значення будуть виконуватись V(n) * 100 / V(min) мс
const timeCoefficient = 100 / daySchedule.map(val => val.duration[0]).reduce((acc, val) => val < acc ? val : acc);

// Випадковий час із діапазону часу
const randomTime = (from, to) => Math.round(from + Math.random() * (to - from))

// Запуск завдання по його індексу у масиві daySchedule
const runTask = (index) => {
    return new Promise(resolve => {
        const [min, max] = daySchedule[index].duration;
        const description = daySchedule[index].description;
        const duration = randomTime(min, max);
        setTimeout(() => {
            let time;

            if (duration > 60) {
                const min = duration % 60;
                time = `${(duration - min) / 60} hr, ${min} min`;
            } else
                time = duration + ' min';

            console.log(index + 1, description, time, '[FINISH]');
            resolve(description);
        }, duration * timeCoefficient);
        console.log(index + 1, description, '[START]');
    });
}

// Реалізація через звичайні проміси
function schedule() {
    return runTask(0)
        .then(() => {
            return Promise.all([
                runTask(1),
                new Promise( resolve => {
                    runTask(2)
                        .then(() => runTask(3))
                        .then(() => resolve())
                })
            ])
        })
        .then(() => runTask(4))
        .then(() => runTask(5))
        .then(() => runTask(6))
        .then(() => runTask(7))
        .then(() => runTask(8))
        .then(() => runTask(9))
        .then(() => runTask(10))
        .then(() => runTask(11))
        .then(() => runTask(12))
        .then(() => runTask(13))
        .then(() => runTask(14))
}

// async - await реалізація
async function scheduleAsync() {
    await runTask(0);
    await Promise.all([
        runTask(1),
        new Promise( resolve => {
            runTask(2)
                .then(() => runTask(3))
                .then(() => resolve())
        })
    ]);
    for (let i = 4; i <= 14; i++) await runTask(i);
}

schedule()
    .then(() => {
        console.log('DONE !')
        console.log('********************************************')
        return scheduleAsync()
    })
    .then(() => {
        console.log('DONE !')
    })


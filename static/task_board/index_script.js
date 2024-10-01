// 定数の定義
const HOURS_PER_DAY = 24; // 1日あたりの時間
const HOUR_TO_PX = 20; // 1時間当たりのpx
const SECONDS_PER_HOUR = 1000 * 60 * 60 // 1時間当たりの秒数
const CHART_LEFT_MARGIN = 30; // チャートの左端の調整用
const MARGIN = 10;
const TASK_BAR_HEIGHT = 30; // タスクバーの縦の長さ
const TASK_BAR_UNIT = 36;
const TASK_BAR_FONT_SIZE = 15;
const BACK_GROUND_COLOR = '#913e0b80';
const SEPARATOR_THINNESS = 1;
const NAME_HEIGHT = 16;
const MAX_WIDTH = 200;
const MAX_DUE_DATE_PX = 127; // タスクバーのラベルの幅は126.34px
const INTERVAL = 30; // 現在時間の更新間隔
const DEFAULT_DATE = new Date();

let nowLineElement = null;  // グローバル変数で現在の線を管理

// 無効な時間の場合にデフォルトの時間を渡す
function getValidDate(dateString) {
    try {
        const date = new Date(dateString);

        // 無効な日付であれば throw する
        if (isNaN(date.getTime())) {
            throw new Error('Invalid Date');
        }

        return date.toISOString();
    } catch (error) {
        return DEFAULT_DATE.toISOString();  // デフォルトの日時
    }
};

// 時間をピクセルに変換する関数
function timeToPixels(time) {
    const date = new Date(time);
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const timeDiff = date - startDate;

    if (timeDiff < 0) return - CHART_LEFT_MARGIN;

    return (timeDiff / SECONDS_PER_HOUR) * HOUR_TO_PX;
};

// 時間を区切る垂直な直線を引く
function drawVerticalLine() {
    const chartHeader = document.getElementById('chart-header');
    const taskBars = document.getElementById('task-bars');
    for (let i = 0; i < chartHeader.children.length; i++) {
        const verticalLine = document.createElement('div');
        verticalLine.className = 'vertical-line';
        verticalLine.style.left = `${CHART_LEFT_MARGIN + i * HOUR_TO_PX * intervalHours}px`;
        verticalLine.style.width = `${SEPARATOR_THINNESS}px`;
        verticalLine.style.backgroundColor = BACK_GROUND_COLOR;
        taskBars.appendChild(verticalLine);
    };
};

// タスク名の追加
function addTaskName(tasks) {
    const taskContainers = document.querySelectorAll('.tasks');
    taskContainers.forEach(tasksContainer => {
        tasks.forEach(task => {
            const taskNameDiv = document.createElement('div');
            taskNameDiv.className = 'task-name dropdown';
            taskNameDiv.style.margin = `${MARGIN}px 0`;
            taskNameDiv.style.height = `${NAME_HEIGHT}px`;
            taskNameDiv.style.lineHeight = `${NAME_HEIGHT}px`;
            taskNameDiv.style.max_width = `${MAX_WIDTH}px`;

            const taskLink = document.createElement('a')
            taskLink.href = task.link;
            taskLink.style.fontSize = `${TASK_BAR_FONT_SIZE}px`;
            taskLink.target = '_blank';
            taskLink.rel = 'noopener noreferrer';

            if (task.submissionState == 'TURNED_IN') {
                taskLink.textContent = `✓${task.name}`;
                taskLink.style.color = '#00000050'; // black(#000000)のopacity: 50
            } else {
                taskLink.textContent = task.name;
                taskLink.style.color = 'black';
            };

            taskNameDiv.appendChild(taskLink)
            tasksContainer.appendChild(taskNameDiv);
        });
    });
};

// タスクバーの色を決める
function setTaskBarColor(task) {
    // 現在の時刻を取得
    const now = new Date();
    const endTime = new Date(task.endTime);
    const timeDifference = endTime - now; // タスクの終了時間と現在の時間差を計算
    // タスクバーの色を条件によって変更
    if (timeDifference < 0) {
        if (task.submissionState == 'TURNED_IN') {
            return '#ff000050'; // #ff0000のopacity: 0x50
        } else {
            return '#ff0000';
        }
    } else if (timeDifference < 24 * SECONDS_PER_HOUR) {
        if (task.submissionState == 'TURNED_IN') {
            return '#faa02050'; // #faa020のopacity: 0x50
        } else {
            return '#faa020';
        }
    } else {
        if (task.submissionState == 'TURNED_IN'){
            return '#00800050';
        } else {
            return '#008000';
        }
    }
};

// タスクバーを追加
function addTaskBar(tasks) {
    const taskSpacing = MARGIN * 2 + NAME_HEIGHT;
    const taskBars = document.getElementById('task-bars');

    drawVerticalLine()

    tasks.forEach((task, index) => {
        const taskBar = document.createElement('div');
        taskBar.className = 'task-bar';

        const taskStartPx = timeToPixels(task.startTime, 20) + CHART_LEFT_MARGIN;
        const taskEndPx = timeToPixels(task.endTime, 20) + CHART_LEFT_MARGIN;
        const taskBarWidth = taskEndPx - taskStartPx;

        taskBar.style.height = `${TASK_BAR_HEIGHT}px`
        taskBar.style.left = `${taskStartPx}px`;
        taskBar.style.width = `${taskBarWidth}px`;
        taskBar.style.margin = `${(TASK_BAR_UNIT - TASK_BAR_HEIGHT) / 2}px`
        taskBar.style.top = `${index * taskSpacing}px`;
        taskBar.style.backgroundColor = setTaskBarColor(task);

        const maxPx = daysRange * HOURS_PER_DAY * HOUR_TO_PX; // チャートの右端までのpx

        if (taskEndPx > maxPx) {
            taskBar.style.width = `${maxPx - taskStartPx}px`;
        };

        taskBars.appendChild(taskBar);

        const dueDateDiv = document.createElement('div');
        dueDateDiv.className = 'due-date';
        const endDate = new Date(task.endTime);
        // const now = new Date();
        // const timeDiff = endDate - now;

        // const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        // const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        // dueDateDiv.textContent = `あと${days}日と${hours}時間`;

        dueDateDiv.textContent = '~' + endDate.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(/\//g, '/');

        dueDateDiv.style.left = `${taskStartPx}px`;
        dueDateDiv.style.top = `${index * taskSpacing + TASK_BAR_HEIGHT - TASK_BAR_FONT_SIZE * 1.5}px`;
        dueDateDiv.style.fontSize = `${TASK_BAR_FONT_SIZE}px`;
        if (taskBarWidth < MAX_DUE_DATE_PX) {
            dueDateDiv.style.color = 'black';
        } else {
            dueDateDiv.style.color = 'white';
        };

        taskBars.appendChild(dueDateDiv);

        const separatorLine = document.createElement('div');
        separatorLine.className = 'task-separator';
        separatorLine.style.top = `${(index + 1) * taskSpacing}px`;
        separatorLine.style.height = `${SEPARATOR_THINNESS}px`;
        separatorLine.style.backgroundColor = BACK_GROUND_COLOR;
        taskBars.appendChild(separatorLine);
    });
};

// チャートに日付を設定する
function createDateLabel(date, centerPx) {
    const label = document.createElement('div');
    label.className = 'date-label';
    label.style.left = `${centerPx}px`;
    label.style.width = '60px';
    label.textContent = date.toLocaleDateString('ja', { month: 'short', day: 'numeric' });
    return label;
};

// 横軸を生成
function makeHorizontalLabel() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const chartHeader = document.getElementById('chart-header');
    for (let day = 0; day < daysRange; day++) {
        for (let hour = 0; hour < HOURS_PER_DAY; hour += intervalHours) {
            const headerCell = document.createElement('div');
            const date = new Date(startDate.getTime());
            date.setDate(startDate.getDate() + day);
            date.setHours(hour, 0, 0, 0);

            headerCell.className = 'header-cell';
            headerCell.style.width = `${HOUR_TO_PX * intervalHours}px`;

            const timeText = document.createElement('div');
            timeText.className = 'time-text';
            timeText.style.width = 'fit-content';
            timeText.style.marginLeft = '20px';
            timeText.textContent = date.getHours() + ':00';

            headerCell.appendChild(timeText);
            chartHeader.appendChild(headerCell);
        };
    };
};

const nowLineElements = {};

// 現在時刻の線を引く
function drawNowLine(taskBarsHeight, className) {
    const element = document.getElementById(className);

    // クラスに対応する古い線があれば削除
    if (nowLineElements[className]) {
        nowLineElements[className].remove();
    }

    const now = new Date();  // 現在の時間を取得
    const nowPx = timeToPixels(now.toISOString(), 20);  // 現在の時間をピクセルに変換

    const nowLineElement = document.createElement('div');  // 新しい線を作成
    nowLineElement.classList.add("now-time");
    nowLineElement.style.position = 'absolute';
    nowLineElement.style.top = '0';
    nowLineElement.style.bottom = '0';
    nowLineElement.style.width = '2px';
    nowLineElement.style.backgroundColor = '#ff000099'; // red(0xff0000)のopacity: 0x99
    nowLineElement.style.zIndex = '2';
    
    if (className === 'task-bars') {
        nowLineElement.style.height = `${taskBarsHeight}px`;
        nowLineElement.style.left = `${CHART_LEFT_MARGIN + nowPx}px`;
    } else {
        nowLineElement.style.height = '100%';
        nowLineElement.style.left = `${CHART_LEFT_MARGIN + nowPx + 12}px`;
    }

    // 新しい線を追加
    if (element) {
        element.appendChild(nowLineElement);
        // 新しい線をオブジェクトに保存
        nowLineElements[className] = nowLineElement;
    }
};

// 一定間隔でdrawNowLineを更新する
function startNowLineUpdates(taskBarsHeight, className) {
    drawNowLine(taskBarsHeight, className);  // 最初に呼び出し
    setInterval(() => {
        drawNowLine(taskBarsHeight, className);  // 毎秒線を更新
    }, 1000 * INTERVAL);  // interval秒ごとに更新
};

// 日付の区切り線を描く
function drawFooterLine() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const chartFooter = document.getElementById('chart-footer');
    for (let day = 0; day < daysRange; day++) {
        const date = new Date(startDate.getTime());
        date.setDate(startDate.getDate() + day);

        const centerPx = day * HOUR_TO_PX * HOURS_PER_DAY + HOUR_TO_PX * HOURS_PER_DAY / 2;
        const leftPx = day * HOUR_TO_PX * HOURS_PER_DAY;
        const dateLabel = createDateLabel(date, centerPx);
        chartFooter.appendChild(dateLabel);

        const dateLine = document.createElement('div');
        dateLine.className = 'date-line';
        dateLine.style.left = `${leftPx + CHART_LEFT_MARGIN}px`;
        chartFooter.appendChild(dateLine);
    };
};

// フラット化できるかの判定と処理
function flatData(data) {
    if (Array.isArray(data) && data.length !== 0) {
        data = data.flat();
    } else {
        data = [{ "default": 0 }];
    };
    return data;
};

// チャートの初期化
async function initializationChart() {
    const [authData, taskBoardData] = await fetchTaskBoard();
    const courses = flatData(taskBoardData[0]);
    const coursework = flatData(taskBoardData[1]);
    const submissionData = flatData(taskBoardData[2]);
    const tasks = makeTasks(courses, coursework, submissionData);
    drawChart(tasks);
};

// チャートの更新
async function updateChart() {
    const [authData, taskBoardData] = await fetchTaskBoard();

    const courses = taskBoardData[0];
    const coursework = taskBoardData[1];

    let updatedSubmission = await fetchUpdatedData();

    let updatedTasks;

    if (Array.isArray(coursework) && coursework.length !== 0) {
        coursework = coursework.flat();
    }

    if (Array.isArray(updatedSubmission) && updatedSubmission.length !== 0) {
        updatedSubmission = updatedSubmission.flat();
    }

    console.log("updatedSubmission:", updatedSubmission);


    if ("error" in updatedSubmission) {
        updatedSubmission = [{ "default": 0 }]
    }
    updatedTasks = makeTasks(courses, coursework, updatedSubmission);
    clearChart();
    drawChart(updatedTasks);
};

// チャートの削除
async function clearChart() {
    const taskBars = document.getElementById('task-bars');
    const tasksContainers = document.querySelectorAll('.tasks');
    const chartFooter = document.getElementById('chart-footer');
    const chartHeader = document.getElementById('chart-header');

    // 現在のチャートをクリア
    while (taskBars.firstChild) taskBars.removeChild(taskBars.firstChild);
    while (chartFooter.firstChild) chartFooter.removeChild(chartFooter.firstChild);
    while (chartHeader.firstChild) chartHeader.removeChild(chartHeader.firstChild);
    tasksContainers.forEach(container => {
        while (container.firstChild) container.removeChild(container.firstChild);
    });
};

// 期限過ぎているかどうかの判定
function judgeDueTime(task) {
    const now = new Date();
    const endTime = new Date(task.endTime);
    return (endTime < now);
};

// 期限が過ぎているタスクをリストから削除
function filterTasks(tasks) {
    return tasks.filter(task => !judgeDueTime(task));
};

// チャートの描画
function drawChart(tasks) {
    tasks =  tasks.filter(task => task !== undefined);

    if (tasks.length === 0) {
        return;
    }

    const taskSpacing = MARGIN * 2 + NAME_HEIGHT;  // タスク間のスペースを調整

    addTaskName(tasks); // タスク名を動的に追加
    addTaskBar(tasks); // タスクバーを追加

    // タスクバーの高さを設定
    const taskBarsHeight = tasks.length * taskSpacing;
    const verticalLines = document.querySelectorAll('.vertical-line');
    verticalLines.forEach(line => {
        line.style.height = `${taskBarsHeight}px`;
    });

    drawNowLine(taskBarsHeight);

    drawFooterLine()

    const classList = ['task-bars', 'head-bar-main']

    classList.forEach(className => {
        startNowLineUpdates(taskBarsHeight, className);
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // スクロールの同期
    const headBarMain = document.querySelector('.head-bar-main');
    const contentMain = document.querySelector('.content-main');
    const contentSide = document.querySelector('.content-side');

    if (headBarMain && contentMain) {
        headBarMain.addEventListener('scroll', function () {
            contentMain.scrollLeft = headBarMain.scrollLeft;
        });

        contentMain.addEventListener('scroll', function () {
            headBarMain.scrollLeft = contentMain.scrollLeft;
        });
    }

    if (contentSide && contentMain) {
        contentSide.addEventListener('scroll', function() {
            contentMain.scrollTop = contentSide.scrollTop;
        });

        contentMain.addEventListener('scroll', function() {
            contentSide.scrollTop = contentMain.scrollTop;
        });
    }

    // サイドバーの開閉
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-btn');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function () {
            sidebar.classList.toggle('show');
            toggleButton.textContent = sidebar.classList.contains('show') ? '<' : '>';
        });
    }

    // サイドバー外側をクリックした場合にサイドバーを閉じる処理
    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                toggleButton.textContent = '>';
            }
        }
    });

    document.addEventListener('touchstart', function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                toggleButton.textContent = '>';
            }
        }
    });

    // サイドバー内のクリックを伝播させないようにする
    sidebar.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    sidebar.addEventListener('touchstart', function (event) {
        event.stopPropagation();
    });
});

// ユーザーが選択した時間の表示間隔を時間軸に適用
document.getElementById('time-interval').addEventListener('change', function() {
    const selectedInterval = parseInt(this.value, 10);
    localStorage.setItem('timeInterval', selectedInterval);
    location.reload();
});

// ページロード時に保存された時間間隔を適用
window.addEventListener('load', function() {
    intervalHours = parseInt(localStorage.getItem('timeInterval'), 10) || 3;
    document.getElementById('time-interval').value = intervalHours;
});

// ユーザーが選択した表示日数を適用
document.getElementById('days-range').addEventListener('change', function() {
    const selectedRange = parseInt(this.value, 10);
    localStorage.setItem('daysRange', selectedRange);
    location.reload();
});

// ページロード時に保存された表示日数を適用
window.addEventListener('load', function() {
    daysRange = parseInt(localStorage.getItem('daysRange'), 10) || 3;
    document.getElementById('days-range').value = daysRange;
});

//---------------------------- 処理の実行-----------------------------------

document.addEventListener('DOMContentLoaded', async function () {
    await main();
});
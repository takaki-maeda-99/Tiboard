// 定数の定義
const DAYS_RANGE = 3; // 表示する日数
const HOURS_PER_DAY = 24; // 1日あたりの時間
const HOUR_TO_PX = 20; // 1時間当たりのpx
const INTERVAL_HOURS = 3; // 横軸に何時間刻みで時間を表示するか
const SECONDS_PER_HOUR = 1000 * 60 * 60 // 1時間当たりの秒数
const CHART_LEFT_MARGIN = 30; // チャートの左端の調整用
const MARGIN = 10;
const TASK_BAR_HEIGHT = 30; // タスクバーの縦の長さ
const TASK_BAR_UNIT = 36;
const TASK_BAR_FONT_SIZE = 15;
const BACK_GROUND_COLOR = '#ddd'; // チャートの枠線と同じ色
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
        verticalLine.style.left = `${CHART_LEFT_MARGIN + i * HOUR_TO_PX * INTERVAL_HOURS}px`;
        verticalLine.style.position = 'absolute';
        verticalLine.style.top = '0';
        verticalLine.style.bottom = '0';
        verticalLine.style.width = `${SEPARATOR_THINNESS}px`;
        verticalLine.style.backgroundColor = BACK_GROUND_COLOR;
        verticalLine.style.zIndex = '0';
        taskBars.appendChild(verticalLine);
    };
};

// タスク名の追加
function addTaskName(tasks) {
    tasks = filterTasks(tasks);
    const taskContainers = document.querySelectorAll('.tasks');
    taskContainers.forEach(tasksContainer => {
        tasks.forEach(task => {
            const taskNameDiv = document.createElement('div');
            taskNameDiv.className = 'task-name';
            taskNameDiv.style.marginTop = `${MARGIN}px`;
            taskNameDiv.style.marginBottom = `${MARGIN}px`;
            taskNameDiv.style.height = `${NAME_HEIGHT}px`;
            taskNameDiv.style.lineHeight = `${NAME_HEIGHT}px`;
            taskNameDiv.style.max_width = `${MAX_WIDTH}px`;
            taskNameDiv.style.overflow = 'hidden'; // オーバーフローを隠す
            taskNameDiv.style.whiteSpace = 'nowrap'; // 改行しない
            taskNameDiv.style.textOverflow = 'ellipsis'; // 省略記号を表示
            taskNameDiv.textContent = task.name;
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
        // 期限が過ぎている場合は赤色
        return 'red';
    } else if (timeDifference < 24 * SECONDS_PER_HOUR) {
        // 期限まで24時間以内の場合はオレンジ色
        return 'orange';
    } else {
        // それ以外は緑色
        return 'green';
    }
};

// タスクバーを追加
function addTaskBar(tasks) {
    const taskSpacing = MARGIN * 2 + NAME_HEIGHT;
    const taskBars = document.getElementById('task-bars');

    drawVerticalLine()

    tasks = filterTasks(tasks);

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
        taskBar.style.zIndex = '1';
        taskBar.style.backgroundColor = setTaskBarColor(task);

        const maxPx = DAYS_RANGE * HOURS_PER_DAY * HOUR_TO_PX; // チャートの右端までのpx

        if (taskEndPx > maxPx) {
            taskBar.style.width = `${maxPx - taskStartPx}px`;
        };

        taskBars.appendChild(taskBar);

        const dueDateDiv = document.createElement('div');
        dueDateDiv.className = 'due-date';
        const endDate = new Date(task.endTime);

        dueDateDiv.textContent = '~' + endDate.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(/\//g, '/');

        dueDateDiv.style.position = 'absolute';
        dueDateDiv.style.left = `${taskStartPx}px`;
        dueDateDiv.style.marginLeft = '5px';
        dueDateDiv.style.top = `${index * taskSpacing + TASK_BAR_HEIGHT - TASK_BAR_FONT_SIZE * 1.5}px`;
        dueDateDiv.style.fontSize = `${TASK_BAR_FONT_SIZE}px`;
        if (taskBarWidth < MAX_DUE_DATE_PX) {
            dueDateDiv.style.color = 'black';
        } else {
            dueDateDiv.style.color = 'white';
        };

        dueDateDiv.style.zIndex = '2';


        taskBars.appendChild(dueDateDiv);

        const separatorLine = document.createElement('div');
        separatorLine.className = 'task-separator';
        separatorLine.style.position = 'absolute';
        separatorLine.style.top = `${(index + 1) * taskSpacing}px`;
        separatorLine.style.left = '0';
        separatorLine.style.right = '0';
        separatorLine.style.height = `${SEPARATOR_THINNESS}px`;
        separatorLine.style.backgroundColor = BACK_GROUND_COLOR;
        taskBars.appendChild(separatorLine);
    });
};

// チャートの下の日付を設定する
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
    for (let day = 0; day < DAYS_RANGE; day++) {
        for (let hour = 0; hour < HOURS_PER_DAY; hour += 3) {
            const headerCell = document.createElement('div');
            const date = new Date(startDate.getTime());
            date.setDate(startDate.getDate() + day);
            date.setHours(hour, 0, 0, 0);

            headerCell.style.width = `${HOUR_TO_PX * INTERVAL_HOURS}px`;
            headerCell.style.textAlign = 'center';
            headerCell.style.position = 'relative';
            headerCell.style.boxSizing = 'border-box';
            headerCell.textContent = date.getHours() + ':00';

            chartHeader.appendChild(headerCell);
        };
    };
};

const nowLineElements = {};

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
    nowLineElement.style.left = `${CHART_LEFT_MARGIN + nowPx}px`;
    nowLineElement.style.top = '0';
    nowLineElement.style.height = `${taskBarsHeight}px`;
    nowLineElement.style.width = '2px';
    nowLineElement.style.backgroundColor = 'red';
    nowLineElement.style.zIndex = '2';

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

// チャートのフッターに日付の区切り線を描く
function drawFooterLine() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const chartFooter = document.getElementById('chart-footer');
    for (let day = 0; day < DAYS_RANGE; day++) {
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
        data = [{"default": 0}];
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

    // 現在のチャートをクリア
    while (taskBars.firstChild) taskBars.removeChild(taskBars.firstChild);
    while (chartFooter.firstChild) chartFooter.removeChild(chartFooter.firstChild);
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
    const chartFooter = document.getElementById('chart-footer');
    const taskSpacing = MARGIN * 2 + NAME_HEIGHT;  // タスク間のスペースを調整

    tasks = filterTasks(tasks);

    addTaskName(tasks); // タスク名を動的に追加
    addTaskBar(tasks); // タスクバーを追加

    // タスクバーの高さを設定
    const taskBarsHeight = tasks.length * taskSpacing;
    const verticalLines = document.querySelectorAll('.vertical-line');
    verticalLines.forEach(line => {
        line.style.height = `${taskBarsHeight}px`;
    });

    drawNowLine(taskBarsHeight);

    chartFooter.style.marginTop = `${taskBarsHeight}px`;

    drawFooterLine()

    const classList = ['task-bars', 'chart-header']
    
    classList.forEach(className => {
        startNowLineUpdates(taskBarsHeight, className);
    });
};

// 横スクロールの同期
document.addEventListener('DOMContentLoaded', function() {
    const headBarMain = document.querySelector('.head-bar-main');
    const contentMain = document.querySelector('.content-main');

    if (headBarMain && contentMain) {
        headBarMain.addEventListener('scroll', function() {
            contentMain.scrollLeft = headBarMain.scrollLeft;
        });

        contentMain.addEventListener('scroll', function() {
            headBarMain.scrollLeft = contentMain.scrollLeft;
        });
    }
});

// サイドバーの開閉
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-btn');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            toggleButton.textContent = sidebar.classList.contains('show') ? '<' : '>';
        });
    }
});


//---------------------------- 処理の実行-----------------------------------

document.addEventListener('DOMContentLoaded', async function () {
    console.time('Execution Time');
    await main();
    console.timeEnd('Execution Time');

});
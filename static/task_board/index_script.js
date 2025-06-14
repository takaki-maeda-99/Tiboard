// 定数の定義
const HOURS_PER_DAY = 24; // 1日あたりの時間
const HOUR_TO_PX = 15; // 1時間当たりのpx
const SECONDS_PER_HOUR = 1000 * 60 * 60 // 1時間当たりの秒数
const CHART_LEFT_MARGIN = 30; // チャートの左端の調整用
const MARGIN = 10;
const TASK_BAR_UNIT = 50; // タスクバーユニット全体の高さ
const BACK_GROUND_COLOR = '#913e0b80';
const SEPARATOR_THINNESS = 1;
const TASK_BAR_AND_NAME_HEIGHT = 45;
const MAX_WIDTH = 200;
const MAX_DUE_DATE_PX = 127; // タスクバーのラベルの幅は126.34px
const INTERVAL = 30; // 現在時間の更新間隔
const DEFAULT_DATE = new Date();


const taskBarFontSize = TASK_BAR_AND_NAME_HEIGHT * 0.35
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
    const taskContainer = document.getElementById('tasks');
    const body = document.querySelector('body');
    const taskNameList = document.createElement('ul');
    tasks.forEach(task => {
        const taskName = document.createElement('li');
        taskName.className = 'task-name dropdown';
        taskName.style.margin = `${MARGIN}px ${MARGIN}px ${MARGIN*2}px ${MARGIN}px`;
        taskName.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`;
        taskName.style.max_width = `${MAX_WIDTH}px`;

        const taskLink = document.createElement('a')
        taskLink.href = task.link;
        taskLink.target = '_blank';

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        span1.className = 'course-title';
        span2.className = 'coursework-title';
        span1.style.color = '#ffffff';
        span2.style.color = '#ffffff';

        if (task.submissionState == 'TURNED_IN') {
            span1.textContent = `✓${task.courseworkTitle}`;
            span2.textContent = `${task.courseTitle}`;
            span1.style.color = '#ffffff80';
            span2.style.color = '#ffffff80';
        } else {
            span1.textContent = task.courseworkTitle;
            span2.textContent = task.courseTitle;
        };

        span1.style.fontSize = `${taskBarFontSize}px`
        span2.style.fontSize = `${taskBarFontSize - 4}px`

        const detailPopup = document.createElement('div');
        detailPopup.className = 'task-detail-popup';
        detailPopup.textContent = task.name;
        detailPopup.style.fontSize = `${taskBarFontSize * 0.8}px`;

        setPopup(taskName, taskName, detailPopup);

        taskLink.appendChild(span1);
        taskLink.appendChild(document.createElement('br'));
        taskLink.appendChild(span2);
        taskName.appendChild(taskLink);
        taskNameList.appendChild(taskName);
        taskContainer.appendChild(taskNameList);
        body.appendChild(detailPopup); 
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
            return '#10802050';
        } else {
            return '#108020';
        }
    }
};

// タスクバーを追加
function addTaskBar(tasks) {
    const taskSpacing = MARGIN * 2 + TASK_BAR_AND_NAME_HEIGHT;
    const taskBars = document.getElementById('task-bars');

    drawVerticalLine()

    tasks.forEach((task, index) => {
        const taskBar = document.createElement('div');
        taskBar.className = 'task-bar';

        const taskStartPx = timeToPixels(task.startTime) + CHART_LEFT_MARGIN;
        const taskEndPx = timeToPixels(task.endTime) + CHART_LEFT_MARGIN;
        const taskBarWidth = taskEndPx - taskStartPx;

        taskBar.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`
        taskBar.style.left = `${taskStartPx}px`;
        taskBar.style.width = `${taskBarWidth}px`;
        const taskBarMargin = (TASK_BAR_UNIT - TASK_BAR_AND_NAME_HEIGHT) / 2
        taskBar.style.margin = `${taskBarMargin}px`
        taskBar.style.top = `${index * taskSpacing}px`;
        taskBar.style.backgroundColor = setTaskBarColor(task);

        const maxPx = daysRange * HOURS_PER_DAY * HOUR_TO_PX; // チャートの右端までのpx

        if (taskEndPx > maxPx) {
            taskBar.style.width = `${maxPx - taskStartPx}px`;
        };

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

        dueDateDiv.style.fontSize = `${taskBarFontSize}px`;
        dueDateDiv.style.margin = `${(TASK_BAR_AND_NAME_HEIGHT - taskBarFontSize - taskBarMargin * 2) / 2}px`;
        
        const taskNameOnLabel = document.createElement('div');
        taskNameOnLabel.className = 'label-task-name';

        const taskLink = document.createElement('a')
        const taskSpan = document.createElement('span')

        taskLink.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`
        taskLink.href = task.link;
        taskSpan.style.fontSize = `${taskBarFontSize}px`;
        taskSpan.target = '_blank';
        taskSpan.rel = 'noopener noreferrer';
        taskSpan.textContent = task.name
        taskSpan.style.fontSize = `${taskBarFontSize}px`;
        taskSpan.style.marginTop = `${(TASK_BAR_AND_NAME_HEIGHT - taskBarFontSize - taskBarMargin * 2) / 2}px`;
        taskSpan.style.maxWidth = `${taskBarWidth}px`;
        
        if (taskBarWidth < MAX_DUE_DATE_PX) {
            dueDateDiv.style.color = 'black';
            taskSpan.style.color = 'black';
        } else {
            dueDateDiv.style.color = 'white';
            taskSpan.style.color = 'white';
        };

        const contentMain = document.getElementById('content-main');
        const detailPopup = document.createElement('div');
        detailPopup.className = 'task-detail-popup';
        detailPopup.textContent = task.name;
        taskLink.target = '_blank';
        detailPopup.style.fontSize = `${taskBarFontSize}px`;
        contentMain.appendChild(detailPopup);

        setPopup(taskBar, taskNameOnLabel, detailPopup, true);

        taskBar.appendChild(dueDateDiv);
        taskLink.appendChild(taskSpan)
        taskNameOnLabel.appendChild(taskLink);
        taskBar.appendChild(taskNameOnLabel);
        taskBars.appendChild(taskBar);
    });
};

// ポップアップの表示・非表示の設定
function setPopup(parentClass, childClass, detailPopup, fitContent=false){
    
    childClass.addEventListener('mouseenter', () => {
        detailPopup.style.display = 'block';
        const rect = parentClass.getBoundingClientRect();
        detailPopup.style.left = `${rect.left - MARGIN}px`;
        detailPopup.style.top = `${rect.bottom + window.scrollY}px`;
        if (fitContent) detailPopup.style.width = `fit-content`;
    });

    childClass.addEventListener('mouseleave', () => {
        detailPopup.style.display = 'none';
    });
};

// チャートに日付を設定する
function createDateLabel(date, centerPx) {
    const label = document.createElement('div');
    label.className = 'date-label';
    label.style.left = `${centerPx}px`;
    label.style.width = '100px';
    label.style.height = 'fit-content';

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const dateText = date.toLocaleDateString('ja', { month: 'short', day: 'numeric' });
    const weekdayText = `(${weekdays[date.getDay()]})`;
    const labelText = dateText + weekdayText;

    label.textContent = labelText;

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
        dateLine.style.color = '#ffffff'
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
    const popups = document.getElementsByClassName('task-detail-popup');

    // 現在のチャートをクリア
    while (taskBars.firstChild) taskBars.removeChild(taskBars.firstChild);
    while (chartFooter.firstChild) chartFooter.removeChild(chartFooter.firstChild);
    while (chartHeader.firstChild) chartHeader.removeChild(chartHeader.firstChild);
    while (popups.length > 0) {
        popups[0].parentNode.removeChild(popups[0]);
    }
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

    const taskSpacing = MARGIN * 2 + TASK_BAR_AND_NAME_HEIGHT;  // タスク間のスペースを調整

    addTaskName(tasks); // タスク名を動的に追加
    addTaskBar(tasks); // タスクバーを追加

    // タスクバーの高さを設定
    const taskBarsHeight = tasks.length * taskSpacing;
    const verticalLines = document.querySelectorAll('.vertical-line');
    verticalLines.forEach(line => {
        line.style.height = `${taskBarsHeight}px`;
    });

    drawFooterLine()

    const classList = ['task-bars', 'head-bar-main']

    classList.forEach(className => {
        startNowLineUpdates(taskBarsHeight, className);
    });
};

// スクロールの同期
document.addEventListener('DOMContentLoaded', function() {
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

document.querySelectorAll('.task-name').forEach(task => {
    task.addEventListener('mouseenter', function() {
        const popup = this.querySelector('.task-detail-popup');
        const rect = this.getBoundingClientRect();
        
        // 画面の下部に近い場合はポップアップを上方向に表示
        if (rect.bottom + popup.offsetHeight > window.innerHeight) {
            popup.style.top = `${rect.top - popup.offsetHeight}px`;
        } else {
            popup.style.top = `${rect.bottom}px`;
        }

        popup.style.left = `${rect.left}px`;
        popup.style.display = 'block';
    });

    task.addEventListener('mouseleave', function() {
        const popup = this.querySelector('.task-detail-popup');
        popup.style.display = 'none';
    });
});

//---------------------------- 処理の実行-----------------------------------

document.addEventListener('DOMContentLoaded', async function () {
    await main();
});
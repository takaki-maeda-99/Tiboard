const HOURS_PER_DAY = 24;
const HOUR_TO_PX = 15;
const SECONDS_PER_HOUR = 1000 * 60 * 60
const CHART_LEFT_MARGIN = 24;
const TASK_BAR_UNIT = 50;
const SEPARATOR_THINNESS = 1;
const BACK_GROUND_COLOR = '#913e0b80';
const TASK_BAR_FONT_SIZE = 12;
const INTERVAL = 30;
const ADJUST_MARGIN = 5;

const taskBarFontSize = TASK_BAR_AND_NAME_HEIGHT * 0.35

let daysRange = 3;
let intervalHours = 3;

// 時間を区切る垂直な直線を引く
function drawVerticalLine(taskLength) {
    const taskSpacing = MARGIN * 2 + TASK_BAR_AND_NAME_HEIGHT;
    const taskBarsHeight = taskLength * taskSpacing;
    const taskBars = document.getElementById('vertical-lines');
    const chartHeader = document.getElementById('chart-header');
    for (let i = 0; i < chartHeader.children.length; i++) {
        const verticalLine = document.createElement('div');
        verticalLine.className = 'vertical-line';
        verticalLine.style.left = `${CHART_LEFT_MARGIN + i * HOUR_TO_PX * intervalHours - i}px`;
        verticalLine.style.width = `${SEPARATOR_THINNESS}px`;
        verticalLine.style.height = `${taskBarsHeight}px`;
        verticalLine.style.backgroundColor = BACK_GROUND_COLOR;
        taskBars.appendChild(verticalLine);
    };
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

// タスクバーの色を決める
function setTaskBarColor(task) {
    // 現在の時刻を取得
    const now = new Date();
    const endTime = new Date(task.endTime);
    const timeDifference = endTime - now; // タスクの終了時間と現在の時間差を計算
    // タスクバーの色を条件によって変更
    if (timeDifference < 0) {
        if (task.submissionState == 'TURNED_IN') {
            return '#e5000050'; // #ff0000のopacity: 0x50
        } else {
            return '#e50000';
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

// 横軸を生成
function makeHorizontalLabel() {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);
    const chartHeader = document.getElementById('chart-header');
    chartHeader.style.width = `${daysRange * HOURS_PER_DAY * HOUR_TO_PX}px`;
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
            timeText.textContent = date.getHours() + ':00';

            headerCell.appendChild(timeText);
            chartHeader.appendChild(headerCell);
        };
    };
};

// チャートに日付を設定する
function createDateLabel(date, day) {
    const label = document.createElement('div');
    label.className = 'date-label';
    label.style.left = `${CHART_LEFT_MARGIN + HOURS_PER_DAY * HOUR_TO_PX * day}px`;
    label.style.width = `${HOURS_PER_DAY * HOUR_TO_PX}px`;
    label.style.fontSize = `${TASK_BAR_FONT_SIZE}px`

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const dateText = date.toLocaleDateString('ja', { month: 'short', day: 'numeric' });
    const weekdayText = `(${weekdays[date.getDay()]})`;
    const labelText = dateText + weekdayText;

    label.textContent = labelText;

    return label;
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

        const leftPx = day * HOUR_TO_PX * HOURS_PER_DAY;
        const dateLabel = createDateLabel(date, day);
        chartFooter.appendChild(dateLabel);

        const dateLine = document.createElement('div');
        dateLine.className = 'date-line';
        dateLine.style.left = `${leftPx + CHART_LEFT_MARGIN}px`;
        chartFooter.appendChild(dateLine);
    };
};

// ページロード時に保存された時間間隔・表示日時を適用
window.addEventListener('load', function() {
    intervalHours = parseInt(localStorage.getItem('timeInterval'), 10) || 3;
    if (document.getElementById("time-interval")) document.getElementById('time-interval').value = intervalHours;
    daysRange = parseInt(localStorage.getItem('daysRange'), 10) || 3;
    if (document.getElementById("days-range")) document.getElementById('days-range').value = daysRange;
});

// ユーザーが選択した時間の表示間隔を時間軸に適用
if (document.getElementById("time-interval")){
    document.getElementById('time-interval').addEventListener('change', function() {
        const selectedInterval = parseInt(this.value, 10);
        localStorage.setItem('timeInterval', selectedInterval);
        location.reload();
    });
};

// ユーザーが選択した表示日数を適用
if (document.getElementById("days-range")){
    document.getElementById('days-range').addEventListener('change', function() {
        const selectedRange = parseInt(this.value, 10);
        localStorage.setItem('daysRange', selectedRange);
        location.reload();
    });
};

// スクロールの同期
document.addEventListener('DOMContentLoaded', function () {
    const chartHeader = document.getElementById('chart-header');
    const chartFooter = document.getElementById('chart-footer');
    const chart = document.getElementById('chart');

    if (chartHeader && chartFooter && chart) {
        let isSyncingScroll = false; // フラグを追加

        const syncScroll = (source) => {
            if (isSyncingScroll) return;
            isSyncingScroll = true;

            const scrollLeft = source.scrollLeft;

            if (source !== chartHeader) chartHeader.scrollLeft = scrollLeft; 
            if (source !== chartFooter) chartFooter.scrollLeft = scrollLeft;
            if (source !== chart) chart.scrollLeft = scrollLeft;

            isSyncingScroll = false;
        };

        chartHeader.addEventListener('scroll', function () {
            syncScroll(chartHeader);
        });

        chartFooter.addEventListener('scroll', function () {
            syncScroll(chartFooter);
        });

        chart.addEventListener('scroll', function () {
            syncScroll(chart);
        });
    }
});

// task = {"startTime": startTime, "endTime": endTime, "name": name, "link": link}
// tasks = [task1, task2, ...]
// endTimeが現在時刻よりも前のやつは渡さないようにしてほしい
// それか、現在時刻と同じ日のやつは未提出に気づけるから渡してもいいかも

// タスクバーを追加する関数
function addTaskBars(tasks) {
    const taskSpacing = MARGIN * 2 + TASK_BAR_AND_NAME_HEIGHT;
    const taskBars = document.getElementById('task-bars');

    const taskBarsHeight = tasks.length * taskSpacing;
    taskBars.style.height = `${taskBarsHeight}px`;

    drawVerticalLine(tasks.length)

    tasks.forEach((task, index) => {
        const taskBar = document.createElement('div');
        taskBar.className = 'task-bar';

        const taskStartPx = timeToPixels(task.startTime) + CHART_LEFT_MARGIN;
        const taskEndPx = timeToPixels(task.endTime) + CHART_LEFT_MARGIN;
        const taskBarWidth = taskEndPx - taskStartPx;

        taskBar.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`
        taskBar.style.left = `${taskStartPx}px`;
        taskBar.style.width = `${taskBarWidth}px`;
        if (index ===0) {
            taskBar.style.top = `${TASK_BAR_AND_NAME_HEIGHT * index + ADJUST_MARGIN}px`;
        } else {
            taskBar.style.top = `${(TASK_BAR_AND_NAME_HEIGHT + MARGIN * 2) * index + ADJUST_MARGIN}px`;
        };

        const taskBarMargin = (TASK_BAR_UNIT - TASK_BAR_AND_NAME_HEIGHT) / 2
        taskBar.style.margin = `${taskBarMargin}px`;
        taskBar.style.backgroundColor = setTaskBarColor(task);

        const maxPx = daysRange * HOURS_PER_DAY * HOUR_TO_PX; // チャートの右端までのpx

        if (taskEndPx > maxPx) {
            taskBar.style.width = `${maxPx - taskStartPx}px`;
        };

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
        dueDateDiv.style.color = 'white';
        taskSpan.style.color = 'white';

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

// タスクバー等を追加するための準備
function addTaskBarContainer(parentId, tasks) {
    const parentElm = document.getElementById(parentId);
    parentElm.style.overflow = 'auto';
    parentElm.style.whiteSpace = 'nowrap';
    parentElm.style.scrollbarWidth = 'none';
    parentElm.style.display = 'flex';

    const row1 = document.createElement('div');
    const row2 = document.createElement('div');
    const row3 = document.createElement('div');
    const row4 = document.createElement('div');
    const chartDiv = document.createElement('div');

    row1.className = 'row chart-header';
    row1.id = 'chart-header';
    row2.className = 'row chart-footer';
    row2.id = 'chart-footer';
    row3.className = 'row task-bars';
    row3.id = 'task-bars';
    row4.className = 'row vertical-lines';
    row4.id = 'vertical-lines';
    chartDiv.className = 'chart';
    chartDiv.id = 'chart';

    parentElm.style.display = 'block';
    parentElm.style.position = 'relative';

    const totalWidth = daysRange * HOURS_PER_DAY * HOUR_TO_PX;
    row1.style.width = `${totalWidth}px`;
    row2.style.height = `${TASK_BAR_FONT_SIZE*1.5}px`;
    row2.style.width = `${totalWidth}px`;
    row3.style.width = `${totalWidth}px`;


    row3.style.height = `${TASK_BAR_UNIT*tasks.length}`;

    parentElm.appendChild(row1);
    parentElm.appendChild(row2);
    chartDiv.appendChild(row3);
    chartDiv.appendChild(row4);
    parentElm.appendChild(chartDiv);

    makeHorizontalLabel();
    addTaskBars(tasks);
    drawFooterLine();

    const classList = ['task-bars', 'chart-header', "chart-footer"]

    const taskBarsHeight = tasks.length * (MARGIN * 2 + TASK_BAR_AND_NAME_HEIGHT);

    classList.forEach(classId => {
        startNowLineUpdates(taskBarsHeight, classId);
    })
};

const nowLineElements = {};

// 現在時刻の線を引く
function drawNowLine(taskBarsHeight, classId) {
    const element = document.getElementById(classId);

    // クラスに対応する古い線があれば削除
    if (nowLineElements[classId]) {
        nowLineElements[classId].remove();
    }

    const now = new Date();  // 現在の時間を取得
    const nowPx = timeToPixels(now.toISOString(), 20);  // 現在の時間をピクセルに変換

    const nowLineElement = document.createElement('div');  // 新しい線を作成
    nowLineElement.classList.add("now-time");
    nowLineElement.style.position = 'absolute';
    nowLineElement.style.top = '0';
    nowLineElement.style.bottom = '0';
    nowLineElement.style.padding = '0';
    nowLineElement.style.width = '2px';
    nowLineElement.style.backgroundColor = '#ff000099'; // red(0xff0000)のopacity: 0x99
    nowLineElement.style.zIndex = '100';
    nowLineElement.style.left = `${CHART_LEFT_MARGIN + nowPx}px`;
    
    if (classId === 'task-bars') {
        nowLineElement.style.height = `${taskBarsHeight}px`;  
    } else {
        nowLineElement.style.height = '100%';
    }

    // 新しい線を追加
    if (element) {
        element.appendChild(nowLineElement);
        // 新しい線をオブジェクトに保存
        nowLineElements[classId] = nowLineElement;
    }
};

// 一定間隔でdrawNowLineを更新する
function startNowLineUpdates(taskBarsHeight, classId) {
    drawNowLine(taskBarsHeight, classId);  // 最初に呼び出し
    setInterval(() => {
        drawNowLine(taskBarsHeight, classId);  // 毎秒線を更新
    }, 1000 * INTERVAL);  // interval秒ごとに更新
};

document.addEventListener('DOMContentLoaded', () => {
    const task1 = {"startTime": "2024-11-13T18:00:00Z", "endTime": "2024-11-29T21:00:00Z", "name": "test1", "link": "#"};
    const task2 = {"startTime": "2024-10-23T21:00:00Z", "endTime": "2024-10-29T12:00:00Z", "name": "test", "link": "#"};
    const task3 = {"startTime": "2024-10-24T00:00:00Z", "endTime": "2024-10-28T12:00:00Z", "name": "test", "link": "#"};
    const task4 = {"startTime": "2024-10-23T18:00:00Z", "endTime": "2024-10-29T18:00:00Z", "name": "test1", "link": "#"};
    const task5 = {"startTime": "2024-10-23T21:00:00Z", "endTime": "2024-10-30T12:00:00Z", "name": "test", "link": "#"};
    const task6 = {"startTime": "2024-10-24T00:00:00Z", "endTime": "2024-10-30T12:00:00Z", "name": "test", "link": "#"};
    const tasks = [task1, task2, task3, task4, task5, task6];
    addTaskBarContainer("gantt", tasks);
});
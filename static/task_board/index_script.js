// 定数の定義
const DAYS_RANGE = 3; // 表示する日数
const HOURS_PER_DAY = 24; // 1日あたりの時間
const HOUR_TO_PX = 20; // 1時間当たりのpx
const SECONDS_PER_HOUR = 1000 * 60 * 60 // 1時間当たりの秒数
const CHART_LEFT_MARGIN = 30; // チャートの左端の調整用
const SEPARATOR_MARGIN = 60;
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

let nowLineElement = null;  // グローバル変数で現在の線を管理

// データ取得の関数
async function fetchDatum(url) {
    try {
        // fetchリクエストを実行
        const response = await fetch(`/task_board/${url}`);

        // レスポンスをJSON形式に変換
        const data = await response.json();

        return data;

    } catch (error) {
        // エラーが発生した場合は、エラーメッセージをコンソールに表示
        console.error("Error:", error);

        return { error: error };
    }

};

async function fetchTaskBoard() {

    // 次にタスクボード
    const taskBoardData = await fetchDatum("get_task_board/");

    console.log("taskBoardData:", taskBoardData); // taskBoardData =[courses, coursework, submissionData]

    return [0, taskBoardData];
};

async function fetchUpdatedData() {
    const [courses, coursework] = await Promise.all([
        fetchDatum("update_courses/"),
        fetchDatum("update_coursework/"),
    ]);

    const submissionData = await fetchDatum("update_submission/");

    console.log("courses:", courses);
    console.log("coursework:", coursework);
    console.log("submission:", submissionData);

    return [courses, coursework, submissionData];
};

// タスクの作成
function makeTasks(courses, coursework, submissionData) {
    const tasks = coursework.map((work, index) => {
        const { course_id_id, coursework_title, due_time, update_time, id, link } = work;

        const startTime = new Date(update_time).toISOString();

        const targetDic = courses.find(item => item.id == course_id_id);
        const courseTitle = targetDic ? targetDic.course_name : "Unknown Course";

        const submission = submissionData.find(sub => sub.coursework_id_id == id) || [{"default": 0}];

        // submission 情報があれば追加
        const submissionState = submission.length > 0 ? submission.submission_state : null;

        return {
            name: `${courseTitle} ${coursework_title}`,
            startTime: startTime,
            endTime: due_time,
            sybmissionState: submissionState,
            link: link,
        };
    });
    const sortedTasks = tasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
    console.log("tasks:", sortedTasks);
    return sortedTasks;
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
        verticalLine.style.left = `${CHART_LEFT_MARGIN + i * SEPARATOR_MARGIN}px`;
        verticalLine.style.position = 'absolute';
        verticalLine.style.top = '0';
        verticalLine.style.bottom = '0';
        verticalLine.style.width = `${SEPARATOR_THINNESS}px`;
        verticalLine.style.backgroundColor = BACK_GROUND_COLOR;
        verticalLine.style.zIndex = '0';
        taskBars.appendChild(verticalLine);
    };
};

// brタグの追加
function addBrTag() {
    const tasksContainer = document.querySelector('.tasks');
    const brTag = document.createElement('div');
    brTag.className = 'br-tag';
    brTag.innerHTML = '<br>';
    brTag.style.marginTop = `${MARGIN}px`;
    brTag.style.marginBottom = `${MARGIN}px`;
    brTag.style.height = `${NAME_HEIGHT}px`;
    brTag.style.lineHeight = `${NAME_HEIGHT}px`;
    brTag.style.MAX_WIDTH = `${MAX_WIDTH}px`;
    tasksContainer.appendChild(brTag);
};

// タスク名の追加
function addTaskName(tasks) {
    tasks = filterTasks(tasks);
    tasks.forEach((task, index) => {
        const tasksContainer = document.querySelector('.tasks');
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
    const chartHeader = document.getElementById('chart-header');
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

            headerCell.style.width = `${SEPARATOR_MARGIN}px`;
            headerCell.style.textAlign = 'center';
            headerCell.style.position = 'relative';
            headerCell.style.boxSizing = 'border-box';
            headerCell.textContent = date.getHours() + ':00';

            chartHeader.appendChild(headerCell);
        };
    };
};

// 現在の時間の位置に線を引く関数
function drawNowLine(taskBarsHeight) {
    const taskBars = document.getElementById('task-bars');

    // 古い線があれば削除
    if (nowLineElement) {
        nowLineElement.remove();
    }

    const now = new Date();  // 現在の時間を取得
    const nowPx = timeToPixels(now.toISOString(), 20);  // 現在の時間をピクセルに変換

    nowLineElement = document.createElement('div');  // 新しい線を作成
    nowLineElement.style.position = 'absolute';
    nowLineElement.style.left = `${CHART_LEFT_MARGIN + nowPx}px`;
    nowLineElement.style.top = '0';
    nowLineElement.style.height = `${taskBarsHeight}px`;
    nowLineElement.style.width = '2px';
    nowLineElement.style.backgroundColor = 'red';
    nowLineElement.style.zIndex = '2';

    taskBars.appendChild(nowLineElement);
};

// 一定間隔でdrawNowLineを更新する
function startNowLineUpdates(taskBarsHeight) {
    drawNowLine(taskBarsHeight);  // 最初に呼び出し
    setInterval(() => {
        drawNowLine(taskBarsHeight);  // 毎秒線を更新
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

// チャートの初期化
async function initializationChart() {
    const [authData, taskBoardData] = await fetchTaskBoard();
    const courses = taskBoardData[0];
    const coursework = taskBoardData[1].flat();
    const submissionData = taskBoardData[2].flat();
    const tasks = makeTasks(courses, coursework, submissionData);
    drawChart(tasks);
};

// チャートの更新
async function updateChart(){
    let [updatedCourses, updatedCoursework, updatedSubmission] = await fetchUpdatedData();
    let updatedTasks;
    if (updatedSubmission.length !== 0) {
        updatedSubmission = updatedSubmission.flat();
    }
    console.log("updatedSubmission:", updatedSubmission);
    if (updatedCoursework.length !== 0) {
        updatedCoursework = updatedCoursework.flat();
    }
    if ("error" in updatedSubmission) {
        updatedSubmission = [{"default": 0}]
    }
    updatedTasks = makeTasks(updatedCourses, updatedCoursework, updatedSubmission);
    clearChart();
    drawChart(updatedTasks);
};

// チャートの削除
async function clearChart() {
    const chartHeader = document.getElementById('chart-header');
    const taskBars = document.getElementById('task-bars');
    const tasksContainer = document.querySelector('.tasks');
    const chartFooter = document.getElementById('chart-footer');

    // 現在のチャートをクリア
    while (taskBars.firstChild) taskBars.removeChild(taskBars.firstChild);
    while (tasksContainer.firstChild) tasksContainer.removeChild(tasksContainer.firstChild);
    while (chartHeader.firstChild) chartHeader.removeChild(chartHeader.firstChild);
    while (chartFooter.firstChild) chartFooter.removeChild(chartFooter.firstChild);
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
    const chartHeader = document.getElementById('chart-header');
    const tasksContainer = document.querySelector('.tasks');
    const chartFooter = document.getElementById('chart-footer');
    const taskSpacing = MARGIN * 2 + NAME_HEIGHT;  // タスク間のスペースを調整

    makeHorizontalLabel()

    tasks = filterTasks(tasks);

    addBrTag(); // 改行してタスク名の行の高さを調節
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

    startNowLineUpdates(taskBarsHeight);
};

// 更新中の処理
let dotCount = 0;

function animateDots() {
    const dotsElement = document.getElementById('dots');
    dotCount = (dotCount + 1) % 4;  // dotCountを0～3の範囲でループ
    const dots = ".".repeat(dotCount);
    dotsElement.textContent = dots;
}

let loadingAnimationInterval;

// アニメーションを表示
function showLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'block';

    // アニメーションを開始
    loadingAnimationInterval = setInterval(animateDots, 400);
}

// アニメーションを非表示
function hideLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    loadingMessage.style.display = 'none';

    // アニメーションを停止
    clearInterval(loadingAnimationInterval);
}

// 処理の実行
document.addEventListener('DOMContentLoaded', async function () {
    showLoadingMessage();
    await initializationChart();
    await updateChart();
    hideLoadingMessage();
});
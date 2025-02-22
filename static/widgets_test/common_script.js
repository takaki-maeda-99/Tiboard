// 共通の関数や定数
const MARGIN = 10;
const TASK_BAR_AND_NAME_HEIGHT = 45;
const taskBarFontSize = TASK_BAR_AND_NAME_HEIGHT * 0.35

// ポップアップの表示・非表示の設定
function setPopup(parentClass, childClass, detailPopup, fitContent=false){
    
    childClass.addEventListener('mouseenter', () => {
        detailPopup.style.display = 'block';
        const rect = parentClass.getBoundingClientRect();
        detailPopup.style.left = `${rect.left - MARGIN}px`;
        detailPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        if (fitContent) detailPopup.style.width = `fit-content`;
    });

    childClass.addEventListener('mouseleave', () => {
        detailPopup.style.display = 'none';
    });
};

// データ取得用関数
async function fetchDatum(url, useCache=false) {
    if (useCache) { 
        const cachedData = localStorage.getItem(COURSE_STORAGE_KEY);
        if (cachedData) {
            console.log("Using cached course data");
            return JSON.parse(cachedData);
        }
    }

    console.log("Fetching courses from server...");
    
    const response = await fetch(`/task_board/${url}`);
    const data = await response.json();

    // キャッシュに保存
    if (useCache) {
        localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(data));
    }
    return data;
}

// スクロールの同期
function syncScroll() {
    const upMiddle = document.getElementById('up-left');
    const upRight = document.getElementById('gantt');

    if (upMiddle && upRight) {
        upMiddle.addEventListener('scroll', function () {
            upRight.scrollTop = upMiddle.scrollTop;
        });

        upRight.addEventListener('scroll', function () {
            upMiddle.scrollTop = upRight.scrollTop;
        });
    }
}

// メイン部分
document.addEventListener('DOMContentLoaded', async () => {
    const sidebarParentId = 'up-left';
    const taskbarParentId = "up-middle";
    const timeTableParentId = "up-right";
    
    // task内の必要な情報を配列にしたリストを作る+期限の近い順にソート
    function makeTaskDic(tasks) {
        let taskList = [];
        tasks.forEach(task => {
            taskDic = {"startTime": task.startTime, "endTime": task.endTime, "name": task.name, "courseTitle": task.courseTitle, "courseworkTitle": task.courseworkTitle, "link": task.link, "submissionState": task.submissionState};
            taskList.push(taskDic);
        });
        
        taskList.sort((a, b) => {
            return new Date(a.endTime) - new Date(b.endTime);
        }); 
        return taskList;
    }

    let tasks = await fetchDatum("get_tasks/");
    tasks = makeTaskDic(tasks);

    // タスクバーを作る処理
    const gantt = document.createElement("div");
    const parentDiv = document.getElementById(taskbarParentId);

    gantt.id = "gantt";

    parentDiv.appendChild(gantt);

    addTaskBarContainer("gantt", tasks);
    addTaskBars(tasks);

    syncScroll()

    // サイドバーを作る処理
    function makeSidebar(tasks) {
        let sidebarTaskList = [];

        tasks.forEach(task => {
            taskDic = {"mainText": task.courseworkTitle, "subText": task.courseTitle, "link": task.link, "submissionState": task.submissionState ? task.submissionState : null};
            sidebarTaskList.push(taskDic);
        });
        console.log("sidebarTaskList:", sidebarTaskList);
        createSidebar(sidebarParentId, sidebarTaskList, "Tasks");
    }

    // 更新後のタスクバーとサイドバーの表示
    async function makeNewTaskbarAndTimeTable(classNames) {
        tasks = await fetchDatum("update_submission/");
        tasks = makeTaskDic(tasks);
        
        clearChart(classNames)
        addTaskBars(tasks)

        makeSidebar(tasks)

    }

    makeNewTaskbarAndTimeTable(['vertical-line', 'task-bar', 'elemnts'])

    // 時間割を作る処理
    try {
        const data = await fetchDatum("update_courses/", true);
        makeTimeTable(data, timeTableParentId);
    } catch (error) {
        console.error("Error fetching courses:", error);
    }

    const lastUpdateKey = "lastCourseUpdate";
    const lastUpdate = localStorage.getItem(lastUpdateKey);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1日1回

    if (!lastUpdate || Date.now() - new Date(lastUpdate).getTime() > oneDayInMilliseconds) {
        await updateCachedCourses("update_courses/");
        localStorage.setItem(lastUpdateKey, new Date().toISOString());
    }

    
});
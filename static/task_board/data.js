async function fetchDatum(url) {
    const response = await fetch(`/task_board/${url}`);

    const data = await response.json();

    return data;
};

async function get_task_board() {
    const taskBoardData = await fetchDatum("get_task_board/");

    return taskBoardData;
};

async function update_task_board() {
    const [taskBoardData, submission] = await Promise.all([
        fetchDatum("get_task_board/"),
        fetchDatum("update_submission/")
    ]);

    const courses = taskBoardData[0];
    const coursework = taskBoardData[1];

    return [courses, coursework, submission];
};

async function main() {

    makeHorizontalLabel()

    get_task_board().then((taskBoardData) => {
        const courses = taskBoardData[0];
        const coursework = flatData(taskBoardData[1]);
        const submission = flatData(taskBoardData[2]);

        console.log("taskBoardData:", taskBoardData); // taskBoardData =[courses, coursework, submissionData]

        const tasks = makeTasks(courses, coursework, submission);
        drawChart(tasks);
    });

    update_task_board().then((taskBoardData) => {
        const courses = taskBoardData[0];
        const coursework = flatData(taskBoardData[1]);
        const submission = flatData(taskBoardData[2]);

        if ("error" in submission) {
            submission = [{ "default": 0 }]
        }

        console.log("updatedSubmission:", submission);

        let updatedTasks = makeTasks(courses, coursework, submission);
        clearChart();
        drawChart(updatedTasks);
    });

    fetchDatum("get_tasks/").then((tasks) => {
        console.log("renew_tasks:", tasks);
    });
}

function makeTasks(courses, coursework, submissionData) {
    // 期限が過ぎているものは除外
    coursework = coursework.filter(work => work.due_time > new Date().toISOString());

    const tasks = coursework.map(work => {
        const { course_id_id, coursework_title, due_time, update_time, id, link } = work;

        const startTime = new Date(update_time).toISOString();

        const targetDic = courses.find(item => item.id == course_id_id);
        const courseTitle = targetDic ? targetDic.course_name : "Unknown Course";

        const submission = submissionData.find(sub => sub.coursework_id_id == id) || [{ "default": 0 }];

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

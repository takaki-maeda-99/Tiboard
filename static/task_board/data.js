async function fetchDatum(url) {
    const response = await fetch(`/task_board/${url}`);

    const data = await response.json();

    return data;
};

async function main() {
    intervalHours = parseInt(localStorage.getItem('timeInterval'), 10) || 3;
    daysRange = parseInt(localStorage.getItem('daysRange'), 10) || 3;


    fetchDatum("get_tasks/").then((tasks) => {
        clearChart();
        makeHorizontalLabel();
        const sortedTasks = tasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        drawChart(sortedTasks);
    });

    fetchDatum("update_submission/").then((tasks) => {
        clearChart();
        makeHorizontalLabel();
        const sortedTasks = tasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        drawChart(sortedTasks);
        console.log("submission:", tasks);
    });

    fetchDatum("update_coursework/").then((tasks) => {
        clearChart();
        makeHorizontalLabel();
        const sortedTasks = tasks.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        drawChart(sortedTasks);
        console.log("coursework:", tasks);
    });

    fetchDatum("update_courses/").then((courses) => {
        console.log("courses:", courses);
    });
}
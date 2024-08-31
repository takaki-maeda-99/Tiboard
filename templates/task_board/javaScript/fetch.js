async function fetchData(url) {
    try {
        // fetchリクエストを実行
        const response = await fetch(`/task_board/${url}`);

        // レスポンスをJSON形式に変換
        const data = await response.json();

    } catch (error) {
        // エラーが発生した場合は、エラーメッセージをコンソールに表示
        console.error("Error:", error);
    }
}

const user = fetchData("auth/");
const courses = fetchData("update_course/");
const course_work = fetchData("update_course_work/");

console.log(user);
console.log(courses);
console.log(course_work);


// チャンネル名の配列
const submissions = [
    { title: '課題1', cousework_id: 1, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
    { title: '課題2', cousework_id: 2, link: '#' },
];

// チャンネルリストを生成する関数
function generateSubmissionList() {
    const submissionListElement = document.getElementById('submissionList');

    // 配列をループして、チャンネルをリストに追加
    submissions.forEach((submission) => {
        const li = document.createElement('li');
        li.textContent = submission.title;

        // チャンネルクリック時のイベントを追加
        li.addEventListener('click', () => {
            window.location.href = submission.link;
        });

        submissionListElement.appendChild(li);
    });
}

// ページ読み込み時にチャンネルリストを生成
document.addEventListener('DOMContentLoaded', generateSubmissionList);


const rankingData = [
    { rank: 1, name: 'Player1', score: 100 },
    { rank: 2, name: 'Player2', score: 90 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
    { rank: 3, name: 'Player3', score: 80 },
];

// ランキングをテーブルに追加する関数
function addRanking(data) {
    const tbody = document.getElementById('ranking-body');
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.rank}</td>
            <td>${item.name}</td>
            <td>${item.score}</td>
        `;
        tbody.appendChild(row);
    });
}

const userData = { rank: 2, name: 'Player2', score: 90, max_score: 100 };

function updateStatus(user) {
    const statusDiv = document.getElementById('status');
    statusDiv.innerHTML = `Rank: ${user.rank}, Name: ${user.name}, Score: ${user.score}/${user.max_score}`;
}

// ランキングデータを追加
addRanking(rankingData);

// ステータスを更新
updateStatus(userData);


// チャンネル名の配列
const channels = ["一般", "ゲーム", "音楽", "雑談", "プログラミング", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート", "アート"];

// チャンネルリストを生成する関数
function generateChannelList() {
    const channelListElement = document.getElementById('channelList');

    // 配列をループして、チャンネルをリストに追加
    channels.forEach((channel) => {
        const li = document.createElement('li');
        li.classList.add('channel-item');
        li.textContent = channel;

        // チャンネルクリック時のイベントを追加
        li.addEventListener('click', () => {
            displayChannelContent(channel);
        });

        channelListElement.appendChild(li);
    });
}

// 選択されたチャンネルの内容を表示する関数
function displayChannelContent(channelName) {
    const mainContentElement = document.getElementById('mainContent');
    mainContentElement.innerHTML = `<h4>${channelName}</h4><p>${channelName}の内容がここに表示されます。</p>`;
}

// ページ読み込み時にチャンネルリストを生成
document.addEventListener('DOMContentLoaded', generateChannelList);

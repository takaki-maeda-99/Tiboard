
var thread_id = 0;

function createThread(thread) {
    const threadElement = document.getElementById("chat-container");
    threadElement.innerHTML = ''; // clear the chat container

    const threadHeader = document.createElement('h2');
    const threadContent = document.createElement('ul');
    threadElement.appendChild(threadHeader);
    threadElement.appendChild(threadContent);
    threadHeader.textContent = thread.name;

    thread_id = thread.id; 

    thread.posts.forEach(post => {
        threadContent.appendChild(createPost(post));
    });

    contentMain = document.getElementById('content-main');

    contentMain.scrollBy({
        top: 10000, // 縦方向にスクロール
        left: 0,  // 横方向にはスクロールしない
        behavior: 'smooth' // スムーズなスクロール
    });
}

function createPost(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-div';

    const icon = document.createElement('img');
    // icon.src = post.icon;
    icon.className = 'icon';
    postDiv.appendChild(icon);
    
    const postDiv2 = document.createElement('div');
    postDiv.appendChild(postDiv2);

    const postInfo = document.createElement('div');
    postInfo.className = 'post-info';
    postDiv2.appendChild(postInfo);

    const userName = document.createElement('h5');
    userName.textContent = post.author.username;
    postInfo.appendChild(userName);

    const date = document.createElement('h6');
    date.textContent = post.created_at;
    postInfo.appendChild(date);

    const postId = document.createElement('h6');
    postId.textContent = "postid:" + post.id;
    postInfo.appendChild(postId);

    const replyButton = document.createElement('button');
    postInfo.appendChild(replyButton);

    const replyIcon = document.createElement('i');
    replyIcon.className = 'bi bi-reply-fill';
    replyButton.appendChild(replyIcon);
    
    if (post.reply_to) {
        const replyTo = document.createElement('a');
        replyTo.className = 'reply-to';
        replyTo.textContent = "≫" + post.reply_to.id;
        replyTo.href = '#';
        postDiv2.appendChild(replyTo);
    }

    const contents = document.createElement('div');
    contents.className = 'contents';
    postDiv2.appendChild(contents);

    const contentsText = document.createElement('p');
    contentsText.textContent = post.content;
    contents.appendChild(contentsText);

    replyButton.addEventListener('click', () => {
        const replyTo = document.getElementById('reply-to');
        replyTo.style.display = 'block';
        const replyToPost = document.getElementById('reply-to-post');
        replyToPost.textContent = post.id;
    });

    return postDiv;
}

document.addEventListener('DOMContentLoaded', () => {
        
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const contentMain = document.getElementById('content-main');
    const inputContainerBackarea = document.getElementById('input-container-backarea');

    var beforeHeight = messageInput.scrollHeight;

    // メッセージ入力欄の高さを自動調整
    messageInput.addEventListener('input', () => {
        messageInput.style.height = '24px';
        messageInput.style.height = `${messageInput.scrollHeight}px`;
        inputContainerBackarea.style.height = `${messageInput.scrollHeight + 150 -24}px`;

        // 高さの変化量を計算してスクロール
        const diff = messageInput.scrollHeight - beforeHeight;

        contentMain.scrollBy({
            top: diff, // 縦方向にスクロール
            left: 0,  // 横方向にはスクロールしない
            behavior: 'smooth' // スムーズなスクロール
        });

        beforeHeight = messageInput.scrollHeight;
    });

    // 送信ボタンのクリックイベント
    sendButton.addEventListener('click', () => {
        const messageText = messageInput.value.trim(); // メッセージの内容を取得
        messageInput.value = ''; // メッセージ入力欄を空にする
        messageInput.style.height = '24px'; // メッセージ入力欄の高さをリセット
        inputContainerBackarea.style.height = '150px'; // メッセージ入力欄の高さをリセット
        beforeHeight = 16;

        const replyTo = document.getElementById('reply-to'); // 返信先の表示を消す
        replyTo.style.display = 'none';
        const replyToPost = document.getElementById('reply-to-post'); // 返信先のユーザー名を取得

        const post_data = { 
            "thread": thread_id,
            "content": messageText,
            "reply_to": replyToPost.innerText,
            "author_id": "anonymous",
        };

        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch(post_url, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken, // CSRFトークンをヘッダーに追加
            },
        body: JSON.stringify(post_data), // データを JSON 文字列に変換
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json(); // レスポンスを JSON としてパース
        })
        .then((responseData) => {
            fetch(get_thread_url.replace("0", thread_id)).then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json(); // レスポンスを JSON としてパース
            })
            .then((responseData) => {
                createThread(responseData.thread);
            })
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }); 
});

fetch("thread_list/").then(response => response.json()).then(data => {
    threads = data.threads;
    const dics = threads.map(thread => {
        return {
            "mainText": thread.name,
            "subText": thread.description,
            "link": get_thread_url.replace("0", thread.id)
        };
    });
    createSidebar("sideber", dics, "Threads", true);
});
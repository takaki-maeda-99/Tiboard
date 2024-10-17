document.addEventListener('DOMContentLoaded', function() {
    const replyButtons = document.querySelectorAll('.reply-btn');
    const replyContent = document.getElementById('reply-content');
    const attatchFileInput = document.getElementById('file-upload');
    const postIdInput = document.getElementById('post-id-input');
    const replyForm = document.getElementById('reply-form');
    const errorMessage = document.createElement('p'); // エラーメッセージ用の要素を作成

    errorMessage.style.color = 'red'; // エラーメッセージのスタイルを設定

    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postId = button.getAttribute('data-postid');
            postIdInput.value = postId;

            // 既存の内容を保持しつつ、返信用のテキストを追加
            replyContent.focus(); // テキストエリアにフォーカス
        });
    });

    replyForm.addEventListener('submit', function(event) {
        if (replyContent.value.trim() === '' && attatchFileInput.files.length === 0) {
            event.preventDefault(); // フォームの送信を防ぐ
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = 'テキストを入力、またはファイルを添付してください。';
            errorMessage.style.display = 'block';
        } else {
            document.getElementById('error-message').style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('reply-content');

    
    // テキストエリアのリサイズとボタンの高さ調整
    textarea.addEventListener('input', function () {
        textarea.style.height = '40px';
        if (textarea.scrollHeight <= 40) {
            textarea.style.height = '40px';
        } else if (textarea.scrollHeight > 40 && textarea.scrollHeight <= 110) {
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            textarea.style.height = '110px'; // 最大高さ110px
        }
    });

    
  
});

document.addEventListener('DOMContentLoaded', function () {
    const replyButtons = document.querySelectorAll('.reply-btn');
    const replyToPost = document.getElementById('reply-to-post');

    replyButtons.forEach(button => {
        button.addEventListener('click', function () {
            const postContent = button.getAttribute('data-postcontent');

            // 削除ボタンの作成
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.marginLeft = '10px';
            closeButton.style.cursor = 'pointer';

            // 削除ボタンのクリックイベント
            closeButton.addEventListener('click', function () {
                replyToPost.innerHTML = ''; // メッセージを消す
            });

            // メッセージを表示し、削除ボタンを追加
            replyToPost.innerHTML = `<strong>Replying to:</strong> ${postContent}`;
            replyToPost.appendChild(closeButton);

            
        });
    });
});




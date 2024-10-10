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
            const replyText = `>>${postId}\n`;
            replyContent.value += replyText;
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

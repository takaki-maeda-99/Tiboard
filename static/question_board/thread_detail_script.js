document.addEventListener('DOMContentLoaded', function() {
    const replyButtons = document.querySelectorAll('.reply-btn');
    const replyContent = document.getElementById('reply-content');
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
        if (replyContent.value.trim() === '') {
            event.preventDefault(); // フォームの送信を防ぐ
            if (!document.contains(errorMessage)) {
                replyForm.appendChild(errorMessage);
            }
            errorMessage.textContent = 'Reply content cannot be empty.';
        } else {
            if (document.contains(errorMessage)) {
                replyForm.removeChild(errorMessage);
            }
        }
    });
});

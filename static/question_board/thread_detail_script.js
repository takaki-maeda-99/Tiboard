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
        } else{
            document.getElementById('error-message').style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('reply-content');
    const textareaContainer = document.getElementById('textarea-container');

    function getOffsetHeight(element) {
        if (!element) {
            // 要素が存在しない場合は0を返す
            return 0;
        }
        if (window.getComputedStyle(element).display === 'none') {
            // 要素が表示されていない場合は0を返す
            return 0;
        } else {
            // 要素が表示されている場合はoffsetHeightを返す
            return element.offsetHeight;
        }
    }

    function adjustTextareaPosition() {
        const replyContentHeight = textarea.offsetHeight;
        const previewContainerHeight = getOffsetHeight(document.getElementById('file-preview-container'));
        // input-space (reply-content) の高さに基づいて myTextarea の bottom を設定
        const previewContainer = document.getElementById('file-preview-container')
        previewContainer.style.bottom = (replyContentHeight + 40) + 'px';
        textareaContainer.style.bottom = (replyContentHeight + previewContainerHeight + 35) + 'px'; // 高さに応じて myTextarea のbottom位置を変更
        
    }

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
        adjustTextareaPosition();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const replyButtons = document.querySelectorAll('.reply-btn');
    const myTextarea = document.getElementById('myTextarea');
    const postIdInput = document.getElementById('post-id-input');
    const replyToPostDiv = document.getElementById('reply-to-post');
    const textareaContainer = document.getElementById('textarea-container');
    const clearBtn = document.getElementById('clear-btn');
    const replyContent = document.getElementById('reply-content');
    const replyAccount = document.getElementById('reply-account-info')

    function autoResizeMyTextarea(textarea) {
        textarea.style.height = '40px'; 
        if (textarea.scrollHeight <= 40) {
            textarea.style.height = '40px'; 
        } else if (textarea.scrollHeight > 40 && textarea.scrollHeight <= 110) {
            textarea.style.height = textarea.scrollHeight + 'px';
        } else {
            textarea.style.height = '110px'; 
        }
    }

    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postContent = button.getAttribute('data-postcontent');
            const postId = button.getAttribute('data-postid');
            const postHeader = button.closest('.post-news').querySelector('.post-header'); // post-header要素を取得
            const postHeaderHTML = postHeader.outerHTML; // post-headerのHTMLを取得
            const previewContainer = document.getElementById('file-preview-container')

            replyAccount.innerHTML = `${postHeaderHTML}`;
                    
            myTextarea.value = postContent; 

            postIdInput.value = postId;

            textareaContainer.style.display = 'block';
            replyToPostDiv.style.display = 'block';

            replyContent.classList.add('active-reply');
            previewContainer.classList.remove('active-preview');
            autoResizeMyTextarea(myTextarea);
            adjustTextareaPosition(); 

        });
    });

    function getOffsetHeight(element) {
        if (!element) {
            return 0;
        }
        if (window.getComputedStyle(element).display === 'none') {
            return 0;
        } else {
            return element.offsetHeight;
        }
    }

    function adjustTextareaPosition() {
        const replyContentHeight = replyContent.offsetHeight;
        const previewContainerHeight = getOffsetHeight(document.getElementById('file-preview-container'));
        const previewContainer = document.getElementById('file-preview-container')
        previewContainer.style.bottom = (replyContentHeight + 40) + 'px';
        textareaContainer.style.bottom = (replyContentHeight + previewContainerHeight + 35) + 'px'; 
        
    }

    

    function adjustTextareaStyle() {
        const previewContainer = document.getElementById('file-preview-container');
        const previewContainerHeight = previewContainer.offsetHeight;

        if (previewContainerHeight > 0) {
            replyContent.classList.add('active-reply');
            previewContainer.classList.add('active-preview')
        } else {
            replyContent.classList.remove('active-reply');
            previewContainer.classList.remove('active-preview')
        }
    }

    clearBtn.addEventListener('click', function() {
        myTextarea.value = '';
        postIdInput.value = '';
        replyToPostDiv.innerHTML = '';
        textareaContainer.style.display = 'none';
        replyToPostDiv.style.display = 'none';
        adjustTextareaStyle()
    });
});



document.getElementById('file-upload').addEventListener('change', function() {
    const files = Array.from(this.files); // 新しく選択されたファイルを配列に変換
    const previewContainer = document.getElementById('file-preview-container');
    const dataTransfer = new DataTransfer(); // DataTransferオブジェクトの作成
    const textareaContainer = document.getElementById('textarea-container');
    const replyContent = document.getElementById('reply-content');
    const fileInput = document.getElementById('file-upload');

    

    files.forEach((file, index) => {
        const existingPreviews = Array.from(previewContainer.children);
        const fileAlreadyExists = existingPreviews.some((preview) => {
            const fileName = preview.querySelector('p')?.textContent;
            return fileName === file.name;
        });

        if (fileAlreadyExists) return;

        const reader = new FileReader();

        const filePreview = document.createElement('div');
        filePreview.classList.add('file-preview');
        filePreview.style.display = 'flex';
        filePreview.style.alignItems = 'center';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.style.color = 'white';
        deleteButton.style.background = 'none';
        deleteButton.style.fontSize = '30px';
        deleteButton.style.border = 'none';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.marginLeft = 'auto';
        deleteButton.style.marginBottom = '5px';
        deleteButton.style.marginRight = '5px';

        const fileName = document.createElement('p');
        fileName.textContent = file.name;
        fileName.style.margin = '0px';

        reader.onload = function(e) {
            // 画像の場合
            if (file.type.startsWith('image/')) {
                const imagePreview = document.createElement('img');
                imagePreview.src = e.target.result;
                imagePreview.style.width = '16px';
                imagePreview.style.height = '16px';
                imagePreview.style.marginRight = '10px';
                filePreview.appendChild(imagePreview); // 画像プレビューを追加
            } 
            // PDFの場合
            else if (file.type === 'application/pdf') {
                const pdfIcon = document.createElement('svg'); // PDF用のSVGアイコン
                pdfIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-pdf-fill" viewBox="0 0 16 16">
                    <path d="M5.523 10.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.035 21.035 0 0 0 .5-1.05 11.96 11.96 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.888 3.888 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 4.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"/>
                    <path fill-rule="evenodd" d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm.165 11.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.64 11.64 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.707 19.707 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"/>
                </svg>`;
                pdfIcon.style.width = '16px';
                pdfIcon.style.height = '16px';
                pdfIcon.style.marginRight = '10px';
                filePreview.appendChild(pdfIcon); // PDFアイコンを追加
            }

            filePreview.appendChild(fileName); // ファイル名を追加
            filePreview.appendChild(deleteButton); // 削除ボタンを追加
            previewContainer.appendChild(filePreview); // プレビューコンテナに追加

            // DataTransferにファイルを追加
            dataTransfer.items.add(file);
        };

        reader.readAsDataURL(file); // ファイルをDataURLとして読み込む
        
        deleteButton.addEventListener('click', function() {
            filePreview.remove(); 
            const newFiles = Array.from(document.getElementById('file-upload').files); // ここで現在のファイルリストを取得
            newFiles.splice(index, 1); 
            updateFileInput(newFiles); 
            const newDataTransfer = new DataTransfer();
            newFiles.forEach(file => newDataTransfer.items.add(file));

            // 5. input要素に新しいファイルリストを設定
            fileInput.files = newDataTransfer.files;

            // 削除後のファイルリストを表示
            console.log('Files after deletion:', newFiles);
            
            if (previewContainer.children.length === 0) {
                previewContainer.style.display = 'none'; 
            }
            updateFileInput(newFiles); 
            adjustTextareaStyle()
            adjustTextareaPosition()
        });

        function updateFileInput(newFiles) {
            const updatedDataTransfer = new DataTransfer();
            newFiles.forEach(file => updatedDataTransfer.items.add(file)); // 削除されていないファイルを追加
            document.getElementById('file-upload').files = updatedDataTransfer.files; // inputのファイルリストを更新
        }

    });

    function adjustTextareaStyle() {
        const previewContainer = document.getElementById('file-preview-container');
        const previewContainerHeight = previewContainer.offsetHeight;
        const replyContent = document.getElementById('reply-content');
        const myTextarea = document.getElementById('myTextarea');
        const myTextareaHeight = myTextarea.offsetHeight;

    // 高さを確認する
        console.log('Preview container height:', previewContainerHeight);

        // プレビューがある場合、textareaの位置を調整
        if (previewContainerHeight > 0 || myTextareaHeight > 0) {
            replyContent.classList.add('active-reply');
            console.log('active-reply added');
        } else {
            replyContent.classList.remove('active-reply');
            console.log('active-reply removed');
        }
    }

    
    
    
    replyContent.classList.add('active-reply');
    if (files.length > 0) {
        previewContainer.style.display = 'flex'; // コンテナを表示
        const textareaContainer = document.getElementById('textarea-container');
        if (textareaContainer.offsetHeight > 0) {
            previewContainer.classList.remove('active-preview')
            adjustTextareaPosition()
        } else {
            previewContainer.classList.add('active-preview')
        }
    }

    function getOffsetHeight(element) {
        if (!element) {
            // 要素が存在しない場合は0を返す
            return 0;
        }
        if (window.getComputedStyle(element).display === 'none') {
            // 要素が表示されていない場合は0を返す
            return 0;
        } else {
            // 要素が表示されている場合はoffsetHeightを返す
            return element.offsetHeight;
        }
    }

    function adjustTextareaPosition() {
        const replyContent = document.getElementById('reply-content');
        const replyContentHeight = replyContent.offsetHeight;
        const previewContainerHeight = getOffsetHeight(document.getElementById('file-preview-container'));
        // input-space (reply-content) の高さに基づいて myTextarea の bottom を設定const previewContainer = document.getElementById('file-preview-container')
        previewContainer.style.bottom = (replyContentHeight + 40) + 'px';
        textareaContainer.style.bottom = (replyContentHeight + previewContainerHeight + 35) + 'px'; // 高さに応じて myTextarea のbottom位置を変更
        
    }
});

function downloadFile(url, filename) {
    console.log('Download URL:', url);  // URLを確認するために追加
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}






    





// 返信ボタンの初期化
function initReplyButtons() {
    const replyButtons = document.querySelectorAll('.reply-btn');
    const postIdInput = document.getElementById('post-id-input');
    const textareaContainer = document.getElementById('textarea-container');
    const replyToPostDiv = document.getElementById('reply-to-post');
    const myTextarea = document.getElementById('myTextarea');
    const replyAccount = document.getElementById('reply-account-info');
    const replyContent = document.getElementById('reply-content');

    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const postContent = button.getAttribute('data-postcontent');
            const postId = button.getAttribute('data-postid');
            const postHeader = button.closest('.post-news').querySelector('.post-header'); // post-header要素を取得
            const postHeaderHTML = postHeader.outerHTML; // post-headerのHTMLを取得
            const previewContainer = document.getElementById('file-preview-container')
            previewContainer.classList.remove('active-preview');
            textareaContainer.style.display = 'block';
            replyToPostDiv.style.display = 'block';
            replyAccount.innerHTML = `${postHeaderHTML}`;
            myTextarea.value = postContent; 
            postIdInput.value = postId;

            replyContent.classList.add('active-reply');
            
            autoResizeMyTextarea(myTextarea);
            adjustTextareaPosition(); 
            adjustTextareaStyle()
            
        });
    });

    // クリアボタンの設定
    const clearBtn = document.getElementById('clear-btn');
    clearBtn.addEventListener('click', function () {
        postIdInput.value = '';
        replyToPostDiv.innerHTML = '';
        textareaContainer.style.display = 'none';
        replyToPostDiv.style.display = 'none';
        myTextarea.value = '';
        adjustTextareaStyle()
    });
}

// 返信フォームのバリデーション
function initReplyFormValidation() {
    const replyForm = document.getElementById('reply-form');
    const replyContent = document.getElementById('reply-content');
    const fileInput = document.getElementById('file-upload');
    const errorMessage = document.getElementById('error-message');

    replyForm.addEventListener('submit', function (event) {
        if (replyContent.value.trim() === '' && fileInput.files.length === 0) {
            event.preventDefault();
            errorMessage.textContent = 'テキストを入力、またはファイルを添付してください。';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.style.display = 'none';
        }
    });
}

function adjustTextareaPosition() {
    const replyContent = document.getElementById('reply-content');
    const replyContentHeight = replyContent.offsetHeight;
    const previewContainerHeight = getOffsetHeight(document.getElementById('file-preview-container'));
    const previewContainer = document.getElementById('file-preview-container')
    const textareaContainer = document.getElementById('textarea-container');
    previewContainer.style.bottom = (replyContentHeight + 40) + 'px';
    textareaContainer.style.bottom = (replyContentHeight + previewContainerHeight + 35) + 'px'; 
}

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

function adjustTextareaStyle() {
    const previewContainer = document.getElementById('file-preview-container');
    const replyContent = document.getElementById('reply-content');
    const previewContainerHeight = previewContainer.offsetHeight;
    const myTextarea = document.getElementById('myTextarea')
    const myTextareaHeight = myTextarea.offsetHeight
    replyContent.classList.add('active-reply');
    previewContainer.classList.add('active-preview');
    if (myTextareaHeight > 0) {
        replyContent.classList.add('active-reply');
        previewContainer.classList.remove('active-preview');
    } else {
        if (previewContainerHeight > 0){
            previewContainer.classList.add('active-preview');
        } else {
            replyContent.classList.remove('active-reply');
        }
    }
}


// ユーティリティ関数：要素の高さを取得
function getOffsetHeight(element) {
    if (!element || window.getComputedStyle(element).display === 'none') {
        return 0;
    }
    return element.offsetHeight;
}

function scrollBottom(){
    const contentMain = document.getElementById('content-main');

    window.onload = function() {
        contentMain.scrollTop = contentMain.scrollHeight;
    };
}

function realtime() {
    const postWraps = document.querySelectorAll('.post-wrap');

    postWraps.forEach((postWrap) => {
        const postFile = postWrap.querySelector('.post-file');
        const postTop = postWrap.querySelector('.post-top');
        const postBottom = postWrap.querySelector('.post-bottom');
        const postContent = postWrap.querySelector('.post-content');

        let contentWidth = 0;
        let fileWidth = 0;

        // post-content が存在する場合、その幅を取得
        if (postContent) {
            contentWidth = postContent.getBoundingClientRect().width;
        }

        // post-file が存在する場合、その幅を取得
        if (postFile) {
            fileWidth = postFile.getBoundingClientRect().width;
        }

        // 両方存在する場合は、大きい方に他の要素の幅を合わせる
        if (postContent && postFile) {
            const maxWidth = Math.max(contentWidth, fileWidth);
            postContent.style.width = maxWidth + 'px';
            postFile.style.width = maxWidth + 'px';
            postTop.style.width = maxWidth + 'px';
            postBottom.style.width = maxWidth + 'px';
        }
        // post-content だけが存在する場合は、その幅に合わせる
        else if (postContent) {
            postTop.style.width = contentWidth + 'px';
            postBottom.style.width = contentWidth + 'px';
        }
        // post-file だけが存在する場合は、その幅に合わせる
        else if (postFile) {
            postTop.style.width = fileWidth + 'px';
            postBottom.style.width = fileWidth + 'px';
        }
    });
}

function downloadFile(url, filename) {
    console.log('Download URL:', url);  // URLを確認するために追加
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('reply-content');
    initReplyButtons();
    initReplyFormValidation();
    textarea.addEventListener('input', function () {
        autoResizeMyTextarea(textarea);
        adjustTextareaPosition()
    });
    scrollBottom()
    window.addEventListener('load', realtime);
});

let files = []
// ファイルアップロードの処理
document.getElementById('file-upload').addEventListener('change', function(event) {
    const fileList = Array.from(event.target.files); // 新しく選択されたファイルを配列のリストに変換
    const previewContainer = document.getElementById('file-preview-container');
    const textareaContainer = document.getElementById('textarea-container');
    const replyContent = document.getElementById('reply-content');
    const fileInput = document.getElementById('file-upload');


    // const dataTransfer = new DataTransfer();

    // 現在のfileInput.filesを保持
    fileList.forEach((file) => {
        files.push(file);
    });

    let count = 0
    files.forEach((file, index) => {
        const existingPreviews = Array.from(previewContainer.children);
        const fileAlreadyExists = existingPreviews.some((preview) => {
            const fileName = preview.querySelector('p')?.textContent;
            return fileName === file.name;
        });

        count++

        if (fileAlreadyExists) return;

        const reader = new FileReader();

        const filePreview = document.createElement('div');
        filePreview.classList.add('file-preview');
        filePreview.style.display = 'flex';
        filePreview.style.alignItems = 'center';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×';
        deleteButton.classList.add('delete-button')

        deleteButton.dataset.fileName = file.name;

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

            else {
                const fileicon = document.createElement('svg');
                fileicon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z"/>
                </svg>`;
                fileicon.style.width = '16px';
                fileicon.style.height = '16px';
                fileicon.style.marginRight = '10px';
                filePreview.appendChild(fileicon); // ファイルアイコンを追加
            }

            filePreview.appendChild(fileName); // ファイル名を追加
            filePreview.appendChild(deleteButton); // 削除ボタンを追加
            previewContainer.appendChild(filePreview); // プレビューコンテナに追加

            const newFiles = Array.from(document.getElementById('file-upload').files); 
            console.log('Files before deletion:', newFiles, count);

            // DataTransferにファイルを追加
        };
        console.log("files:", files);

        reader.readAsDataURL(file); // ファイルをDataURLとして読み込む

        deleteButton.addEventListener('click', function() {
            filePreview.remove();
            console.log("filepreview:", filePreview);

            const fileNameToDelete = deleteButton.dataset.fileName;

            
        
            // 現在のファイルリストを取得
            const updatedFiles = Array.from(fileInput.files).filter(
                (f) => f.name !== fileNameToDelete
            );
    
            // DataTransfer を更新
            const updatedDataTransfer = new DataTransfer();
            updatedFiles.forEach((f) => updatedDataTransfer.items.add(f));
            fileInput.files = updatedDataTransfer.files;

            files = updatedFiles;

            console.log('Files after deletion:', updatedFiles);


            // 削除後のファイルリストを表示
            
            
            if (previewContainer.children.length === 0) {
                previewContainer.style.display = 'none'; 
            }
            updateFileInput(updatedFiles); 
            adjustTextareaStyle()
            adjustTextareaPosition()
            console.log('Files after deletion:', updatedFiles);
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
});



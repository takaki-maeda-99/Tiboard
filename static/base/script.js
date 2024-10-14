let COLOR_HEAD_MAIN = '#0b4e9bc0'
let COLOR_HEAD_SIDE = '#0b4e9b80'
let COLOR_CONTENT_MAIN = '#b5e2fa'
let COLOR_CONTENT_SIDE = '#b5e2fa80'
let COLOR_ACCENT = '#913e0b'

function setDefaultColor() {
    document.getElementById('head-bar-main').style.backgroundColor = COLOR_HEAD_MAIN;
    document.getElementById('head-bar-side').style.backgroundColor = COLOR_HEAD_SIDE;
    document.getElementById('content-main').style.backgroundColor = COLOR_CONTENT_MAIN;
    document.getElementById('content-side').style.backgroundColor = COLOR_CONTENT_SIDE;

    document.getElementById('head-bar-main').style.border = `solid 1px ${COLOR_ACCENT}`;
    document.getElementById('head-bar-side').style.border = `solid 1px ${COLOR_ACCENT}`;
    document.getElementById('content-main').style.border = `solid 1px ${COLOR_ACCENT}`;
    document.getElementById('content-side').style.border = `solid 1px ${COLOR_ACCENT}`;
}

document.addEventListener('DOMContentLoaded', function() {
    setDefaultColor();
    // サイドバーの開閉
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.querySelector('.toggle-btn');

    if (toggleButton && sidebar) {
        toggleButton.addEventListener('click', function () {
            sidebar.classList.toggle('show');
            toggleButton.textContent = sidebar.classList.contains('show') ? '<' : '>';
        });
    }

    // サイドバー外側をクリックした場合にサイドバーを閉じる処理
    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                toggleButton.textContent = '>';
            }
        }
    });

    document.addEventListener('touchstart', function (event) {
        if (!sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                toggleButton.textContent = '>';
            }
        }
    });

    // サイドバー内のクリックを伝播させないようにする
    sidebar.addEventListener('click', function (event) {
        event.stopPropagation();
    });

    sidebar.addEventListener('touchstart', function (event) {
        event.stopPropagation();
    });
});
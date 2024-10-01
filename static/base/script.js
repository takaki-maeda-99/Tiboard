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
});
document.addEventListener('DOMContentLoaded', function() {
    // 全ての矢印のトグルを取得
    var arrowContainers = document.querySelectorAll('.arrow-container');
    
    // 各矢印にクリックイベントを追加
    arrowContainers.forEach(function(arrowContainer) {
        arrowContainer.addEventListener('click', function(event) {
            event.preventDefault(); // リンクのデフォルト動作を無効化
            
            var parentLi = arrowContainer.closest('li'); // クリックされたメニューの親li要素を取得
            var arrow = arrowContainer.querySelector('.arrow'); // 矢印を取得
            
            // アコーディオンメニューなので他のメニューは閉じる
            document.querySelectorAll('.has-submenu.open').forEach(function(openItem) {
                if (openItem !== parentLi) {
                    openItem.classList.remove('open');
                    var openArrow = openItem.querySelector('.arrow');
                    if (openArrow) openArrow.classList.remove('up');
                    if (openArrow) openArrow.classList.add('down');
                };
            });

            // クリックされたメニューをトグル（開閉）する
            parentLi.classList.toggle('open');
            
            // 矢印の向きをトグルする
            if (arrow) {
                arrow.classList.toggle('down');
                arrow.classList.toggle('up');
            }
        });
    });

    const sideBar = document.getElementById('side_bar');
    const hoverArea = document.getElementById('hover_area');

    // 左端にカーソルが移動したらサイドバーを表示
    hoverArea.addEventListener('mouseenter', function() {
        sideBar.classList.add('open');
    });

    // サイドバーからカーソルが外れたら非表示にする
    sideBar.addEventListener('mouseleave', function() {
        sideBar.classList.remove('open');
    });
});
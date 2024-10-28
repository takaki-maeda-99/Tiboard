// 共通の関数や定数
const MARGIN = 10;

// ポップアップの表示・非表示の設定
function setPopup(parentClass, childClass, detailPopup, fitContent=false){
    
    childClass.addEventListener('mouseenter', () => {
        detailPopup.style.display = 'block';
        const rect = parentClass.getBoundingClientRect();
        detailPopup.style.left = `${rect.left - MARGIN}px`;
        detailPopup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        if (fitContent) detailPopup.style.width = `fit-content`;
    });

    childClass.addEventListener('mouseleave', () => {
        detailPopup.style.display = 'none';
    });
};

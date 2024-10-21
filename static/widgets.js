// dic = {"mainText": mainText, "subText": subText, "link": link, "submissionState": submissionState}
// dics = [dic1, dic2, ...]

// 定数の定義
const MARGIN = 10;
const TASK_BAR_AND_NAME_HEIGHT = 45;
const MAX_WIDTH = 200;

const taskBarFontSize = TASK_BAR_AND_NAME_HEIGHT * 0.35

// サイドバーを作る関数
async function createSidebar(parentId, dics) {
    const textContainer = document.getElementById(parentId);
    const BODY = document.querySelector('body');
    const elements = document.createElement('ul');

    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.marginRight = '10px';
    textContainer.style.flexShrink = '0';

    elements.style.padding ='0';
    elements.style.margin = '0';

    dics.forEach(dic => {
        const classNameElm = document.createElement('li');
        classNameElm.className = 'text-elm dropdown';
        classNameElm.style.margin = `${MARGIN}px ${MARGIN}px ${MARGIN*2}px ${MARGIN}px`;
        classNameElm.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`;
        classNameElm.style.max_width = `${MAX_WIDTH}px`;

        const textLink = document.createElement('a')
        textLink.href = dic.link;
        if (dic.submissionState) textLink.target = '_blank';

        const span1 = document.createElement('span');
        const span2 = document.createElement('span');
        span1.className = 'main-text';
        span2.className = 'sub-text';
        span1.style.color = '#ffffff';
        span2.style.color = '#ffffff';

        if (dic.submissionState == 'TURNED_IN') {
            span1.textContent = `✓${dic.mainText}`;
            span2.textContent = `${dic.subText}`;
            span1.style.color = '#ffffff80';
            span2.style.color = '#ffffff80';
        } else {
            span1.textContent = dic.mainText;
            span2.textContent = dic.subText;
        };

        span1.style.fontSize = `${taskBarFontSize}px`
        span2.style.fontSize = `${taskBarFontSize - 4}px`

        const detailPopup = document.createElement('div');
        detailPopup.className = 'detail-popup';
        detailPopup.textContent = `${dic.mainText} ${dic.subText}`;
        detailPopup.style.fontSize = `${taskBarFontSize * 0.8}px`;

        setPopup(classNameElm, classNameElm, detailPopup);

        textLink.appendChild(span1);
        textLink.appendChild(document.createElement('br'));
        textLink.appendChild(span2);
        classNameElm.appendChild(textLink);
        elements.appendChild(classNameElm);
        textContainer.appendChild(elements);
        BODY.appendChild(detailPopup); 
    });
};

// ポップアップの表示・非表示の設定
function setPopup(parentClass, childClass, detailPopup, fitContent=false){
    
    childClass.addEventListener('mouseenter', () => {
        detailPopup.style.display = 'block';
        const rect = parentClass.getBoundingClientRect();
        detailPopup.style.left = `${rect.left - MARGIN}px`;
        detailPopup.style.top = `${rect.bottom + window.scrollY}px`;
        if (fitContent) detailPopup.style.width = `fit-content`;
    });

    childClass.addEventListener('mouseleave', () => {
        detailPopup.style.display = 'none';
    });
};


document.addEventListener('DOMContentLoaded', async () => {
    const parentId = 'sidebar';
    const dic1 = {"mainText": "mainText1", "subText": "subText1", "link": "#", "submissionState": "CREATED"};
    const dic2 = {"mainText": "mainText2", "subText": "subText2", "link": "#"};
    const dics = [dic1, dic2];
    await createSidebar(parentId, dics);
});

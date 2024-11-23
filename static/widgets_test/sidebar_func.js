const TASK_BAR_AND_NAME_HEIGHT = 45;
const MAX_WIDTH = 2000;
const HEADER_HEIGHT = 61;

// dic = {"mainText": mainText, "subText": subText, "link": link, "submissionState": submissionState}
// dics = [dic1, dic2, ...]
// headerText: 今ままでのhead-barに表示していたテキストとか

// サイドバーを作る関数
function createSidebar(parentId, dics, headerText, link_for_fetch = false) {
    const textContainer = document.getElementById(parentId);
    const BODY = document.querySelector('body');
    const elements = document.createElement('ul');
    const sidebarHeader = document.createElement('li');
    const sidebarHeaderText = document.createElement('h2');
    // ???
    const taskBarFontSize = 16;

    elements.className = "elements";
    elements.style.display = "flex";
    elements.style.flexDirection = "column";
    elements.style.gap = `${MARGIN * 2}px`;

    const newHeaderHeight = HEADER_HEIGHT - MARGIN * 2;
    sidebarHeader.className = 'sidebar-header-div';
    sidebarHeader.style.height = `${newHeaderHeight}px`;
    // sidebarHeader.style.paddingTop = `${(newHeaderHeight - taskBarFontSize) / 2}px`;

    sidebarHeaderText.className = 'sidebar-header-text';
    // sidebarHeaderText.style.fontSize = `${taskBarFontSize}px`;

    sidebarHeaderText.textContent = headerText;

    sidebarHeader.appendChild(sidebarHeaderText);
    elements.appendChild(sidebarHeader);

    textContainer.style.display = 'flex';
    textContainer.style.flexDirection = 'column';
    textContainer.style.flexShrink = '0';
    textContainer.style.overflowY = "scroll";
    textContainer.style.scrollbarWidth = "none";

    dics.forEach(dic => {
        const classNameElm = document.createElement('li');
        classNameElm.className = 'text-elm dropdown';
        classNameElm.style.height = `${TASK_BAR_AND_NAME_HEIGHT}px`;
        classNameElm.style.maxWidth = `${MAX_WIDTH}px`;

        const textLink = document.createElement('a')

        if (!link_for_fetch) {
            textLink.href = dic.link;
        } else {
            classNameElm.addEventListener('click', () => {
                fetch(`${dic.link}`).then(response => response.json()).then(data => {
                    console.log(data);
                    createThread("thread", data.thread);
                });
            });
        }

        if (dic.submissionState) textLink.target = '_blank';

        const mainSpan = document.createElement('span');
        const subSpan = document.createElement('span');
        mainSpan.className = 'main-text';
        subSpan.className = 'sub-text';
        mainSpan.style.color = '#ffffff';
        subSpan.style.color = '#909090';

        if (dic.submissionState == 'TURNED_IN') {
            mainSpan.textContent = `✓${dic.mainText}`;
            subSpan.textContent = `${dic.subText}`;
            mainSpan.style.color = '#ffffff80';
            subSpan.style.color = '#ffffff80';
        } else {
            mainSpan.textContent = dic.mainText;
            subSpan.textContent = dic.subText;
        };

        mainSpan.style.fontSize = `${taskBarFontSize}px`
        subSpan.style.fontSize = `${taskBarFontSize - 4}px`

        const detailPopup = document.createElement('div');
        detailPopup.className = 'detail-popup';
        detailPopup.textContent = `${dic.mainText} ${dic.subText}`;
        detailPopup.style.fontSize = `${taskBarFontSize * 0.8}px`;

        setPopup(classNameElm, classNameElm, detailPopup);

        textLink.appendChild(mainSpan);
        textLink.appendChild(document.createElement('br'));
        textLink.appendChild(subSpan);
        classNameElm.appendChild(textLink);
        elements.appendChild(classNameElm);
        textContainer.appendChild(elements);
        BODY.appendChild(detailPopup);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const parentId = 'up-left';
    const dic1 = {"mainText": "mainText1", "subText": "subText1", "link": "#", "submissionState": "CREATED"};
    const dic2 = {"mainText": "mainText2", "subText": "subText2", "link": "#"};
    const dic3 = {"mainText": "mainText2", "subText": "subText2", "link": "#"};
    const dic4 = {"mainText": "mainText1", "subText": "subText1", "link": "#", "submissionState": "CREATED"};
    const dic5 = {"mainText": "mainText2", "subText": "subText2", "link": "#"};
    const dic6 = {"mainText": "mainText2", "subText": "subText2", "link": "#"};
    const dics = [dic1, dic2, dic3, dic4, dic5, dic6];
    // createSidebar(parentId, dics, "Tasks");
    // createSidebar('down-right', dics);
});


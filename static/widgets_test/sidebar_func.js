// dic = {"mainText": mainText, "subText": subText, "link": link, "submissionState": submissionState}
// dics = [dic1, dic2, ...]
// headerText: 今ままでのhead-barに表示していたテキストとか

// サイドバーを作る関数
function createSidebar(parentId, dics, headerText, link_for_fetch = false) {
    const textContainer = document.getElementById(parentId);
    textContainer.className = 'text-container';

    const BODY = document.querySelector('body');

    const elements = document.createElement('ul');
    elements.className = "elements";

    const sidebarHeader = document.createElement('li');
    sidebarHeader.className = 'sidebar-header-div';

    const sidebarHeaderText = document.createElement('h2');
    sidebarHeaderText.textContent = headerText;

    sidebarHeader.appendChild(sidebarHeaderText);
    elements.appendChild(sidebarHeader);

    dics.forEach(dic => {
        const classNameElm = document.createElement('li');
        classNameElm.className = 'text-elm';

        const textLink = document.createElement('a')

        if (!link_for_fetch) {
            textLink.href = dic.link;
        } else {
            classNameElm.addEventListener('click', () => {
                fetch(`${dic.link}`).then(response => response.json()).then(data => {
                    createThread(data.thread);
                });
            });
        }

        if (dic.submissionState) textLink.target = '_blank';

        const mainSpan = document.createElement('div');
        const subSpan = document.createElement('div');
        mainSpan.className = 'main-text';
        subSpan.className = 'sub-text';
        mainSpan.textContent = dic.mainText;
        subSpan.textContent = dic.subText;

        if (dic.submissionState == 'TURNED_IN') {
            mainSpan.textContent = `✓${dic.mainText}`;
            subSpan.textContent = `${dic.subText}`;
            mainSpan.style.color = '#ffffff80';
            subSpan.style.color = '#ffffff80';
        }

        const detailPopup = document.createElement('div');
        detailPopup.className = 'detail-popup';
        detailPopup.textContent = `${dic.mainText} ${dic.subText}`;
        setPopup(classNameElm, classNameElm, detailPopup);

        classNameElm.appendChild(mainSpan);
        classNameElm.appendChild(subSpan);
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


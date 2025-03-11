// ローカルストレージキー
const COURSE_STORAGE_KEY = "cachedCourses";
const TIME_TABLE_STORAGE_KEY = "timetableData"

// キャッシュを更新する（必要な場合）
async function updateCachedCourses(url) {
    console.log("Updating course cache...");
    const response = await fetch(`/task_board/${url}`);
    const data = await response.json();

    // キャッシュを更新
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(data));
    return data;
}

// 編集モード
let isEditMode = false;

function editTimeTable(subjects) {
    const timeSlots = document.querySelectorAll(".time-slot");
    const editModeButton = document.getElementById("toggle-edit-mode");

    // 各セルにドロップダウンリストとテキスト表示を作成
    timeSlots.forEach((slot, index) => {
        const select = document.createElement("select");
        const displayText = document.createElement("div");
        select.classList.add("subject-select");
        displayText.classList.add("subject");

        // 初期状態の設定
        displayText.classList.add("hidden");
        select.classList.add("hidden");

        // ドロップダウンリストの内容を生成
        subjects.forEach(subject => {
            const option = document.createElement("option");
            option.value = subject;
            option.textContent = subject;
            select.appendChild(option);
        });

        // セレクトボックスの選択が変更されたときの処理
        select.addEventListener("change", function () {
            displayText.textContent = select.value === "空きコマ" ? "" : select.value;
            saveTimetable();
        });

        // 初期表示（空白状態）
        slot.appendChild(select);
        slot.appendChild(displayText);
    });

    // 編集モード切り替えボタンの処理
    editModeButton.addEventListener("click", function () {
        isEditMode = !isEditMode;
        editModeButton.textContent = isEditMode ? "完了" : "編集";

        // 各セルの表示を切り替え
        timeSlots.forEach(slot => {
            const select = slot.querySelector("select");
            const displayText = slot.querySelector("div");

            if (isEditMode) {
                select.classList.remove("hidden");
                displayText.classList.add("hidden");
            } else {
                select.classList.add("hidden");
                displayText.classList.remove("hidden");
            }
        });
    });

    // 時間割をローカルストレージに保存
    function saveTimetable() {
        const timetableData = Array.from(timeSlots).map(slot => {
            const select = slot.querySelector("select");
            return select.value;
        });
        localStorage.setItem(TIME_TABLE_STORAGE_KEY, JSON.stringify(timetableData));
    }

    // ローカルストレージから時間割を復元
    function loadTimetable() {
        const savedData = localStorage.getItem(TIME_TABLE_STORAGE_KEY);
        if (savedData) {
            const timetableData = JSON.parse(savedData);
            timeSlots.forEach((slot, index) => {
                const select = slot.querySelector("select");
                const displayText = slot.querySelector("div");
                const value = timetableData[index] || "空きコマ";

                // セレクトボックスとテキスト表示を復元
                select.value = value;
                displayText.textContent = value === "空きコマ" ? "" : value;

                // 編集モードがオフの場合の表示切り替え
                if (!isEditMode) {
                    select.classList.add("hidden");
                    displayText.classList.remove("hidden");
                }
            });
        }
    }

    // ページロード時に時間割を復元
    loadTimetable();
}

// 時間割を作成
function makeTimeTable(dataDic, parentId) {
    let coursesAndLinks = [];
    let processedCourseNameList = [];
    const courses = dataDic.courses;

    courses.forEach(course => {
        coursesAndLinks = [processCourse(course), ...coursesAndLinks]
        });
    
    coursesAndLinks.forEach(dic => {
        processedCourseNameList = [dic.course_name, ...processedCourseNameList];
    });
    processedCourseNameList = ["空きコマ", ...processedCourseNameList];
    const parentElement = document.getElementById(parentId);
    const DIV_ID = ["class-num", "mon", "tue", "wed", "thu", "fri"]

    const classNum = document.createElement("div");
    const mon = document.createElement("div");
    const tue = document.createElement("div");
    const wed = document.createElement("div");
    const thu = document.createElement("div");
    const fri = document.createElement("div");

    parentElement.style.display = "flex";
    parentElement.style.padding = "0 5px";

    const divList = [classNum, mon, tue, wed, thu, fri];
    divList.forEach((div, index) => {
        div.id = DIV_ID[index];
        div.style.flex = "1";
        div.classList.add("table", "col");
        parentElement.appendChild(div);
    });

    DIV_ID.forEach((divId, index) => {
        insertColumn(divId, divList[index]);
    })

    editTimeTable(processedCourseNameList);
    addPopupToTimeSlots(courses);
}

// 列をテーブルに挿入
function insertColumn(parentId, parentElement) {
    let classNums = ["", "first", "second", "third", "forth", "fifth"];
    const CLASS_TEXT = ["", "1限", "2限", "3限", "4限", "5限"];
    const DAY_DIC = {
        "mon": "月", "tue": "火", "wed": "水", "thu": "木", "fri": "金",
        "0": "日", "1": "月", "2": "火", "3": "水", "4": "木", "5": "金", "6": "土"
    };
    if (parentId === "class-num") {
        classNums[0] = "blank";
    } else {
        classNums[0] = "day";
    }
    
    const today = new Date();
    const todayIndex = today.getDay();
    const todayKey = DAY_DIC[todayIndex]

    classNums.forEach((classNum, index) => {
        const div = document.createElement("div");
        const dayOfWeek = DAY_DIC[parentId];
        if (parentId === "class-num") {
            if (index === 0) {
                const button = document.createElement("button");
                button.id = "toggle-edit-mode";
                button.textContent = "編集";
                div.appendChild(button);
            } else {
                div.textContent = CLASS_TEXT[index];
            }
            div.classList.add(classNum, "col-2");
            
        } else {
            if (index === 0) {
                div.classList.add(classNum, "col-2");
                div.textContent = dayOfWeek;
                if (todayKey === dayOfWeek) {
                    div.style.backgroundColor = "#af9b00a0";
                }
            } else {
                div.classList.add(classNum, "col-2", "time-slot");
            }
        }
        if (todayKey === dayOfWeek) {
            parentElement.classList.add("highlight");
        }
        parentElement.appendChild(div);
    })

}

// ポップアップの設定
function addPopupToTimeSlots(courses) {
    const timeSlots = document.querySelectorAll(".time-slot");

    timeSlots.forEach((slot, index) => {
        const subjectSpan = slot.querySelector(".subject");
        if (!subjectSpan || subjectSpan.textContent.trim() === "") {
            return;
        }
        const popup = createPopup(index, courses);

        // 初期位置を設定
        document.body.appendChild(popup);

        popup.style.top = "0";
        popup.style.left = "0";

        let popupTimer;

        // マウスが科目名にホバーしたとき
        subjectSpan.addEventListener("mouseenter", function () {
            if (isEditMode) return;

            popupTimer = setTimeout(() => {
                if (popup) {
                    adjustPopupPosition(slot, popup);
                    popup.classList.add("visible");
                }
            }, 200);
        });

        // マウスが科目名から外れたとき
        subjectSpan.addEventListener("mouseleave", function (event) {
            if (popup.contains(event.relatedTarget)) return; // popup 内なら閉じない
            clearTimeout(popupTimer);
            hidePopup(popup);
        });

        // マウスがポップアップ内に入ったとき
        popup.addEventListener("mouseenter", function () {
            clearTimeout(popupTimer); // 閉じるタイマーを解除
        });

        // マウスがポップアップから出たとき
        popup.addEventListener("mouseleave", function (event) {
            if (subjectSpan.contains(event.relatedTarget)) return; // subject に戻ったら閉じない
            hidePopup(popup);
        });
    });
}

// ポップアップを非表示にする関数
function hidePopup(popup) {
    popup.classList.remove("visible");
    popup.style.top = "0px"; // 初期位置に戻す
    popup.style.left = "0px";
}

// すべてのポップアップの位置を調整
function adjustAllPopups() {
    const timeSlots = document.querySelectorAll(".time-slot");

    timeSlots.forEach(slot => {
        const popup = slot.querySelector(".popup");
        if (popup) {
            adjustPopupPosition(slot, popup);
        }
    });
}

// ページスクロール中にポップアップの位置を調整
window.addEventListener("scroll", () => {
    const visiblePopups = document.querySelectorAll(".popup.visible");
    visiblePopups.forEach(popup => {
        const parentSlot = popup.closest(".time-slot");
        if (parentSlot) {
            adjustPopupPosition(parentSlot, popup);
        }
    });
});

// ポップアップの位置を調整する
function adjustPopupPosition(target, popup) {
    const rect = target.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const timeSlotRect = target.closest(".time-slot").getBoundingClientRect();
    const timeTableRect = target.closest(".table").getBoundingClientRect();

    console.log("timeSlotRect", timeSlotRect);

    let left = rect.left + (rect.width / 2) - (popupRect.width / 2) + window.scrollX;
    let top = timeSlotRect.bottom + window.scrollY;

    // ポップアップが画面の下部にはみ出る場合
    if (top + popupRect.height > viewportHeight + window.scrollY) {
        top = timeTableRect.bottom - popupRect.height - 1 ; // .table の bottom に合わせる
    }

    popup.style.top = `${top}px`;
    popup.style.bottom = "auto";

    // 右にはみ出す場合、画面右側に合わせる
    if (left + popupRect.width > viewportWidth + window.scrollX) {
        left = viewportWidth + window.scrollX - popupRect.width - 5;
    }

    // 左にはみ出す場合、画面左側に合わせる
    if (left < 0) {
        left = 5;
    }

    // 左右の位置を設定
    popup.style.left = `${left}px`;
    popup.style.right = "auto";
}

// ポップアップを作る
function createPopup(index, courses) {
    const popup = document.createElement("div");
    popup.className = "popup";

    const timeTableData = JSON.parse(localStorage.getItem(TIME_TABLE_STORAGE_KEY));

    function findCoursesByName(courses, targetName) {
        return courses.filter(course => course.name.includes(targetName))[0];
    }

    const course = findCoursesByName(courses, timeTableData[index]);

    // ローカルストレージキー
    const counterStorageKey = `counter-data-${index}`;

    // 保存されたデータを取得
    let savedData = JSON.parse(localStorage.getItem(counterStorageKey)) || {
        attendance: 0,
        absence: 0,
        tardiness: 0,
    };

    savedData = {
        ...savedData,
        subject: timeTableData[index]
    }

    // データを保存する関数
    function saveData() {
        localStorage.setItem(counterStorageKey, JSON.stringify(savedData));
    }

    // カウンター生成
    function createCounter(label, key) {
        const counterContainer = document.createElement("div");
        counterContainer.className = "counter";

        const labelElem = document.createElement("div");
        labelElem.textContent = `${label}: `;

        const count = document.createElement("div");
        count.textContent = savedData[key];
        count.className = "count";

        const increment = document.createElement("button");
        increment.textContent = "▲";
        increment.addEventListener("click", () => {
            savedData[key]++;
            count.textContent = savedData[key];
            saveData();
        });

        const decrement = document.createElement("button");
        decrement.textContent = "▼";
        decrement.addEventListener("click", () => {
            if (savedData[key] > 0) {
                savedData[key]--;
                count.textContent = savedData[key];
                saveData();
            }
        });

        counterContainer.appendChild(labelElem);
        counterContainer.appendChild(increment);
        counterContainer.appendChild(count);
        counterContainer.appendChild(decrement);

        return counterContainer;
    };

    const subjectContainer = document.createElement("div");
    subjectContainer.className = "popup-subject";

    const subjectName = document.createElement("a");
    subjectName.textContent = savedData.subject;
    subjectName.href = course.alternateLink || "#";
    subjectName.target = "_blank";
    subjectName.className = "popup-subject-link";

    subjectContainer.appendChild(subjectName);
    popup.appendChild(subjectContainer);

    popup.appendChild(createCounter("出席", "attendance"));
    popup.appendChild(createCounter("欠席", "absence"));
    popup.appendChild(createCounter("遅刻", "tardiness"));

    return popup;
}

// 出席・欠席・遅刻回数のカウンターを生成
function createCounter(label) {
    const container = document.createElement("div");
    container.classList.add("popup-item", "counter");

    const labelElement = document.createElement("div");
    labelElement.textContent = `${label}`;

    const countElement = document.createElement("div");
    countElement.textContent = "0";
    countElement.classList.add("count");

    const incrementButton = document.createElement("button");
    incrementButton.textContent = "▲";
    incrementButton.classList.add("increment");
    incrementButton.addEventListener("click", () => {
        countElement.textContent = parseInt(countElement.textContent) + 1;
    });

    const decrementButton = document.createElement("button");
    decrementButton.textContent = "▼";
    decrementButton.classList.add("decrement");
    decrementButton.addEventListener("click", () => {
        const currentValue = parseInt(countElement.textContent);
        countElement.textContent = Math.max(currentValue - 1, 0);
    });

    container.appendChild(labelElement);
    container.appendChild(countElement);
    container.appendChild(incrementButton);
    container.appendChild(decrementButton);

    return container;
}

// ページ読み込み時にポップアップの位置を調整
document.addEventListener("DOMContentLoaded", () => {
    const popups = document.querySelectorAll(".popup");
    popups.forEach(popup => {
        const parentSlot = popup.closest(".time-slot");
        if (parentSlot) {
            adjustPopupPosition(parentSlot, popup);
        }
    });
});

// courseNameをトリミング
function processCourse(course) {
    let courseName = course.name 
        ? course.name.replace(/B\d{1,7}[_\d]{0,6}\s*/, '')
        : 'No name';

    const link = course.alternateLink || 'No link';

    return {
        course_name: courseName,
        link: link
    };
}

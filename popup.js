'use strict';

let setRemindButton = document.getElementById('setRemindButton');
let allDeleteBtn = document.getElementById('allDeleteBtn');
let allSelectCheckBox = document.getElementById('allSelectCheckBox');
let alarmTable = document.getElementById("alarmTable");
chrome.alarms.getAll(alarmsArray => {
    console.log(alarmsArray);
    alarmsArray.forEach((item, index, array) => {
        //增加alarmTable显示通知列表
        addAlarmLine(item);
    });
});

setRemindButton.onclick = function () {
    var timeInput = inputChecked();
    let tip = document.getElementById('tip');
    var bg = chrome.extension.getBackgroundPage();
    if (isRepeat(tip.value)) {
        bg.createNotification("通知重复啦~~~");
        return;
    }
    if (isOverLimit()) {
        bg.createNotification("通知超过10个了~~~");
        return;
    }
    bg.setReminder(timeInput.id, timeInput.value, tip.value);
    chrome.alarms.get(tip.value, function (alarm) {
        addAlarmLine(alarm);
    });
};

function inputChecked() {
    var inputSelect = document.getElementsByName('interval');

    for (var i = 0, len = inputSelect.length; i < len; i++) {
        if (inputSelect[i].checked && inputSelect[i].type === 'radio') {
            return inputSelect[i].parentElement.children[2].children[0];
        }

    }
    return null;
}

allDeleteBtn.onclick = function () {
    var bg = chrome.extension.getBackgroundPage();
    var inputSelect = document.getElementsByName('checkboxCell');
    if (inputSelect.length <= 0) {
        return;
    }
    //获取被选中的alarm name
    for (var i = inputSelect.length - 1; i >= 0; i--) {
        console.log("i:" + i);
        console.log("inputSelect.length:" + inputSelect.length);
        console.log("inputSelect cell:" + inputSelect[i]);
        if (inputSelect[i].checked && inputSelect[i].type === 'checkbox') {
            var line = inputSelect[i].parentElement.parentElement;
            var nameCell = line.children[1];
            console.log("remove namecell:" + nameCell.textContent);
            bg.removeReminder(nameCell.textContent);
            alarmTable.removeChild(line);
        }
    }
    allSelectCheckBox.checked = false;
}

allSelectCheckBox.onclick = function () {
    var inputSelect = document.getElementsByName('checkboxCell');
    if (inputSelect.length <= 0) {
        return;
    }
    for (var i = 0, len = inputSelect.length; i < len; i++) {
        inputSelect[i].checked = allSelectCheckBox.checked;
    }
}

//是否重名
function isRepeat(name) {
    var nameCells = document.getElementsByClassName("alarmName");
    for (var i = 0; i < nameCells.length; i++) {
        if (nameCells[i].textContent === name) {
            return true;
        }
    }
    return false;
}

//是否超出限制
function isOverLimit() {
    var nameCells = document.getElementsByClassName("alarmName");
    return nameCells.length >= 10;
}

function addAlarmLine(alarm) {
    var row = document.createElement("tr");
    var checkCell = document.createElement("td");
    var check = document.createElement("input");
    check.setAttribute("type", "checkbox");
    check.setAttribute("name", "checkboxCell");
    checkCell.appendChild(check);
    row.appendChild(checkCell);


    var nameCell = document.createElement("td");
    nameCell.textContent = alarm.name;
    nameCell.setAttribute("class", "alarmName");
    row.appendChild(nameCell);

    var scheduleCell = document.createElement("td");
    var dateTime = new Date(alarm.scheduledTime).toLocaleString();
    scheduleCell.textContent = dateTime.toLocaleString();
    scheduleCell.setAttribute("class", "alarmTime");
    row.appendChild(scheduleCell);


    var delBtn = document.createElement("input");
    delBtn.setAttribute("class", "next-btn next-medium next-btn-primary next-btn-warning")
    delBtn.setAttribute("type", "button");
    delBtn.value = "删除";
    delBtn.onclick = function (rowIndex) {
        var bg = chrome.extension.getBackgroundPage();
        console.log("rowIndex:" + rowIndex);
        console.log("rowIndex:" + rowIndex.button);
        bg.remove(rowIndex, alarmTable);
    };
    var delBtnCell = document.createElement("td");
    delBtnCell.appendChild(delBtn);
    row.appendChild(delBtnCell);

    alarmTable.appendChild(row);
}
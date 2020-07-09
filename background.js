// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
function remove(mouseEvent, alarmTable) {
    var rowIndex = mouseEvent.srcElement.parentElement.parentElement.rowIndex;
    var line = mouseEvent.srcElement.parentElement.parentElement;
    console.log("rowIndex:{}", rowIndex);
    console.log("line:", line);
    console.log("alarmTable:", alarmTable);
    alarmTable.removeChild(line);

    var alarmName = line.children[1].textContent;
    chrome.alarms.clear(alarmName, function (wasCleared) {
        if (wasCleared) {
        }
    });
}

function setReminder(id, interval, tip) {
    console.log("id:" + id + ";value:", interval + ";tip:" + tip);
    if (isNull(interval) || isNull(tip) || isNull(id)) {
        createNotification("时间或提示不能为空ヽ(ー_ー)ノ");
        return;
    }
    var whenTime = null;
    var periodInMinutes = null;
    switch (id) {
        case "cycleTime":
            console.log("id~~" + id);
            whenTime = new Date().getTime() + 60 * 1000 * interval;
            periodInMinutes = interval * 1;
            break;
        case "everyDay":
            whenTime = new Date(new Date().toLocaleDateString() + " " + interval).getTime();
            periodInMinutes = 24 * 60;
            console.log("id~~" + id);
            break;
        case "specificTime":
            console.log("id~~" + id);
            whenTime = new Date(interval).getTime();
            break;
        case "delayTime":
            console.log("id~~" + id);
            whenTime = new Date().getTime() + 60 * 1000 * interval;
            break;
        default:
            createNotification("时间设置错误ヽ(ー_ー)ノ");
            console.log("error");
            return;
    }
    console.log("whenTime:" + whenTime + " periodInMinutes:" + periodInMinutes);

    chrome.alarms.create(tip, {when: whenTime, periodInMinutes: periodInMinutes});
    
};


function removeReminder(name) {
    console.log("clear alarm:{}" + name);
    chrome.alarms.clear(name, wascleared => {
        console.log("success?" + wascleared);
    });
};

// 一加载插件，就默认设置
chrome.runtime.onInstalled.addListener(function (reason) {
    chrome.alarms.onAlarm.addListener(alarm => {
        chrome.notifications.create(
            {
                type: "basic",
                iconUrl: "images/get_started16.png",
                title: alarm.name,
                message: "",
                requireInteraction: true
            }
        );
        console.log("*******Got an alarm!*********", alarm);
    });
});


function isNull(str) {
    if (!str || str === '') return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}

function createNotification(msg) {

    chrome.notifications.create(
        {
            type: "basic",
            iconUrl: "images/get_started16.png",
            title: msg,
            message: "",
            requireInteraction: true
        }
    );
}

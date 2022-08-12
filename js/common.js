   var url = "https://zk.zksky.top/zkSky";
//  var  url = "http://127.0.0.1:8080";
var startTime = 1591718400000;//建站时间（大学毕业当天）：2020-6-10
var myLifeTime = 873388800000;//起源时间

var timeVue = new Vue({
    el: '#showAdultsTime',
    data: {
        time: "你好",
    },
})
var lifeVue = new Vue({
    el: '#showMyLifeTime',
    data: {
        time: "你0好",
    },
})

var app = new Vue({
    el: '#contact-form',
    data: {
        name: "",
        email: "",
        subject: "",
        content: "",
    },
    methods: {
        /**
         * ajax发送联系作者的信息
         */
        send: function () {
            var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //邮箱正则表达式
            if (app.name == "" || app.email == "" || app.subject == "" || app.content == "") {
                alert("错误：表单信息均为必填项，表单未填写完整！");
                return;
            } else if (!reg.test(app.email)) {
                app.email = "";
                alert("错误：请填写合法邮箱！");
                return;
            }
            var userId = getCookie("userId");
            $.ajax({
                url: url + "/contactMe/message",
                type: "POST",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    userId: userId,
                    name: app.name,
                    email: app.email,
                    subject: app.subject,
                    content: app.content,
                }),
                success: function (res) {
                    if(res.status==0)
                    alert("信息发送成功");
                    else
                    alert("信息发送失败!");
                },
                error: function (res) {
                    alert("信息发送失败!");
                }

            })
        }
    }
})

/**
 * 监听enter键触发上列发送信息函数
 */
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        app.send();
    }
});


/**
 * 通过typed-js插件打印文字
 */
function printWord() {
    var typed = new Typed('.typedjs', {
        strings: [
            'Hello World!',
            'I\'m Zksky!',
            '译：我思故我在',
        ],
        //打印的速度。单位ms
        typeSpeed: 150,
        //设置循环，为真，开启循环
        loop: true,
        //打印前的延迟时间
        startDelay: 0,
        //打印后的延迟时间
        backDelay: 2000,
        //返回的速度
        backSpeed: 30
    });
}


/**
 * 显示本站走过的时间
 */
function showAdultsTime() {
    var nowTime = new Date().getTime(); //获取毫秒数
    var MS = nowTime - startTime;
    var allDay = Math.floor(MS / 86400000);
    MS = MS % 86400000;
    var allH = Math.floor(MS / 3600000);
    MS = MS % 3600000;
    var allM = Math.floor(MS / 60000);
    MS = MS % 60000;
    var allS = Math.floor(MS / 1000);
    timeVue.time = allDay + "天" + checkTime(allH) + "时" + checkTime(allM) + "分" + checkTime(allS) + "秒";
    //定时器
    setTimeout("showAdultsTime()", 1000);
}

/**
 * 显示人生走过的时间
 */
function showMyTime() {
    var nowTime = new Date().getTime(); //获取毫秒数
    var MS = nowTime - myLifeTime;
    var allDay = Math.floor(MS / 86400000);
    MS = MS % 86400000;
    var allH = Math.floor(MS / 3600000);
    MS = MS % 3600000;
    var allM = Math.floor(MS / 60000);
    MS = MS % 60000;
    var allS = Math.floor(MS / 1000);
    lifeVue.time = allDay + "天" + checkTime(allH) + "时" + checkTime(allM) + "分" + checkTime(allS) + "秒";
    //定时器
    setTimeout("showMyTime()", 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    return i;
}
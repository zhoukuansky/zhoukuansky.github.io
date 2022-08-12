$(function () {
    //在globe.js定义
    initGlobe();

    //通过typed-js插件打印文字_commen.js
    printWord();

    //显示本站走过的时间_conmmen.js
    showAdultsTime();

    //显示总时间_conmmen.js
    showMyTime();

    openQQ();

    //获取定位_local.js
    getLocationCache();

})

function openQQ() {
    var a = document.getElementById("QQ");
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        a.href = "mqqwpa://im/chat?chat_type=wpa&uin=553392040&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        a.href = "tencent://message/?uin=553392040&Site=http://vps.shuidazhe.com&Menu=yes";
    }
}

/**
 * 个人信息展示切换
 */
var isShow = false;

function showInfo(num) {
    const vw = window.innerWidth;
    if (vw >= 768) {
        if (num == 1) {
            $(".email-red").css("color", "red");
        }
        if (!isShow) {
            $("#myInfo").css("left", "0px");
            $("#info-button-img").css("transform", "rotate(180deg)");
            $("#info-button-img").css("animation", "imgChange2 2s ease infinite");
            isShow = !isShow;
        } else {
            $("#myInfo").css("left", "-400px");
            $("#info-button-img").css("transform", "rotate(0deg)");
            $("#info-button-img").css("animation", "imgChange1 2s ease infinite");
            $("#info-button").css("right", "-60px");
            isShow = !isShow;

            $(".email-red").css("color", "rgb(81, 136, 238)");
        }
    } else {
        if (num == 1) {
            $(".email-red").css("color", "red");
        }
        if (!isShow) {
            $("#myInfo").css("left", "0%");
            $("#info-button-img").css("transform", "rotate(180deg)");
            $("#info-button-img").css("animation", "imgChange2 2s ease infinite");
            $("#info-button").css("right", "0px");
            isShow = !isShow;
        } else {
            $("#myInfo").css("left", "-100%");
            $("#info-button-img").css("transform", "rotate(0deg)");
            $("#info-button-img").css("animation", "imgChange1 2s ease infinite");
            $("#info-button").css("right", "-60px");
            isShow = !isShow;

            $(".email-red").css("color", "rgb(81, 136, 238)");
        }
    }
}

/**
 * 跟个人信息展示一脉相承
 */
window.onresize = function () {
    if ($(window).width() <= 768) {
        if ($("#myInfo").css("left") == "-400px") {
            $("#myInfo").css("left", "-100%");
        }
        if ($("#info-button").css("right") == "-60px" && isShow) {
            $("#info-button").css("right", "0px");
        }
    } else {
        if ($("#myInfo").css("left") != "-400px" && $("#myInfo").css("left") != "0px") {
            $("#myInfo").css("left", "-400px");
        }
        if ($("#info-button").css("right") == "0px") {
            $("#info-button").css("right", "-60px");
        }
    }
}

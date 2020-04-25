var hasAnimation = {    //  动画是否需要执行，false不需要，true需要
    work: true,
    git: true,
    ability: true,
    card: true
}

$(function () {
    printWord();

    var a = document.getElementById("QQ");
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        a.href = "mqqwpa://im/chat?chat_type=wpa&uin=1246886075&version=1&src_type=web&web_src=oicqzone.com";
    } else {
        a.href = "tencent://message/?uin=1246886075&Site=http://vps.shuidazhe.com&Menu=yes";
    }

    /**
    *  监听滚动器
    */
    $(window).scroll(function (e) {
        if (checkShow($(".page-four-card")) && hasAnimation.card) {
            $(".page-four-card").css({
                "opacity": 1,
                "top": "200px"
            });
            hasAnimation.card = false
        }
        if (checkShow($(".ability-list-container")) && hasAnimation.ability) {
            $(".ability-list-container").css({
                "opacity": 1
            })
            hasAnimation.ability = false
        }
        if (checkShow($(".work-container")) && hasAnimation.work) {
            $(".work-show-up,.work-show-down").css({
                "opacity": 1,
                "bottom": "0"
            })
            hasAnimation.work = false
        }
        if (checkShow($(".git-link-box")) && hasAnimation.git) {
            $(".git-link-box").css({
                "opacity": 1,
                "right": "180px"
            })
            hasAnimation.git = false
        }
    })
})

/**
 * 个人信息展示切换
 */
function showInfo() {
    if ($("#myInfo").css("left") == "-400px") {
        $("#myInfo").css("left", "0px");
        $("#info-button").css("transform", "rotate(180deg)");
        $("#info-button").css("animation", "imgChange2 2s ease infinite");
    } else {
        $("#myInfo").css("left", "-400px");
        $("#info-button").css("transform", "rotate(0deg)");
        $("#info-button").css("animation", "imgChange1 2s ease infinite");
    }

}

/**
 * 判断dom元素是否出现在视野内
 * @param $Obj jquery元素
 * @returns {boolean}
 */
function checkShow($Obj) { // 传入jq对象
    var sTop = $(window).scrollTop();  //即页面向上滚动的距离
    var wHeight = $(window).height(); // 浏览器自身的高度
    var offsetTop = $Obj.offset().top;  //目标标签img相对于document顶部的位置

    if (offsetTop < (sTop + wHeight) && offsetTop > sTop) { //在2个临界状态之间的就为出现在视野中的
        return true;
    }
    return false;
}

/**
 * 判断dom元素是否出现在视野内
 * @param el dom元素
 * @returns {boolean}
 */
function elementInViewport2(el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
        el = el.offsetParent;
        top += el.offsetTop;
        left += el.offsetLeft;
    }

    return (
        top < (window.pageYOffset + window.innerHeight) &&
        left < (window.pageXOffset + window.innerWidth) &&
        (top + height) > window.pageYOffset &&
        (left + width) > window.pageXOffset
    );
}

/**
 * 通过typed-js插件打印文字
 */
function printWord() {
    var typed = new Typed('.typedjs', {
        strings: [
            'Hello Horld',
            'I\'m Zksky',
            '译：我思故我在',
        ],
        typeSpeed: 150,
        loop: true,
        backDelay: 2000,
        backSpeed: 30
    });
}


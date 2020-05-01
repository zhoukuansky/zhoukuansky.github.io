//如果屏幕宽度过宽，转往PC端
if (window.innerWidth > 768) {
    location.href = "./index.html";
}
window.onresize = function () {
    if ($(window).width() > 768) {
        location.href = "./index.html";
    }
}
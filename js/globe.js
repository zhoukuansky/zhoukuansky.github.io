var globe = planetaryjs.planet();
//在planetaryjs中的中国坐标
var China = [250, -20, 0];
//获取dom元素
var canvas = document.getElementById("globe");


function initGlobe() {
    //加载我们的自定义“autorotate”插件，配置地球旋转角度
    globe.loadPlugin(autorotate(10));
    //配置生成地球的颜色
    globe.loadPlugin(planetaryjs.plugins.earth({
        topojson: { file: "data/world-110m-withlakes.json" },
        // oceans: { fill: "#dddee0" },
        // land: { fill: "#f7f7f7" },
        // borders:  { stroke: 'rgb(194, 194, 194)' }
        oceans: { fill: '#000040' },
        land: { fill: '#1b72b0' },
        borders: { stroke: '#000055' }
    }));
    //配置鼠标拖动事件
    globe.loadPlugin(planetaryjs.plugins.drag({
        onDragStart() {
            this.plugins.autorotate.pause();
        },
        onDragEnd() {
            this.plugins.autorotate.resume();
        }
    }))
    //加载点插件,并配置颜色
    globe.loadPlugin(planetaryjs.plugins.pings({
        color: "#df5f5f", ttl: 2000, angle: 2
    }))
    //加载点
    addPingsThing();
    //页面中加载globe的大小和位置
    globeLcation();
    //绘制globe的cavas
    globe.draw(canvas);
    //地球旋转的初始位置
    globe.projection.rotate(China)
    //监听窗口大小变化
    window.addEventListener("resize", () => globeLcation());
}

//页面中加载globe的大小和位置
function globeLcation() {
    const vw = window.innerWidth;
    //返回较大的那个值，通过下列式子 转换成了最大值为500，最小值为300
    const diam = Math.max(300, Math.min(500, vw - (vw * .6)));
    const radius = diam / 2;
    canvas.width = diam;
    canvas.height = diam;
    globe.projection.scale(radius).translate([radius, radius]);
    var vpx = -0.4 * diam + 200;
    $(".visitor-body").css("padding-top", vpx + "px");
    // console.log(vpx+"px")
    // console.log()
}

//自定义插件将自动围绕其垂直方向旋转地球
//轴每秒配置的度数
function autorotate(dps) {
    return function (planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
            pause: function () {
                paused = true;
            },
            resume: function () {
                paused = false;
            }
        };

        //并将钩子配置到其生命周期的某些部分。
        planet.onDraw(function () {
            if (paused || !lastTick) {
                lastTick = new Date();
            } else {
                var now = new Date();
                var delta = now - lastTick;
                //此插件使用内置投影（由D3提供）
                //每次我们画地球仪时都要旋转。
                var rotation = planet.projection.rotate();
                rotation[0] += dps * delta / 1000;

                if (rotation[0] >= 180) 
                rotation[0] -= 360;

                planet.projection.rotate(rotation);
                lastTick = now;
            }
        });
    };
};

//加载点
function addPingsThing() {
    d3.json("data/coordinates.json", (error, data) => {
        if (error) return console.error(error)

        for (const c of data.coordinates) {
            setInterval(() => {
                globe.plugins.pings.add(c[0], c[1]);
            }, Math.floor(Math.random() * 3000) + 2000);
        }
    })
}
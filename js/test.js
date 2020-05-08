$(function () {
    var globe = planetaryjs.planet();
    // Load our custom `autorotate` plugin; see below.
    //加载我们的自定义“autorotate”插件；请参见下文。
    globe.loadPlugin(autorotate(10));
    // The `earth` plugin draws the oceans and the land; it's actually
    // a combination of several separate built-in plugins.
    //
    // Note that we're loading a special TopoJSON file
    // (world-110m-withlakes.json) so we can render lakes.
    globe.loadPlugin(planetaryjs.plugins.earth({
      topojson: { file:   'data/world-110m-withlakes.json' },
      oceans:   { fill:   '#000080' },
      land:     { fill:   '#339966' },
      borders:  { stroke: '#008000' }
    }));
    // Load our custom `lakes` plugin to draw lakes; see below.
    globe.loadPlugin(lakes({
      fill: '#000080'
    }));
    // The `pings` plugin draws animated pings on the globe.
    //“pings”插件在全球绘制动画pings。
    globe.loadPlugin(planetaryjs.plugins.pings());
    // The `zoom` and `drag` plugins enable
    // manipulating the globe with the mouse.
    //“缩放”和“拖动”插件启用
    //用鼠标操纵地球仪。
    globe.loadPlugin(planetaryjs.plugins.zoom({
      scaleExtent: [100, 300]
    }));
    globe.loadPlugin(planetaryjs.plugins.drag({
      // Dragging the globe should pause the
      // automatic rotation until we release the mouse.
      //拖动地球仪应该会暂停
      //自动旋转直到释放鼠标。
      onDragStart: function() {
        this.plugins.autorotate.pause();
      },
      onDragEnd: function() {
        this.plugins.autorotate.resume();
      }
    }));
    // Set up the globe's initial scale, offset, and rotation.
    //设置球体的初始比例、偏移和旋转。
    globe.projection.scale(175).translate([175, 175]).rotate([0, -10, 0]);
  
    // Every few hundred milliseconds, we'll draw another random ping.
    var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
    setInterval(function() {
      var lat = Math.random() * 170 - 85;
      var lng = Math.random() * 360 - 180;
      var color = colors[Math.floor(Math.random() * colors.length)];
      globe.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: Math.random() * 10 });
    }, 150);
  
    var canvas = document.getElementById('globe');
    // Special code to handle high-density displays (e.g. retina, some phones)
    // In the future, Planetary.js will handle this by itself (or via a plugin).
    //处理高密度显示的特殊代码（例如retina、一些手机）
    //将来，Planetary.js将自己（或通过插件）处理这个问题。
    if (window.devicePixelRatio == 2) {
      canvas.width = 800;
      canvas.height = 800;
      context = canvas.getContext('2d');
      context.scale(2, 2);
    }
    // Draw that globe!
    globe.draw(canvas);
  
    // This plugin will automatically rotate the globe around its vertical
    // axis a configured number of degrees every second.
    //此插件将自动围绕其垂直方向旋转地球
    //轴每秒配置的度数。
    function autorotate(degPerSec) {
      // Planetary.js plugins are functions that take a `planet` instance
      // as an argument...
      //Planetary.js插件是以“planet”为实例的函数
      //作为一个论点。。。
      return function(planet) {
        var lastTick = null;
        var paused = false;
        planet.plugins.autorotate = {
          pause:  function() { paused = true;  },
          resume: function() { paused = false; }
        };
        // ...and configure hooks into certain pieces of its lifecycle.
        //…并将钩子配置到其生命周期的某些部分。
        planet.onDraw(function() {
          if (paused || !lastTick) {
            lastTick = new Date();
          } else {
            var now = new Date();
            var delta = now - lastTick;
            // This plugin uses the built-in projection (provided by D3)
            // to rotate the globe each time we draw it.
            //此插件使用内置投影（由D3提供）
            //每次我们画地球仪时都要旋转。
            var rotation = planet.projection.rotate();
            rotation[0] += degPerSec * delta / 1000;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            lastTick = now;
          }
        });
      };
    };
  
    // This plugin takes lake data from the special
    // TopoJSON we're loading and draws them on the map.
    //这个插件从
    //我们正在加载TopoJSON并在地图上绘制它们。
    function lakes(options) {
      options = options || {};
      var lakes = null;
  
      return function(planet) {
        planet.onInit(function() {
          // We can access the data loaded from the TopoJSON plugin
          // on its namespace on `planet.plugins`. We're loading a custom
          // TopoJSON file with an object called "ne_110m_lakes".
          //我们可以访问从TopoJSON插件加载的数据
          //在“planet.plugins”的名称空间中。我们正在加载一个自定义
          //TopoJSON文件，对象名为“ne m_lakes”。
          var world = planet.plugins.topojson.world;
          lakes = topojson.feature(world, world.objects.ne_110m_lakes);
        });
  
        planet.onDraw(function() {
          planet.withSavedContext(function(context) {
            context.beginPath();
            planet.path.context(context)(lakes);
            context.fillStyle = options.fill || 'black';
            context.fill();
          });
        });
      };
    };
})
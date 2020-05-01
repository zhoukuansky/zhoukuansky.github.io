$(function(){
    globe = new Globe();
    globe.init();
})


const switchLanguage = () => {
	const current = document.getElementsByTagName("html")[0].getAttribute("lang").substr(0, 2)
	document.cookie = "lang=" + (current == "en" ? "zh" : "en")
	location.reload()
}

class Globe {
	constructor() {
		this.canvas = document.getElementById("globe")
		this.planet = planetaryjs.planet()
		this.diameter = 0
	}
	init() {
		this.planet.loadPlugin(this.rotate(10))
		this.planet.loadPlugin(
			planetaryjs.plugins.earth({
				topojson: { file: "data/world-110m-withlakes.json" },
				oceans: { fill: "#dddee0" },
                land: { fill: "#f7f7f7" },
                borders:  { stroke: 'rgb(194, 194, 194)' }
			})
		)
		this.planet.loadPlugin(planetaryjs.plugins.drag({
			onDragStart() {
				this.plugins.rotate.pause()
			},
			onDragEnd() {
				this.plugins.rotate.resume()
			}
		}))

		this.planet.loadPlugin(planetaryjs.plugins.pings({
			color: "#df5f5f", ttl: 2000, angle: 2
		}))

		this.locations()
		this.scale()
		this.planet.draw(this.canvas)
		this.planet.projection.rotate([0, -25, 0]) // Focus on the northern hemisphere
		window.addEventListener("resize", () => this.scale())
	}
	scale() {
        const vw = window.innerWidth
        //返回较大的那个值，通过下列式子 转换成了最大值为500，最小值为300
		const diam = Math.max(300, Math.min(500, vw - (vw * .6)))
		const radius = diam / 2
		this.canvas.width = diam
		this.canvas.height = diam
		this.planet.projection.scale(radius).translate([radius, radius])
		this.diameter = diam
		var vpx=-0.4*diam+200;
		$(".visitor-body").css("padding-top", vpx+"px");
		console.log(vpx+"px")
		console.log()
	}
// 300x+y=80
// 500x+y=0

	rotate(dps) {
		return planet => {
			let lastTick = null
			let paused = false

			planet.plugins.rotate = {
				pause() {
					paused = true
				},
				resume() {
					paused = false
				}
			}

			planet.onDraw(() => {
				if (paused || !lastTick) {
					lastTick = new Date()
				} else {
					const now = new Date()
					const delta = now - lastTick
					const rotation = planet.projection.rotate()
					rotation[0] += dps * delta / 1000

					if (rotation[0] >= 180)
						rotation[0] -= 360
	
					planet.projection.rotate(rotation)
					lastTick = now
				}
			})
		}
	}
	locations() {
		d3.json("data/coordinates.json", (error, data) => {
			if (error) return console.error(error)

			for (const c of data.coordinates) {
				setInterval(() => {
					this.planet.plugins.pings.add(c[0], c[1])
				}, Math.floor(Math.random() * 3000) + 2000)
			}
		})
	}
}

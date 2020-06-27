var tengxun_key = "E52BZ-5TZWS-WJKOS-6VEX2-WLTDQ-UWBNN";

var addrInfo = {
    lng: "",
    lat: "",
    country: "",
    province: "",
    city: "",
    district: "",
    street: "",
    streetNum: "",
}

var locationVue = new Vue({
    el: '#location',
    data: {
        address: "未知•维度•次元",
        order: "0",
    },
})

//ajax获取访问次数
function getOrder() {
    $.ajax({
        url: url + "/webData/getOrder",
        type: "GET",
        dataType: "json",
        data: {},
        headers: {},
        success: function (res) {
            locationVue.order = res.data;
            setCookie("userId", res.data, 600);
        }
    })
}


//获取缓存
function getLocationCache() {
    var value = getCookie("locationCache");
    var userId = getCookie("userId");
    //缓存为空，重新定位并计算一次访问
    if (null == value) {
        getPosition();
    } else {
        //如果缓存内容是"未知•次元"，意味着上次定位失败了。则重新定位。
        if (value == "未知•维度•次元") {
            getPosition();
        } else {
            locationVue.address = value;
            locationVue.order = userId;
        }
    }
}

//发送位置信息给后端
function sendAddrInfo() {

    $.ajax({
        url: url + "/webData/addrInfo",
        type: "POST",
        dataType: "json",
        async: false,
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify({
            country: addrInfo.country,
            province: addrInfo.province,
            city: addrInfo.city,
            district: addrInfo.district,
            street: addrInfo.street,
            streetNum: addrInfo.streetNum,
            lng: addrInfo.lng,
            lat: addrInfo.lat,
        }),
        success: function (res) {
            setCookie("locationCache", locationVue.address, 600);
            getOrder();
        }
    })
}

//地址解析函数
function addressResolution(point) {
    $.ajax({
        type: "get",
        async: false,//jsonp请求时，此设置失效，只能异步
        url: "https://apis.map.qq.com/ws/geocoder/v1",
        data: {
            key: tengxun_key,
            output: "jsonp",
            location: point.lat+","+point.lng,
            get_poi: 0,
        },
        dataType: "jsonp",//数据类型为jsonp  
        success: function (res) {
            addrInfo.country = res.result.address_component.nation;
            addrInfo.province = res.result.address_component.province;
            addrInfo.city = res.result.address_component.city;
            addrInfo.district = res.result.address_component.district;
            addrInfo.street = res.result.address_component.street;
            addrInfo.streetNum = res.result.address_component.street_number;
            //去掉字符串中的省
            if ("省" == res.result.address_component.province.charAt(res.result.address_component.province.length - 1)) {
                res.result.address_component.province = res.result.address_component.province.substr(0, res.result.address_component.province.length - 1)
            }
            //去掉字符串中的市
            if ("市" == res.result.address_component.city.charAt(res.result.address_component.city.length - 1)) {
                res.result.address_component.city = res.result.address_component.city.substr(0, res.result.address_component.city.length - 1)
            }
            locationVue.address = res.result.address_component.nation + " • " + res.result.address_component.province + " • " + res.result.address_component.city;
            //发送位置信息给后端
            sendAddrInfo();
        },
        error: function (res) {
            console.log("腾讯逆地址解析失败");
        }
    });

}

//h5定位,获取经纬度
//通过ip地址获取国家名（百度地图不提供国家名）
function getPosition() {
    var options = {
        enableHighAccuracy: true,
        timeout: 100,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        console.log("此浏览器不支持定位");
    }
}

//h5定位成功，需进行坐标系转换成腾讯坐标系
function showPosition(position) {
    var x = position.coords.longitude; //经度 
    var y = position.coords.latitude;//纬度 
    $.ajax({
        type: "get",
        url: "https://apis.map.qq.com/ws/coord/v1/translate",
        data: {
            key: tengxun_key,
            output: "jsonp",
            locations: y + "," + x,
            type: 1,
        },
        dataType: "jsonp",//数据类型为jsonp  
        success: function (res) {
            addrInfo.lng = res.locations[0].lng;
            addrInfo.lat = res.locations[0].lat;
            //地址解析
            addressResolution(res.locations[0]);
        },
        error: function (res) {
            console.log("腾讯坐标转换失败");
        }
    });
}

//h5定位失败，使用腾讯接口的ip定位
function showError(error) {
    // switch (error.code) {
    //     case error.PERMISSION_DENIED:
    //         alert("用户拒绝对获取地理位置的请求。")
    //         break;
    //     case error.POSITION_UNAVAILABLE:
    //         alert("位置信息是不可用的。")
    //         break;
    //     case error.TIMEOUT:
    //         alert("请求用户地理位置超时。")
    //         break;
    //     case error.UNKNOWN_ERROR:
    //         alert("未知错误。")
    //         break;
    // }
    var geolocation = new BMap.Geolocation({
        maximumAge:0  // 清除缓存
      });
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            $.ajax({
                type: "get",
                url: "https://apis.map.qq.com/ws/coord/v1/translate",
                data: {
                    key: tengxun_key,
                    output: "jsonp",
                    locations: r.point.lat + "," + r.point.lng,
                    type: 3,
                },
                dataType: "jsonp",//数据类型为jsonp  
                success: function (res) {
                    addrInfo.lng = res.locations[0].lng;
                    addrInfo.lat = res.locations[0].lat;
                    //地址解析
                    addressResolution(res.locations[0]);
                },
                error: function (res) {
                    console.log("腾讯坐标转换失败");
                }
            });
        }
        else {
            alert("定位失败");
        }
    }, { enableHighAccuracy: true })
    
}
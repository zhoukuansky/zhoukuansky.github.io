var geoc = new BMap.Geocoder();

var addrInfo={
    province:"",
    city:"",
    district:"",
    street:"",
    streetNumber:"",
    lng:"",
    lat:"",
}

var locationVue = new Vue({
    el: '#location',
    data: {
        address: "未知•次元",
        order:"0",
    },
})

//ajax获取访问次数
function getOrder(){
    $.ajax({
        url: url + "/getOrder",
        type: "GET",
        dataType: "json",
        data: {
        },
        ContentType: "application/json",
        headers: {
        },
        success: function (res) {
            locationVue.order=res.data.order+1;
        }
    })
}


//获取缓存
function getLocationCache(){
    var value=getCookie("locationCache");
    //缓存为空，重新定位并计算一次访问
    if(null==value){
        getPosition();
        sendAddrInfo();
    }else{
        //如果缓存内容是"未知•次元"，意味着上次定位失败了。则重新定位。
        if(value=="未知•次元"){
            getPosition();
        }else{
            locationVue.address=value;
        }
    }
}

//发送位置信息给后端
function sendAddrInfo(){
    $.ajax({
        url: url + "/addrInfo",
        type: "POST",
        dataType: "json",
        data: {
            province:addrInfo.province,
            city:addrInfo.city,
            district:addrInfo.district,
            street:addrInfo.street,
            streetNumber:addrInfo.streetNumber,
            lng:addrInfo.lng,
            lat:addrInfo.lat,
        },
        ContentType: "application/json",
        headers: {
        },
        success: function (res) {
            setCookie("locationCache",locationVue.address,600);
        }
    })
}

//地址解析函数
function addressResolution(point) {
    geoc.getLocation(point, function (rs) {
        var addComp = rs.addressComponents;
        addrInfo.province=addComp.province;
        addrInfo.city=addComp.city;
        addrInfo.district=addComp.district;
        addrInfo.district=addComp.province;
        addrInfo.streetNumber=addComp.streetNumber;
        locationVue.address=addComp.province+" • "+addComp.city;
    });
}

//h5定位,获取经纬度
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

//h5定位成功，需进行坐标系转换成百度坐标系
function showPosition(position) {
    // alert("h5定位成功")
    var x = position.coords.longitude; //经度 
    var y = position.coords.latitude;//纬度 
    var nowPonit = new BMap.Point(x, y);

    //坐标转换
    translateCallback = function (data) {
        if (data.status === 0) {
            addrInfo.lng = data.points[0].lng;
            addrInfo.lat = data.points[0].lat;
            //地址解析
            addressResolution(data.points[0]);
        }
    }
    var convertor = new BMap.Convertor();
    var pointArr = [];
    pointArr.push(nowPonit);
    convertor.translate(pointArr, 1, 5, translateCallback);
}

//h5定位失败，使用浏览器
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
    var geolocation = new   BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {

            addrInfo.lng  = r.point.lng 
            addrInfo.lat  = r.point.lat;
            //地址解析
            addressResolution(r.point);
        }
        else {
            console.log("定位失败");
        }
    }, { enableHighAccuracy: true })
}
var geoc = new BMap.Geocoder();


//地址解析函数
function addressResolution(point) {
    geoc.getLocation(point, function (rs) {
        var addComp = rs.addressComponents;
        console.log(rs.address);
        //alert(addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber);
        var addr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
    });

}

//h5定位
function getPosition() {
    var options = {
        enableHighAccuracy: true,
        timeout: 100,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
    } else {
        alert("浏览器不支持地理定位。");
    }
}

//h5定位成功
function showPosition(position) {
    alert("成功")
    var x = position.coords.longitude; //经度 
    var y = position.coords.latitude;//纬度 
    var nowPonit = new BMap.Point(x, y);

    //坐标转换
    translateCallback = function (data) {
        if (data.status === 0) {
            var xy = data.points[0].lng + "," + data.points[0].lat;
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
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("用户拒绝对获取地理位置的请求。")
            break;
        case error.POSITION_UNAVAILABLE:
            alert("位置信息是不可用的。")
            break;
        case error.TIMEOUT:
            alert("请求用户地理位置超时。")
            break;
        case error.UNKNOWN_ERROR:
            alert("未知错误。")
            break;
    }
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            //alert('您的位置：' + r.point.lng + ',' + r.point.lat);
            var xy = r.point.lng + "," + r.point.lat;
            //地址解析
            addressResolution(r.point);
        }
        else {
            alert("定位失败");
        }
    }, { enableHighAccuracy: true })
}
// image 모양의 CCTV 마커 생성해주는 함수입니다
const createCCTVMarker = (map, position) => {
    const markerImage = new kakao.maps.MarkerImage(
        "https://www.spatic.go.kr/img/kor/marker02.png",
        new kakao.maps.Size(24, 35),
        { offset: new kakao.maps.Point(16, 35) }
    );

    const marker = new kakao.maps.Marker({
        map: map,
        position: position, // new kakao.maps.LatLng(position.lat, position.lng),
        image: markerImage,
        clickable: true,
    });
    marker.setMap(map);
};

// 두 좌표 지점의 거리를 미터로 나타내는 함수입니다.
// startPos: LngLat, endPos: LngLat
function distance(startPos, endPos) {
    const pl = new kakao.maps.Polyline({
        path: [startPos, endPos], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
    });
    return pl.getLength();
}

function resetCircle(marker, circle, infowindow) {
    if (circle && marker && infowindow) {
        circle.setMap(null);
        marker.setMap(null);
        infowindow.close();
    }
}

function getLocation() {
    if (locationCache) {
        map.panTo(locationCache);
    }
    if (navigator.geolocation) {
        // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(
            function (position) {
                currentLat = position.coords.latitude;
                currentLong = position.coords.longitude;
                let current = new kakao.maps.LatLng(currentLat, currentLong);
                locationCache = current;
                map.panTo(current);
            },
            function (error) {
                console.error(error);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity,
            }
        );
    } else {
        alert("GPS를 지원하지 않습니다. 기본좌표는 서울 시청입니다.");
    }
}

function drawCircle(lat, long, cctvCnt) {
    if (cctvCnt >= 3) {
        circle = new kakao.maps.Circle({
            center: new kakao.maps.LatLng(lat, long), // 원의 중심좌표 입니다
            radius: 100, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: "yellowgreen", // 안전 원
            fillColor: "yellowgreen",
            strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: "solid", // 선의 스타일 입니다
            fillOpacity: 0.4, // 채우기 불투명도 입니다
        });
        infowindow = new kakao.maps.InfoWindow({
            content:
                '<div style="width:150px;text-align:center;padding:6px 0;">안전함</div>',
        });
        infowindow.open(map, marker);
    } else {
        circle = new kakao.maps.Circle({
            center: new kakao.maps.LatLng(lat, long), // 원의 중심좌표 입니다
            radius: 100, // 미터 단위의 원의 반지름입니다
            strokeWeight: 5, // 선의 두께입니다
            strokeColor: "red", // 위험 원
            fillColor: "red",
            strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: "solid", // 선의 스타일 입니다
            fillOpacity: 0.4, // 채우기 불투명도 입니다
        });
        infowindow = new kakao.maps.InfoWindow({
            content:
                '<div style="width:150px;text-align:center;padding:6px 0;">위험함</div>',
        });
        infowindow.open(map, marker);
    }

    // 지도에 원을 표시합니다
    circle.setMap(map);
}

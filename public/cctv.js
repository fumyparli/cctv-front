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
  if (navigator.geolocation) {
    // GPS를 지원하면
    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentLat = position.coords.latitude;
        currentLong = position.coords.longitude;
        let current = new kakao.maps.LatLng(currentLat, currentLong);
        map.setCenter(current);
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

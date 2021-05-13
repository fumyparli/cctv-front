let container = document.getElementById("map");
let options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 1,
};
let map = new kakao.maps.Map(container, options);

let input = document.querySelector(".search-input");
let btn = document.querySelector(".search-button");
let form = document.querySelector(".search-form");

let BASE_URL = "http://127.0.0.1:3000";
let marker = null,
    circle = null,
    infowindow = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(input.value);
    let geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(input.value, function (result, status) {
        const { y: lat, x: long } = result[0];

        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
            resetCircle(marker, circle, infowindow);
            var coords = new kakao.maps.LatLng(lat, long);
            // fetch 서버에 요청 하는 부분
            // 응답 받은 배열로 마커 표시 app.js에 랜덤으로 1000개 세팅 되어 있음
            fetch(`${BASE_URL}/coor`)
                .then((response) => response.json())
                .then((data) => {
                    let coords = data.map((coor) => {
                        return new kakao.maps.LatLng(coor[1], coor[0]);
                    });
                    coords.forEach((coor) => {
                        console.log(coor);
                        createCCTVMarker(map, coor);
                        // marker = new kakao.maps.Marker({
                        //   map: map,
                        //   position: coor,
                        // });
                    });
                    console.log("DONE");
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            // 결과값으로 받은 위치를 마커로 표시합니다
            marker = new kakao.maps.Marker({
                map: map,
                position: coords,
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            infowindow = new kakao.maps.InfoWindow({
                content:
                    '<div style="width:150px;text-align:center;padding:6px 0;">안전함</div>',
            });
            infowindow.open(map, marker);

            circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(lat, long), // 원의 중심좌표 입니다
                radius: 50, // 미터 단위의 원의 반지름입니다
                strokeWeight: 5, // 선의 두께입니다
                // strokeColor: "red", // 위험 원
                // fillColor: "red",
                strokeColor: "yellowgreen", // 안전 원
                fillColor: "yellowgreen",
                strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                strokeStyle: "solid", // 선의 스타일 입니다
                fillOpacity: 0.4, // 채우기 불투명도 입니다
            });

            // 지도에 원을 표시합니다
            circle.setMap(map);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });
});

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

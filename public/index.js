let container = document.getElementById("map");
let currentLat = 37.5666805;
let currentLong = 126.9784147;

let options = {
    center: new kakao.maps.LatLng(currentLat, currentLong),
    level: 3,
};
let map = new kakao.maps.Map(container, options);

let locationCache;
let markerCache = new Set();

let input = document.querySelector(".search-input");
let btn = document.querySelector(".search-button");
let form = document.querySelector(".search-form");

let BASE_URL = "https://cctv-map-yydtc.run.goorm.io/api";
let marker = null,
    circle = null,
    infowindow = null;

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value === "") {
        getLocation();
        return;
    }
    let geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(input.value, function (result, status) {
        const { y: lat, x: long } = result[0];

        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
            resetCircle(marker, circle, infowindow);
            var coords = new kakao.maps.LatLng(lat, long);
            // fetch 서버에 요청 하는 부분
            // 응답 받은 배열로 마커 표시 app.js에 랜덤으로 1000개 세팅 되어 있음
            fetch(`${BASE_URL}/get_cctv_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: long,
                    radius: 1,
                }),
            })
                .then((response) => response.json())
                .then((res) => {
                    let { result } = res;
                    let coords = result.map((data) => {
                        return new kakao.maps.LatLng(
                            data.latitude,
                            data.longitude
                        );
                    });
                    cctvCnt = coords.length;
                    coords.forEach((coor) => {
                        if (!markerCache.has(JSON.stringify(coor))) {
                            markerCache.add(JSON.stringify(coor));
                            createCCTVMarker(map, coor);
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error:", error);
                });

            fetch(`${BASE_URL}/get_cctv_list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    latitude: lat,
                    longitude: long,
                    radius: 0.1,
                }),
            })
                .then((response) => response.json())
                .then((res) => {
                    drawCircle(lat, long, res.length);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            // 결과값으로 받은 위치를 마커로 표시합니다
            marker = new kakao.maps.Marker({
                map: map,
                position: coords,
            });

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.panTo(coords);
        }
    });
    input.value = "";
});

kakao.maps.event.addListener(map, "click", function (mouseEvent) {
    const latlng = mouseEvent.latLng;
    const lat = latlng.getLat(),
        long = latlng.getLng();
    const rad = 100;
    resetCircle(marker, circle, infowindow);
    fetch(`${BASE_URL}/get_cctv_list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: long,
            radius: 1,
        }),
    })
        .then((response) => response.json())
        .then((res) => {
            let { result } = res;
            let coords = result.map((data) => {
                return new kakao.maps.LatLng(data.latitude, data.longitude);
            });
            cctvCnt = coords.length;

            coords.forEach((coor) => {
                if (!markerCache.has(JSON.stringify(coor))) {
                    markerCache.add(JSON.stringify(coor));
                    createCCTVMarker(map, coor);
                }
            });
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    fetch(`${BASE_URL}/get_cctv_list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            latitude: lat,
            longitude: long,
            radius: 0.1,
        }),
    })
        .then((response) => response.json())
        .then((res) => {
            drawCircle(lat, long, res.length);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    marker = new kakao.maps.Marker({
        map: map,
        position: latlng,
    });

    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
    map.panTo(latlng);
});

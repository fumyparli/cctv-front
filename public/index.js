let container = document.getElementById("map");
let currentLat = 37.5666805;
let currentLong = 126.9784147;

let options = {
  center: new kakao.maps.LatLng(currentLat, currentLong),
  level: 1,
};
let map = new kakao.maps.Map(container, options);

let locationCache;
getLocation();

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
          console.log(res);
          let { result } = res;
          let coords = result.map((data) => {
            return new kakao.maps.LatLng(data.latitude, data.longitude);
          });
          coords.forEach((coor) => {
            console.log(coor);
            createCCTVMarker(map, coor);
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
      map.panTo(coords);
    }
  });
  input.value = "";
});

kakao.maps.event.addListener(map, "click", function (mouseEvent) {
  const latlng = mouseEvent.latLng;
  const lat = latlng.getLat(), long = latlng.getLng();
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
      coords.forEach((coor) => {
        console.log(coor);
        createCCTVMarker(map, coor);
      });
      console.log("DONE");
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  marker = new kakao.maps.Marker({
    map: map,
    position: latlng,
  });

  infowindow = new kakao.maps.InfoWindow({
    content:
      '<div style="width:150px;text-align:center;padding:6px 0;">안전함</div>',
  });
  infowindow.open(map, marker);

  circle = new kakao.maps.Circle({
    center: latlng,
    radius: rad,
    strokeWeight: 5,
    strokeColor: "yellowgreen", // 안전 원
    fillColor: "yellowgreen",
    strokeOpacity: 0.7,
    strokeStyle: "solid",
    fillOpacity: 0.4,
  });

  // 지도에 원을 표시합니다
  circle.setMap(map);

  // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
  map.panTo(latlng);
});

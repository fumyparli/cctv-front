let container = document.getElementById("map");
let options = {
    center: new kakao.maps.LatLng(33.450701, 126.570667),
    level: 1,
};
let map = new kakao.maps.Map(container, options);

let input = document.querySelector(".searchInput");
let btn = document.querySelector(".searchButton");
let form = document.querySelector(".searchForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(input.value);
    let geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(input.value, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            // axios

            // 결과값으로 받은 위치를 마커로 표시합니다
            var marker = new kakao.maps.Marker({
                map: map,
                position: coords,
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            var infowindow = new kakao.maps.InfoWindow({
                content:
                    '<div style="width:150px;text-align:center;padding:6px 0;">위험함</div>',
            });
            infowindow.open(map, marker);

            var circle = new kakao.maps.Circle({
                center: new kakao.maps.LatLng(result[0].y, result[0].x), // 원의 중심좌표 입니다
                radius: 50, // 미터 단위의 원의 반지름입니다
                strokeWeight: 5, // 선의 두께입니다
                // strokeColor: "#75B8FA", // 선의 색깔입니다
                strokeColor: "red",
                strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                // strokeStyle: "dashed", // 선의 스타일 입니다
                // fillColor: "#CFE7FF", // 채우기 색깔입니다
                fillColor: "red",
                fillOpacity: 0.7, // 채우기 불투명도 입니다
            });

            // 지도에 원을 표시합니다
            circle.setMap(map);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });
});

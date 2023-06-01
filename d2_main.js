function showModal(message) {
  // 모달 요소 가져오기
  const modalContainer = document.getElementById('modalContainer');
  const modalMessage = document.getElementById('modalMessage');
  const modalCloseButton = document.getElementById('modalCloseButton');

  // // 모달 내용 설정
  modalMessage.textContent = message;

  // 모달 보이기
  modalContainer.style.display = 'block';

  // 닫기 버튼 클릭 이벤트 핸들러
  modalCloseButton.addEventListener('click', () => {
    // 모달 숨기기
    modalContainer.style.display = 'none';
  });
}

showModal('침입이 탐지되었습니다.');

// 차트 렌더링 함수
function renderChart() {
  // 차트에서 사용될 색깔 정의
  const backColor = [
    'rgba(255, 67, 67, 1)',
    'rgba(209, 51, 51, 1)',
    'rgba(0, 114, 198, 1)',
    'rgba(0, 182, 228, 1)',
    'rgba(0, 163, 0, 1)',
    'rgba(89, 197, 164, 1)',
    'rgba(218, 247, 235, 1)',
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 205, 86)'
  ];
  // 1번째 차트 => NFW => IP ** NFW 그룹 바이한 결과를 서버에 요청해서 받는 코드 작성해야함.
  // 서버에 NFW 그룹 바이한 결과를 요청해서 받아오는 코드
  const firstValue = [50, 60, 70, 80, 90, 100, 110, 120]; //ALL영역에서 차단 IP개수를 넣기 -> group by
  const firstLabel = [7, 8, 8, 9, 9, 9, 10, 11]; //차단된 IP이름을 넣고
  const firstLogChart = document.getElementById('firstLogChart');

  new Chart(firstLogChart, {
    type: 'doughnut',
    data: {
      labels: firstLabel,
      datasets: [
        {
          label: 'IP',
          data: firstValue.sort(),
          backgroundColor: backColor,
          hoverOffset: 4
        }]
    },
    options: {
      legend: {
        display: true,
        position: 'right',
        align: 'start',
        fullWidth: false,
      },
      responsive: false
    }
  });
  // fetch('http://localhost:3000/log/nfwChart')
  //   .then(data => {

  //   })
  //   .catch(error => {
  //     console.error('MainPage NFW Chart Error: ', error);
  //   });



  // 서버에 WAF 그룹 바이한 결과를 요청해서 받아오는 코드
  fetch('http://52.6.101.20:3000/log/wafChart')
    .then(response => response.json())
    .then(data => {
      let secondValue = [];
      let secondLabel = [];
      let groupByList = []; // 룰셋 이름 (ex: CoreRuleSet)및 카운트를 가진 객체 배열
      let ruleSet;

      // split한 룰셋 이름 ex: coreRuleSet
      data.forEach(wafRuleSet => {  
        ruleSet = wafRuleSet._id.name.split(':'); // CoreRuleSet:.... 이렇게 들어오고 있음. 따라서 룰셋 별로 가공해줘야함.
        const label = ruleSet[ruleSet.length - 2];
        // 룰셋별로 groupByList에 저장. 기존에 없으면 새로 추가 있으면 검출된 카운트 더해줌.
        foundRuleSet = groupByList.find(obj => obj.label === label);
        if (foundRuleSet) {
          foundRuleSet.count += wafRuleSet.count;
        } else {
          groupByList.push({ label: label, count: wafRuleSet.count });
        }
      });

        groupByList.forEach(wafRuleSet => {
        secondValue.push(wafRuleSet.count);
        secondLabel.push(wafRuleSet.label);
      });

      // // 2번째 차트 => WAF => Rule Set
      // const secondValue = [50,60,70,80,90,100,110,120]; // 룰셋 별 막은 횟수 -> group by 해야될듯?
      // const secondLabel = [7,8,8,9,9,9,10,11]; // 차단 룰셋 이름      
      const secondLogChart = document.getElementById('secondLogChart');

      new Chart(secondLogChart, {
        type: 'doughnut',
        data: {
          labels: secondLabel,
          datasets: [
            {
              label: 'RuleSet',
              data: secondValue,
              backgroundColor: backColor,
              hoverOffset: 4
            }]
        },
        options: {
          legend: {
            display: true,
            position: 'right',
            align: 'start',
            fullWidth: false,
          },
          responsive: false
        }
      });
    })
    .catch(error => {
      console.error('MainPage WAF Chart Error: ', error);
    });
}
renderChart();

// GuardDuty    
const high = document.getElementById('high');
const mid = document.getElementById('mid');
const low = document.getElementById('low');

var dataGd = {
  test1: 1,
  test2: 2,
  severity: 3
}

function severityData(dataGd) {
  var highGradeNum, midGradeNum, lowGradeNum = 0;
  var gradeData = { 'high': highGradeNum, 'mid': midGradeNum, 'low': lowGradeNum };
  if (dataGd.severity > 6.9 && dataGd.severity < 9.0) {
    highGradeNum = highGradeNum + 1;
    return gradeData['high'];
  }
  else if (dataGd.severity > 3.9 && dataGd.severity < 7.0) {
    midGradeNum = midGradeNum + 1;
    return gradeData['mid'];
  }
  else if (dataGd.severity > 0.9 && dataGd.severity < 4.0) {
    lowGradeNum = lowGradeNum + 1;
    return gradeData['low'];
  }

  high.innerHTML = gradeData['high'];
  mid.innerHTML = gradeData['mid'];
  low.innerHTML = gradeData['low'];
}

severityData(dataGd);

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 2,
    center: { lat: 37, lng: 150 },
    minZoom: 2,
    restriction: {
      latLngBounds: {
        north: 90,
        south: -90,
        east: 240,
        west: 40,
      },
    },
  });
  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Add some markers to the map.
  const markers = locations.map((position, i) => {
    const label = labels[i % labels.length];
    const marker = new google.maps.Marker({
      position,
      label,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", () => {
      infoWindow.setContent(label);
      infoWindow.open(map, marker);
    });
    return marker;
  });

  // Add a marker clusterer to manage the markers.
  new markerClusterer.MarkerClusterer({ map, markers });

}

// // json 파일 불러와서 locations에 저장
// fetch('./locations_json')
//   .then(response => response.json())
//   .then(data => {
//     // data 변수에 JSON 데이터가 저장됨
//     // 이후에 필요한 작업을 수행합니다
//     console.log(data); // 예시: 데이터 출력
//     const locations = data;
//   })
//   .catch(error => {
//     // 오류 처리
//     console.error('location json Error:', error);
//   });

// 서버에 WAF 그룹 바이한 결과를 요청해서 받아오는 코드
fetch('http://52.6.101.20:3000/log/nfw/map')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
const locations = [
  // Marker positions (json파일로 받아올 것)
  { lat: -31.56391, lng: 147.154312 }
];

initMap();
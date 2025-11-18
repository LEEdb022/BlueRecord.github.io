// ===============================================
// 🎯 룰렛 항목을 설정하는 배열 (사용자 정의 가능)
// -----------------------------------------------
const rouletteItems = [
    "비노벨",
    "어드벤쳐",
    "인터렉티브영화",
    "rpg",
    "포인트앤클릭",
    "미연시",
    "추리",
    "시뮬레이션경영",
    "퍼즐",
    "뽑기(only수집형)",
    "뽑은사람 마음대로"
];
// ===============================================

const wheel = document.getElementById('rouletteWheel');
const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('resultText');

// 룰렛 항목 갯수
const itemCount = rouletteItems.length;

// 각 항목을 회전시키기 위한 각도 (360도를 항목 갯수로 나눔)
const anglePerItem = 360 / itemCount; 

// 룰렛 항목의 높이 (CSS 변수와 동일하게 설정)
const itemHeight = 50; 
// 룰렛 회전의 중심(반지름)을 계산합니다.
// 항목들이 겹치지 않고 원통 형태로 배치되도록 계산합니다.
// 'itemHeight / 2'는 항목의 중심까지의 거리, 'tan(anglePerItem / 2)'는 항목 간격
const radius = Math.round( (itemHeight / 2) / Math.tan(Math.PI / itemCount) );


/**
 * 룰렛 항목을 동적으로 생성하고 배치합니다.
 */
function createRouletteItems() {
    rouletteItems.forEach((text, index) => {
        const item = document.createElement('div');
        item.className = 'roulette-item';
        item.textContent = text;
        
        // 각 항목을 3D 공간에 배치하고 회전시킵니다.
        // rotateX: 항목을 수직으로 회전
        // translateZ: 항목을 Z축으로 밀어 원통 형태를 만듭니다.
        item.style.transform = `
            rotateX(${index * anglePerItem}deg) 
            translateZ(${radius}px)
        `;
        
        wheel.appendChild(item);
    });
}

/**
 * 룰렛 회전을 시작하고 결과를 계산합니다.
 */
function spinRoulette() {
    // 이미 회전 중이면 실행하지 않습니다.
    if (wheel.classList.contains('spinning')) return;

    // 1. 룰렛 항목에서 랜덤하게 하나의 인덱스(당첨 항목)를 선택
    const randomIndex = Math.floor(Math.random() * itemCount);
    const selectedItem = rouletteItems[randomIndex];

    // 2. 당첨 항목이 정면으로 오도록 필요한 최종 회전 각도를 계산
    // 항목을 정면으로 돌리는 기본 각도: randomIndex * anglePerItem
    // 전체를 여러 바퀴 돌려서 애니메이션 효과를 부여: (10 바퀴 * 360도)
    // 룰렛은 시계 반대 방향(음수)으로 회전해야 항목이 위에서 아래로 내려오는 것처럼 보입니다.
    const rotationDegrees = (10 * 360) + (randomIndex * anglePerItem);
    const finalRotation = -rotationDegrees; // 음수: 시계 반대 방향 회전

    // 이전 애니메이션 클래스와 트랜스폼을 제거
    wheel.classList.remove('spinning');
    wheel.style.transform = `rotateX(0deg)`; // 초기화 (애니메이션이 끝난 후 다시 설정)
    
    // 강제 리플로우를 통해 트랜스폼 초기화가 적용되도록 함
    void wheel.offsetWidth; 

    // 최종 각도를 설정하고 애니메이션을 시작
    wheel.style.transition = 'transform 5s ease-out';
    wheel.style.transform = `rotateX(${finalRotation}deg)`;
    wheel.classList.add('spinning');

    resultText.textContent = `결과: 돌리는 중...`;
    spinButton.disabled = true; // 회전 중 버튼 비활성화

    // 3. 애니메이션 종료 후 결과 표시
    setTimeout(() => {
        // 애니메이션이 끝나면 애니메이션 클래스 제거
        wheel.classList.remove('spinning');
        // 최종 상태를 유지하기 위해 transition 제거
        wheel.style.transition = 'none'; 
        
        resultText.textContent = `결과: 🎉 ${selectedItem} 🎉`;
        spinButton.disabled = false;
    }, 5000); // CSS 애니메이션 시간(5s)과 일치시켜야 함
}

// 초기화: 룰렛 항목 생성
createRouletteItems();

// 이벤트 리스너: 버튼 클릭 시 회전 시작
spinButton.addEventListener('click', spinRoulette);
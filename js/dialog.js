// 대사 스크립트
const script = [
  { name: "???", text: "...", face: "" },
  { name: "???", text: "아, 드디어 누군가가 찾아오다니...", face: "" },
  { name: "???", text: "반가워, 반가워. 누군가랑 대화하는데 정말 오래되었는데...", face: "" },
  { name: "???", text: "물론 여기선 네 얼굴을 볼 순 없지만,", face: "" },
  { name: "???", text: "...", face: "" },
  { name: "???", text: "공지?", face: "" },
  { name: "???", text: "아, 그래서 나에게...", face: "" },
  { name: "???", text: "어쨌든, 잘왔어. 여긴... 모든 세계의 정보가 담긴 자료보관소라고 해야할까.", face: "" },
  { name: "???", text: "난 여기 안내원인것 같고...", face: "" },
  { name: "???", text: "이미 내가 있는 공간에 들어오기전에 다른곳을 둘러보고 왔으면 내 말을 이해하기 쉬울거야.", face: "" },
  { name: "???", text: "그래, 너는 세상이 만들어지고 사라지는걸 볼 수 있는 중요한곳에 있어.", face: "" },
  { name: "???", text: "이곳에 초대를 받은걸 영광으로 생각해.", face: "" },
  { name: "???", text: "물론 나를 만난것도.", face: "" },
  { name: "???", text: "천천히 둘러봐. 여긴 뭐든지 굉장히 많으니까...", face: "" },
  { name: "???", text: "아, 자료는 가지고 나가지 말아줘. 아직 자료에 대한 규칙을 정해둔게 없어.", face: "" },
  { name: "???", text: "그럼 즐거운 관람이 되길.", face: "" },
];

let lineIndex = 0;
let typingInterval;
let isTyping = false;
let requestedNext = false; // 타이핑 중에 클릭했는지 플래그

// DOM 요소는 DOMContentLoaded 이후에 조회합니다 (더 안전하게)
let dialogBox;
let nameBox;
let textBox;
let facechip;

// 타이핑 효과 함수
function typeText(text) {
  if (!textBox) return; // 안전 검사
  textBox.textContent = '';
  let i = 0;
  isTyping = true;

  typingInterval = setInterval(() => {
    if (i < text.length) {
      textBox.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typingInterval);
      isTyping = false;
    }
  }, 30);
}

// 대사 표시 함수
function showLine(index) {
  const line = script[index];
  if (!line) return;
  if (nameBox) nameBox.textContent = line.name || '';
  typeText(line.text || '');
  if (facechip && line.face) {
    facechip.style.backgroundImage = `url('${line.face}')`;
  }
}

// 클릭 시 다음 대사
function nextLine() {
  if (isTyping) {
    // 타이핑 중인 상태에서 첫 클릭은 전체 텍스트를 즉시 채우게 하고,
    // 추가 클릭에서 다음 줄로 넘어가게 처리합니다.
    if (!requestedNext) {
      clearInterval(typingInterval);
      const prev = script[Math.max(0, lineIndex - 1)];
      if (textBox && prev) textBox.textContent = prev.text;
      isTyping = false;
      requestedNext = true;
      return;
    }
  }

  // 이미 타이핑이 끝났고, 이전에 클릭으로 완료 요청이 있었다면 진행
  if (!isTyping) {
    requestedNext = false;
    if (lineIndex < script.length) {
      showLine(lineIndex);
      lineIndex++;
    } else {
      if (dialogBox) {
        dialogBox.innerHTML = "<div style='text-align:center;'>대화가 끝났습니다.</div>";
      }
    }
  }
}

// 이벤트 등록 (DOM이 준비된 후)
document.addEventListener("DOMContentLoaded", () => {
  // DOM 요소 조회
  dialogBox = document.getElementById('dialog-box');
  nameBox = document.getElementById('character-name');
  textBox = document.getElementById('dialog-text');
  facechip = document.getElementById('facechip');

  if (dialogBox) {
    dialogBox.addEventListener('click', nextLine);
  } else {
    console.warn('dialog.js: #dialog-box 요소를 찾을 수 없습니다.');
  }

  // 최초 한 줄 표시
  nextLine();
});

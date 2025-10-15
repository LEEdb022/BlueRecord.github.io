const ITEMS_PER_PAGE = 35;
let characters = [];
let filteredData = [];
let currentPage = 1;

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const charListEl = document.getElementById("character-list");
const charCountSpan = document.getElementById("charCount");
const charRangeEl = document.getElementById("character-count");
const paginationEl = document.getElementById("pagination");

// 캐릭터 카드 생성
function createCharacterCard(char, index) {
  const imgSrc = char.image
    ? char.image
    : "https://via.placeholder.com/120x120?text=No+Image";
  let bgColor = "#fff";
  if (char.tag === "SV") bgColor = "#ffe5e5"; // SV 태그면 연빨강 배경
  if (char.tag === "DEE") bgColor = "#D8C7E8";
  if (char.tag === "SF") bgColor = "#e5f0ff"; // SF 태그면 연파랑 배경
  if (char.tag === "CC") bgColor = "#3b3b4a";
  if (char.tag === "TC") bgColor = "#e8e8e8"; // ETC 태그면 연회색 배경

  const div = document.createElement("div");
  div.className = "character";
  div.style.background = bgColor;
  div.innerHTML = `
    <a href="${char.html}" style="text-decoration:none; color:inherit;">
      <div class="char-number">#${index}</div>
      <img src="${imgSrc}" alt="${char.name}" style="width:110px;height:110px;object-fit:cover;border-radius:8px;">
      <div class="character-name">${char.name}</div>
    </a>
  `;
  return div;
}

// 캐릭터 목록 렌더링
function renderPage(page) {
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  page = Math.max(1, Math.min(page, totalPages));
  currentPage = page;
  charCountSpan.innerText = totalItems;

  if (totalItems === 0) {
    charListEl.innerHTML =
      "<div style='padding:40px; text-align:center; color:#333;'>검색 결과가 없습니다.</div>";
    charRangeEl.innerText = "총 0명";
    paginationEl.innerHTML = "";
    return;
  }

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = Math.min(start + ITEMS_PER_PAGE, totalItems);
  const pageItems = filteredData.slice(start, end);
  charRangeEl.innerText = `총 ${totalItems}명 중 ${start + 1}~${end}번째 캐릭터`;

  charListEl.innerHTML = "";
  pageItems.forEach((char, i) => {
    const globalIndex = characters.findIndex((c) => c.id === char.id) + 1;
    charListEl.appendChild(createCharacterCard(char, globalIndex));
  });

  renderPagination(totalPages, page);
}

// 페이지네이션 렌더링
function renderPagination(totalPages, page) {
  paginationEl.innerHTML = "";
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "◀ 이전";
  prevBtn.disabled = page <= 1;
  prevBtn.onclick = () => renderPage(page - 1);
  paginationEl.appendChild(prevBtn);

  const info = document.createElement("span");
  info.innerText = ` ${page} / ${totalPages} `;
  info.style.margin = "0 8px";
  paginationEl.appendChild(info);

  const nextBtn = document.createElement("button");
  nextBtn.innerText = "다음 ▶";
  nextBtn.disabled = page >= totalPages;
  nextBtn.onclick = () => renderPage(page + 1);
  paginationEl.appendChild(nextBtn);
}

// 검색 필터링
function filterCharacters() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    filteredData = characters.slice();
  } else {
    filteredData = characters.filter((c) => {
      return (
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
      );
    });
  }
  renderPage(1);
}

// 데이터 불러오기
function loadCharacters() {
  fetch("characters.json")
    .then((res) => {
      if (!res.ok) throw new Error("characters.json을 불러오는 데 실패했습니다.");
      return res.json();
    })
    .then((data) => {
      characters = Array.isArray(data) ? data : [];
      filteredData = characters.slice();
      renderPage(1);
    })
    .catch((err) => {
      charListEl.innerHTML = `<div style='color:#c00; padding:20px;'>캐릭터 목록을 불러오지 못했습니다.<br>${err.message}</div>`;
      charRangeEl.innerText = "";
      paginationEl.innerHTML = "";
    });
}

// 이벤트 바인딩
searchBtn.addEventListener("click", filterCharacters);
searchInput.addEventListener("input", filterCharacters);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") filterCharacters();
});

loadCharacters();

// (옵션) 실시간 검색(입력할 때마다 필터) - 원치 않으면 주석 처리
// let debounceTimer = null;
// searchInput.addEventListener("input", () => {
//   clearTimeout(debounceTimer);
//   debounceTimer = setTimeout(filterCharacters, 200);
// });

const backToTop = document.getElementById("back-to-top");

// 스크롤이 일정 이상 내려가면 버튼 보이기
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
});

// 버튼 클릭 시 부드럽게 위로 이동
backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

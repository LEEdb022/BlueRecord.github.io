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

  const div = document.createElement("div");
  div.className = "character";
  if (char.tag) div.dataset.tag = char.tag;
  div.innerHTML = `
    <a href="${char.html}" style="text-decoration:none; color:inherit;">
      <div class="char-number">#${index}</div>
      <img src="${imgSrc}" alt="${char.name}">
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

// 페이지네이션 렌더링 (숫자 버튼 포함)
function renderPagination(totalPages, page) {
  paginationEl.innerHTML = "";
  if (totalPages <= 1) return;

  // 이전 버튼
  const prevBtn = document.createElement("button");
  prevBtn.innerText = "◀";
  prevBtn.className = "page-btn";
  prevBtn.disabled = page <= 1;
  prevBtn.onclick = () => renderPage(page - 1);
  paginationEl.appendChild(prevBtn);

  // 숫자 버튼 범위 계산 (현재 페이지 기준 앞뒤 2개)
  const delta = 2;
  const range = [];
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    range.push(i);
  }

  // 첫 페이지 + 말줄임
  if (range[0] > 1) {
    appendPageBtn(1, page);
    if (range[0] > 2) appendEllipsis();
  }

  // 숫자 버튼들
  range.forEach(n => appendPageBtn(n, page));

  // 끝 페이지 + 말줄임
  if (range[range.length - 1] < totalPages) {
    if (range[range.length - 1] < totalPages - 1) appendEllipsis();
    appendPageBtn(totalPages, page);
  }

  // 다음 버튼
  const nextBtn = document.createElement("button");
  nextBtn.innerText = "▶";
  nextBtn.className = "page-btn";
  nextBtn.disabled = page >= totalPages;
  nextBtn.onclick = () => renderPage(page + 1);
  paginationEl.appendChild(nextBtn);

  function appendPageBtn(n, currentPage) {
    const btn = document.createElement("button");
    btn.innerText = n;
    btn.className = "page-btn" + (n === currentPage ? " active" : "");
    btn.onclick = () => renderPage(n);
    paginationEl.appendChild(btn);
  }

  function appendEllipsis() {
    const span = document.createElement("span");
    span.innerText = "…";
    span.className = "page-ellipsis";
    paginationEl.appendChild(span);
  }
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

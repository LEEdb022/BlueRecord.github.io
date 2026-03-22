// 검색 기능
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

function filterCharacters() {
  const query = searchInput.value.toLowerCase();
  const filtered = characters.filter(c => c.name.toLowerCase().includes(query));
  renderCharacters(filtered);
}

// 버튼 클릭 시 검색 실행
searchBtn.addEventListener("click", filterCharacters);

// 엔터 키 입력 시 검색 실행
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    filterCharacters();
  }
});

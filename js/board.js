const POSTS_PER_PAGE = 20;
let currentPage = 1;

// 로컬 글 데이터
const posts = [
  { id: "article1", title: "뽤뽥밝ㄱ", markdown: "markdown/Ragus.md", thumb: "images/thumb1.png" },
  // 필요하면 추가
];

const postListEl = document.getElementById("post-list");
const paginationEl = document.getElementById("board-pagination");

function renderPage(page) {
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  currentPage = page;

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = Math.min(start + POSTS_PER_PAGE, posts.length);
  const pagePosts = posts.slice(start, end);

  postListEl.innerHTML = "";

  pagePosts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post-item";
    div.innerHTML = `
      ${post.thumb ? `<img src="${post.thumb}" alt="썸네일">` : ""}
      <div class="post-title">${post.title}</div>
    `;
    div.style.cursor = "pointer";
    div.onclick = () => window.location.href = `post.html?id=${post.id}`;
    postListEl.appendChild(div);
  });

  renderPagination(totalPages, page);
}

function renderPagination(totalPages, page) {
  paginationEl.innerHTML = "";

  if (page > 1) {
    const prev = document.createElement("button");
    prev.innerText = "◀ 이전";
    prev.onclick = () => renderPage(page - 1);
    paginationEl.appendChild(prev);
  }

  if (page < totalPages) {
    const next = document.createElement("button");
    next.innerText = "다음 ▶";
    next.style.marginLeft = "10px";
    next.onclick = () => renderPage(page + 1);
    paginationEl.appendChild(next);
  }
}

// 초기 렌더링
renderPage(currentPage);

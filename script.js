(() => {
  'use strict';
  const root = new URL('.', document.currentScript.src);
  const fallback = new URL('images/lim.svg', root).href;
  function imageFallback(img) {
    img.addEventListener('error', () => {
      if (img.src !== fallback) { img.src = fallback; img.title = '이미지를 준비 중입니다'; }
    });
    if (img.complete && !img.naturalWidth && img.src !== fallback) img.src = fallback;
  }
  document.querySelectorAll('img').forEach(imageFallback);
  const list = document.querySelector('#character-list');
  const legacy = document.querySelector('#legacy-status');
  if (!list && !legacy) return;
  const safeUrl = (value) => {
    const url = new URL(value, root);
    if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported URL');
    return url.href;
  };
  fetch(new URL('characters.json', root)).then(r => {
    if (!r.ok) throw new Error('Data unavailable');
    return r.json();
  }).then(data => {
    if (!Array.isArray(data)) throw new Error('Invalid data');
    if (legacy) {
      const c = data.find(c => c.id === new URLSearchParams(location.search).get('id'));
      if (c) location.replace(safeUrl(c.html));
      else legacy.textContent = '캐릭터를 찾을 수 없습니다.';
      return;
    }
    const input = document.querySelector('#search');
    const status = document.querySelector('#status');
    const pages = document.querySelector('#pagination');
    let page = 1;
    const normalize = s => String(s).normalize('NFKC').toLocaleLowerCase('ko').trim();
    function render(writeUrl = true) {
      const term = normalize(input.value);
      const filtered = data.filter(c => normalize(c.name).includes(term));
      const count = Math.max(1, Math.ceil(filtered.length / 50));
      page = Math.min(count, Math.max(1, page));
      list.replaceChildren(); pages.replaceChildren();
      status.textContent = term ? `검색 결과 ${filtered.length}명 / 전체 ${data.length}명` : `전체 ${data.length}명`;
      if (filtered.length) status.textContent += ` · ${page} / ${count} 페이지`;
      filtered.slice((page - 1) * 50, page * 50).forEach(c => {
        const li = document.createElement('li'), a = document.createElement('a');
        a.className = 'character-card'; a.href = safeUrl(c.html);
        const box = document.createElement('div'); box.className = 'card-image';
        const img = document.createElement('img'); img.alt = ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 180; img.height = 180;
        imageFallback(img); img.src = safeUrl(c.image || 'images/lim.svg');
        const name = document.createElement('span'); name.className = 'card-name'; name.textContent = c.name;
        box.append(img); a.append(box, name); li.append(a); list.append(li);
      });
      if (!filtered.length) { const li = document.createElement('li'); li.className = 'empty'; li.textContent = '검색 결과가 없습니다. 다른 이름으로 검색해 주세요.'; list.append(li); }
      function button(label, target, disabled = false) {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.disabled = disabled;
        if (String(target) === label) { b.setAttribute('aria-label', `${target}페이지`); if (target === page) b.setAttribute('aria-current', 'page'); }
        b.onclick = () => { page = target; render(); document.querySelector('.list-meta').scrollIntoView({block:'start'}); const active = pages.querySelector('[aria-current]'); if (active) active.focus({preventScroll:true}); };
        pages.append(b);
      }
      if (count > 1) {
        button('이전', page - 1, page === 1);
        const keep = new Set([1,count,page-1,page,page+1]); let previous = 0;
        [...keep].filter(n => n >= 1 && n <= count).sort((a,b)=>a-b).forEach(n => {
          if (previous && n - previous > 1) { const gap = document.createElement('span'); gap.textContent = '…'; pages.append(gap); }
          button(String(n), n); previous = n;
        });
        button('다음', page + 1, page === count);
      }
      if (writeUrl) { const url = new URL(location.href); url.searchParams.delete('q'); url.searchParams.delete('page'); if (input.value.trim()) url.searchParams.set('q',input.value.trim()); if (page > 1) url.searchParams.set('page',page); history.replaceState(null,'',url); }
    }
    function restore() { const params = new URLSearchParams(location.search); input.value = params.get('q') || ''; page = Number.parseInt(params.get('page'),10) || 1; render(); }
    let timer;
    input.addEventListener('input', e => { if (e.isComposing) return; clearTimeout(timer); timer=setTimeout(()=>{page=1;render();},120); });
    input.addEventListener('compositionend',()=>{clearTimeout(timer);page=1;render();});
    document.querySelector('.search').addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);page=1;render();});
    window.addEventListener('popstate',restore); restore();
  }).catch(() => {
    const status = document.querySelector('#status') || legacy;
    status.textContent = '목록을 불러오지 못했습니다. 연결 상태와 characters.json 파일을 확인한 뒤 새로고침해 주세요.';
  });
})();

(() => {
  const root = new URL('.', document.currentScript.src);
  const wiki = document.querySelector('[data-character]');
  if (!wiki) return;
  const dialog = document.querySelector('.image-dialog');
  const large = dialog.querySelector('img');
  let trigger, oldOverflow;
  function openImage(img, button) {
    trigger = button; large.src = img.currentSrc || img.src; large.alt = img.alt;
    dialog.querySelector('.zoom-caption').textContent = img.alt;
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; dialog.showModal();
  }
  dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = oldOverflow || ''; trigger?.focus(); });
  document.querySelector('.art-zoom').addEventListener('click', e => openImage(document.querySelector('[data-full-body]'), e.currentTarget));
  document.querySelectorAll('.gallery-item img').forEach(img => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'gallery-zoom';
    img.alt = img.closest('figure').querySelector('figcaption')?.textContent || img.alt;
    button.setAttribute('aria-label', img.alt + ' 확대'); img.before(button); button.append(img);
    button.addEventListener('click', () => openImage(img, button));
  });
  const safeUrl = value => { const url = new URL(value, root); if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid URL'); return url.href; };
  fetch(new URL('characters.json', root)).then(r => { if (!r.ok) throw new Error('Data unavailable'); return r.json(); }).then(data => {
    const index = data.findIndex(c => c.id === wiki.dataset.character);
    if (index < 0) throw new Error('Character not found');
    const current = data[index];
    // mainColor is independent of the character's category tag.
    const accent = /^#[0-9a-f]{6}$/i.test(current.mainColor || '') ? current.mainColor : '#82adff';
    const rgb = accent.slice(1).match(/../g).map(x => parseInt(x, 16) / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
    const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
    const onAccent = luminance > .179 ? '#000000' : '#ffffff';
    for (const surface of [wiki, dialog]) {
      surface.style.setProperty('--wiki-accent', accent);
      surface.style.setProperty('--wiki-on-accent', onAccent);
    }
    const art = document.querySelector('[data-full-body]');
    art.src = safeUrl(current.fullImage || 'images/full-body-placeholder.svg');
    art.alt = current.name + (current.fullImage ? ' 전신 이미지' : ' 전신 이미지 미등록');
    document.querySelector('.art-caption').textContent = current.fullImage ? '전신 이미지 · 눌러서 크게 보기' : '전신 이미지 준비 중';
    document.querySelector('.profile-card h2').textContent = current.name;
    document.querySelector('.profile-card dd').textContent = current.tag || '미분류';
    const tag = document.querySelector('.profile-card dd');
    tag.classList.add('tag-badge'); tag.setAttribute('data-tag', current.tag || '');
    document.querySelector('.profile-card').setAttribute('data-tag', current.tag || '');
    const related = document.querySelector('#related-list'); related.replaceChildren();
    const siblings = data.filter(c => c.id !== current.id && current.tag && c.tag === current.tag);
    document.querySelector('.related-docs summary').textContent = (current.tag === 'SV' ? '슈가잇벤쳐' : current.tag || '관련') + ' · 관련 캐릭터';
    siblings.forEach(c => { const li = document.createElement('li'), a = document.createElement('a'); a.textContent = c.name; a.href = safeUrl(c.html); li.append(a); related.append(li); });
    if (!siblings.length) { const li = document.createElement('li'); li.textContent = '등록된 관련 캐릭터가 없습니다.'; related.append(li); }
    if (data.length > 1) { const next = data[(index + 1) % data.length], link = document.querySelector('#next-character'); link.href = safeUrl(next.html); link.textContent = `다음 캐릭터 · ${next.name} →`; link.hidden = false; }
  }).catch(() => { document.querySelector('#related-list').textContent = '관련 정보를 불러오지 못했습니다. 새로고침해 주세요.'; });
})();

const USER = 'https://images.unsplash.com/photo-1521817760127-e15c26f67fd2?auto=format&fit=crop&w=700&q=88'
const profiles = [
  ['Marta', 47, '2 km', 'https://images.unsplash.com/photo-1711056214807-33ef9f745441?auto=format&fit=crop&w=900&q=88'],
  ['Antônio', 55, '4 km', 'https://images.unsplash.com/photo-1536548665027-b96d34a005ae?auto=format&fit=crop&w=900&q=88'],
  ['Luzia', 42, '7 km', 'https://images.unsplash.com/photo-1668950594705-a6bff914f5ea?auto=format&fit=crop&w=900&q=88'],
]
const app = document.querySelector('#app')
let index = 0
let startX = 0
const vibrate = () => navigator.vibrate?.(35)
const go = (page) => { window.location.href = page }
const logo = () => '<div class="logo"><span class="logo-mark">S</span>Samer</div>'
const nav = (active) => `<nav class="bottom">
  <button class="${active === 'people' ? 'active' : ''}" data-go="match.html">👥<br>PESSOAS</button>
  <button class="${active === 'chat' ? 'active' : ''}" data-go="conversations.html">💬<br>CONVERSAS</button>
  <button class="${active === 'me' ? 'active' : ''}" data-go="profile.html"><img class="avatar" src="${USER}" alt=""><span>EU</span></button>
</nav>`
function bindNavigation() {
  document.querySelectorAll('[data-go]').forEach((button) => button.onclick = () => go(button.dataset.go))
}

function home() {
  app.innerHTML = `<main class="screen">
    <header class="top">${logo()}<button class="round" aria-label="Ouvir esta tela">◖))</button></header>
    <section class="hero"><img src="${USER}" alt="Foto do usuário logado"><span class="verified">✓ Rosto verificado</span></section>
    <h1>Conhecer gente<br>é só falar.</h1>
    <button class="big blue" data-go="match.html">👥 VER PESSOAS</button>
    <button class="big" data-go="start.html">🎙 COMEÇAR</button>
  </main>`
  bindNavigation()
}

function match() {
  if (index >= profiles.length) return empty()
  const [name, age, distance, photo] = profiles[index]
  const next = profiles[index + 1]?.[3] || photo
  app.innerHTML = `<main class="screen">
    <header class="match-top"><button data-go="index.html" class="mini">${logo()}</button><button class="round distance" aria-label="Distância">⌖</button><button class="round" aria-label="Ouvir">◖))</button></header>
    <div class="stack"><div class="behind"><img src="${next}" alt=""></div><article class="card" id="card"><img src="${photo}" alt="${name}, sorrindo"><span class="verified">✓ VERIFICADO</span><div class="card-info"><h1>${name} ${age}</h1><p>⌖ ${distance}</p></div></article></div>
    <div class="audio"><button class="round" id="audio">▶</button><span>OUVIR ${name.toUpperCase()}</span><button class="round" aria-label="Ver vídeo">▣</button></div>
    <div class="choices"><div class="choice pass"><button id="pass" aria-label="Passar">✕</button>PASSAR</div><div class="choice undo"><button id="undo" aria-label="Desfazer">↶</button>DESFAZER</div><div class="choice like"><button id="like" aria-label="Curtir">♥</button>CURTIR</div></div>
    ${nav('people')}</main>`
  bindNavigation()
  document.querySelector('#audio').onclick = (event) => { vibrate(); event.currentTarget.textContent = 'Ⅱ' }
  document.querySelector('#pass').onclick = () => choose('pass')
  document.querySelector('#like').onclick = () => choose('like')
  document.querySelector('#undo').onclick = () => { index = Math.max(0, index - 1); match() }
  const card = document.querySelector('#card')
  card.onpointerdown = (event) => { startX = event.clientX; card.setPointerCapture(event.pointerId) }
  card.onpointermove = (event) => { if (startX) card.style.transform = `translateX(${event.clientX - startX}px) rotate(${(event.clientX - startX) / 25}deg)` }
  card.onpointerup = (event) => { const move = event.clientX - startX; startX = 0; move > 70 ? choose('like') : move < -70 ? choose('pass') : card.style.transform = '' }
}
function choose(kind) {
  vibrate()
  const card = document.querySelector('#card')
  card.style.transform = `translateX(${kind === 'like' ? 130 : -130}vw) rotate(${kind === 'like' ? 24 : -24}deg)`
  setTimeout(() => kind === 'like' && index === 0 ? celebration() : (index += 1, match()), 300)
}
function celebration() {
  app.innerHTML = `<main class="celebrate">${logo()}<div class="faces"><img src="${profiles[0][3]}" alt="Marta"><b>♥</b><img src="${USER}" alt="Você"></div><h1>DEU MATCH!</h1><p>Vocês se curtiram!</p><button class="big" data-go="conversations.html">🎙 MANDAR ÁUDIO</button><button class="big blue" data-go="conversations.html">▣ CHAMAR NO VÍDEO</button><button class="big" id="more">👥 VER MAIS PESSOAS</button></main>`
  bindNavigation()
  document.querySelector('#more').onclick = () => { index = 1; match() }
}
function empty() {
  app.innerHTML = `<main class="screen empty">${logo()}<div class="empty-icon">⌖</div><h1>Por hoje acabou.</h1><p>Volte mais tarde!</p><button class="big blue" id="again">⌖ AUMENTAR DISTÂNCIA</button><button class="big" data-go="index.html">← VOLTAR</button></main>`
  bindNavigation()
  document.querySelector('#again').onclick = () => { index = 0; match() }
}
function start() {
  app.innerHTML = `<main class="screen record-page"><button class="mini" data-go="index.html">${logo()}</button><button class="record-button" id="record" aria-label="Aperte e diga seu nome">🎙</button><h1 id="record-title">Diga seu nome</h1><p>Toque no microfone</p><div class="record-status" id="status"></div><button class="big blue hidden" id="continue" data-go="match.html">✓ CONTINUAR</button></main>`
  bindNavigation()
  document.querySelector('#record').onclick = (event) => {
    const recordButton = event.currentTarget
    vibrate(); recordButton.classList.add('listening'); document.querySelector('#record-title').textContent = 'Estou ouvindo...'; document.querySelector('#status').textContent = 'Fale agora'
    setTimeout(() => { recordButton.classList.remove('listening'); recordButton.textContent = '✓'; document.querySelector('#record-title').textContent = 'Muito bem!'; document.querySelector('#status').textContent = 'Nome guardado'; document.querySelector('#continue').classList.remove('hidden') }, 2000)
  }
}
function conversations() {
  app.innerHTML = `<main class="screen"><header class="top">${logo()}<button class="round" aria-label="Ouvir">◖))</button></header><h1 class="page-title"><span>💬</span>Conversas</h1><section class="conversation-list">
    ${profiles.slice(0,2).map(([name,,distance,photo]) => `<article class="conversation"><img src="${photo}" alt="${name}"><div><strong>${name}</strong><p>✓ Áudio novo · ${distance}</p></div><button aria-label="Ouvir áudio de ${name}">▶</button></article>`).join('')}
  </section>${nav('chat')}</main>`
  bindNavigation()
  document.querySelectorAll('.conversation button').forEach((button) => button.onclick = () => { vibrate(); button.textContent = 'Ⅱ' })
}
function profile() {
  app.innerHTML = `<main class="screen profile-page"><header class="top">${logo()}<button class="round" aria-label="Ouvir">◖))</button></header><img class="profile-photo" src="${USER}" alt="Foto do usuário"><h1>Meu perfil</h1><span class="profile-badge">✓ Rosto verificado</span><section class="profile-options"><button>🎙 Minha apresentação</button><button>▣ Meu vídeo</button><button>⚙ Voz e tamanho</button><button data-go="index.html">← VOLTAR AO INÍCIO</button></section>${nav('me')}</main>`
  bindNavigation()
}

const pages = { home, match, start, conversations, profile }
pages[document.body.dataset.page]?.()

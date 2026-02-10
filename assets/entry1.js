const THRESHOLD = 70; // 이만큼 스크롤하면 2번 레이아웃로 전환

function onScroll() {
  document.body.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
}

window.addEventListener("scroll", onScroll);
onScroll(); // 처음 로드 시에도 체크

(() => {
  const vw = window.innerWidth;
  const offenders = [];
  document.querySelectorAll("*").forEach(el => {
    const r = el.getBoundingClientRect();
    // 오른쪽으로 삐져나가는 애들만
    if (r.right > vw + 1) offenders.push([Math.round(r.right - vw), el]);
  });
  offenders.sort((a,b) => b[0]-a[0]);
  console.log("Top offenders:", offenders.slice(0, 10));
  if (offenders[0]) offenders[0][1].scrollIntoView({block:"center"});
})();


const THRESHOLD = 80; // 이만큼 스크롤하면 2번 레이아웃로 전환

function onScroll() {
  document.body.classList.toggle("is-scrolled", window.scrollY > THRESHOLD);
}

window.addEventListener("scroll", onScroll);
onScroll(); // 처음 로드 시에도 체크

document.addEventListener("pointerdown", () => {
  document.body.classList.add("is-clicking");
});

document.addEventListener("pointerup", () => {
  document.body.classList.remove("is-clicking");
});

document.addEventListener("pointercancel", () => {
  document.body.classList.remove("is-clicking");
});

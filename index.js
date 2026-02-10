document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".canvas");
  if (!stage) return;

  const max = 25;          // 회전 세기 (30은 꽤 과함)
  const persp = 1000;      // 200 -> 너무 강함 (800~1400 추천)

  let targetRX = 0, targetRY = 0; // 목표값
  let currentRX = 0, currentRY = 0; // 현재값(부드럽게 따라감)
  let rafId = null;

  function animate() {
    // easing(부드럽게 따라가기): 0.12~0.2 사이 추천
    const ease = 0.14;
    currentRX += (targetRX - currentRX) * ease;
    currentRY += (targetRY - currentRY) * ease;

    stage.style.transform =
      `perspective(${persp}px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;

    rafId = requestAnimationFrame(animate);
  }

  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    targetRY = (x - 0.5) * (max * 2);
    targetRX = -(y - 0.5) * (max * 2);

    // 애니메이션 루프가 아직 안 돌고 있으면 시작
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  stage.addEventListener("mouseleave", () => {
    targetRX = 0;
    targetRY = 0;

    // 살짝 있다가(값이 0으로 거의 수렴하면) 멈추게 하고 싶으면 아래처럼
    // 여기선 그냥 계속 돌려도 부담 적음. (원하면 stop 로직도 만들어줄게)
  });
});

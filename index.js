document.addEventListener("DOMContentLoaded", () => {

  const stage = document.querySelector(".canvas"); // 마우스 감지
  const group = document.querySelector(".imgs");   // 실제 틸트 대상
  if (!stage) return;

  const max = 30; // 틸트 세기(도)

  stage.addEventListener("mousemove", (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;  // 0~1
    const y = (e.clientY - r.top) / r.height; // 0~1

    const ry = (x - 0.5) * (max * 2);
    const rx = -(y - 0.5) * (max * 2);

    stage.style.transform = `perspective(200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });

  stage.addEventListener("mouseleave", () => {
    stage.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
  });
});

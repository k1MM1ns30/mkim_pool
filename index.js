import * as THREE from "https://unpkg.com/three@0.179.0/build/three.module.js";

const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();

// 카메라
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
camera.position.set(0, 0, 7);

// 라이트
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(2, 2, 3);
scene.add(light);

// 오브젝트 (테스트용: 떠다니는 구들)
const group = new THREE.Group();
scene.add(group);

const geo = new THREE.SphereGeometry(0.5, 32, 32);
for (let i = 0; i < 20; i++) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.35,
    metalness: 0.1,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(
    (Math.random() - 0.5) * 8,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 6
  );
  group.add(m);
}

// 마우스
const mouse = new THREE.Vector2(0, 0);
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 리사이즈
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener("resize", resize);
resize();

// 카메라 목표값 (부드럽게 따라오게)
const camTarget = new THREE.Vector3(0, 0, 7);
const lookTarget = new THREE.Vector3(0, 0, 0);

function animate() {
  requestAnimationFrame(animate);

  // 마우스 따라 공간감 주기 (COMFORT 느낌)
  camTarget.x = mouse.x * 0.8;
  camTarget.y = mouse.y * 0.45;
  camera.position.lerp(camTarget, 0.06);
  camera.lookAt(lookTarget);

  // 오브젝트 살짝 움직임
  group.rotation.y += 0.002;
  group.rotation.x += 0.001;

  renderer.render(scene, camera);
}
animate();

import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load("/textures/particles/2.png");

/**
 * Test cube
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

//geometry
const particlesGeometry = new THREE.BufferGeometry(); //最初はsphereGeometryで確認する。
const count = 7000;

const position = new Float32Array(count * 3); //型配列。メモリ効率がよくなる。汎用型Arrayだと効率が悪いらしい。
console.log(position);
const color = new Float32Array(count * 3);

//[0,0,0, 1,1,1 , 2,2,2, ....]3つの成分はそれぞれ頂点座標や法線、色の情報が入っている？
for (let i = 0; i < count * 3; i++) {
  position[i] = (Math.random() - 0.5) * 10; //全ての配列に0~1までランダムに数字(頂点)を入れる。
  color[i] = Math.random();
}
console.log(position);

console.log(particlesGeometry);
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(position, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(color, 3));

//material
const pointMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true, //falseにするとどの位置でも同じ大きさで表示される
  // color: "#ff88cc",
  transparent: true,
  alphaMap: particlesTexture,
  // alphaTest: 0.001,
  // depthTest: false,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  vertexColors: true,
});

//point
const particles = new THREE.Points(particlesGeometry, pointMaterial);
scene.add(particles);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //aniamte
  // particles.rotation.y = elapsedTime * 0.2;

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    //bad performance
    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

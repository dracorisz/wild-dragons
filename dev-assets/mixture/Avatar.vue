<template>
  <div class="page">
    <div id="avatar-container" class="h-full w-full"></div>
    <div v-if="assetList.length || bodyList.length" class="w-full p-5 h-[50vh]">
      <h3>Assets</h3>
      <div class="assets">
        <div v-for="item in assetList" :key="item.id" class="assets__item" @click="setActiveAsset(item.id)">
          <img :src="item.preview" :alt="item.id" />
        </div>
      </div>
      <h3>Bodies</h3>
      <div class="assets">
        <div v-for="item in bodyList" :key="item.id" class="assets__item" @click="setActiveBody(item.id)">
          <img :src="item.preview" :alt="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref } from 'vue';
import { onMounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import Stats from "three/examples/jsm/libs/stats.module.js";

// stats
let scene, renderer, camera, animationGroup, mixer, clock, currentAvatar, idleAction;
const assetList = ref([]);
const bodyList = ref([]);

function filterAnimation(animation) {
  animation.tracks = animation.tracks.filter((track) => {
    const name = track.name;
    return name.endsWith("Hips.position") || name.endsWith(".quaternion");
  });
  return animation;
}

async function loadAvatar(url) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  const avatar = gltf.scene;
  scene.add(avatar);
  avatar.traverse((object) => {
    if (object.isMesh) {
      object.castShadow = true;
      object.receiveShadow = true;
      object.material.envMapIntensity = 0.3;
      if (object.material.map && !object.material.name.includes("hair")) {
        object.material.map.generateMipmaps = false;
      }
    }
  });
  animationGroup.add(avatar);
  return avatar;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  mixer.update(clock.getDelta());
  renderer.render(scene, camera);
  // stats.update();
}

onMounted(async () => {
  const container = document.getElementById("avatar-container");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight * 0.8), 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(-2, 1, 3);
  controls.target.set(0, 1, 0);
  controls.update();

  clock = new THREE.Clock();
  animationGroup = new THREE.AnimationObjectGroup();
  mixer = new THREE.AnimationMixer(animationGroup);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xc0c0c0);
  scene.fog = new THREE.Fog(0xc0c0c0, 20, 50);

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(3, 3, 5);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.bias = -0.001;
  dirLight.intensity = 1;
  scene.add(dirLight);

  new HDRLoader().load("/models/def/brown_photostudio_01.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }));
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  scene.add(mesh);

  // Load default avatar
  currentAvatar = await loadAvatar("/models/def/default_model.glb");

  // Load default animation
  const loader = new GLTFLoader();
  loader.load("/models/def/animation.glb", function (gltf) {
    const clip = filterAnimation(gltf.animations[0]);
    const action = mixer.clipAction(clip);
    idleAction = action;
    idleAction.play();
  });

  // stats = new Stats();
  // container.appendChild(stats.dom);

  window.addEventListener("resize", onWindowResize);
  animate();
});
</script>

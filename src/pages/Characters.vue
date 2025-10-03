<template>
  <div class="page">
    <div id="viewer" class="w-full"></div>
    <div class="absolute top-10 left-10 z-20 flex flex-col">
      <div class="mb-5 flex gap-2 rounded bg-white/70 p-2">
        <label>Color:</label>
        <select v-model="selectedHairColor" @change="selectHairColor(selectedHairColor)">
          <option value="#ff0000">Red</option>
          <option value="#99ff99">Green</option>
          <option value="#0000ff">Blue</option>
        </select>
      </div>
      <div class="mb-5 flex gap-2 rounded bg-white/70 p-2">
        <label>Pose:</label>
        <select v-model="selectedPose">
          <option value="idle">Idle</option>
        </select>
      </div>
      <div class="mb-5 flex gap-2 rounded bg-white/70 p-2">
        <label>Hair:</label>
        <select v-model="selectedHair" @change="selectHair(selectedHair)">
          <option value="afro_hair">Afro Hair</option>
          <option value="bob_hair">Bob Hair</option>
          <option value="bobby_hair">Bobby Hair</option>
          <option value="braid_hair">Braid Hair</option>
          <option value="long_hair">Long Hair</option>
          <option value="short_hair">Short Hair</option>
          <option value="ponytail_hair">Ponytail Hair</option>
        </select>
      </div>
    </div>
  </div>
  <div class="pointer-events-none absolute bottom-0 left-0 -z-10 w-full h-full bg-[url('/images/canvar2.jpg')] bg-repeat-y bg-bottom bg-cover"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const selectedHairColor = ref("#99ff99");
const selectedPose = ref("idle");
const selectedHair = ref("afro_hair");
const yPos = -3;
const leanRatio = -0.5;
let model = null;

onMounted(() => {
  const loader = new THREE.TextureLoader();
  // Use a fixed-size background plane instead of scene.background
  // loader.load("/images/canvas.jpg", (texture) => {
  //   const bgGeometry = new THREE.PlaneGeometry(180, 100);
  //   const bgMaterial = new THREE.MeshBasicMaterial({ map: texture });
  //   const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
  //   bgPlane.position.set(-20, 0, -40); // Position far behind everything
  //   scene.add(bgPlane);
  // });
  const scene = new THREE.Scene();
  // Adjust camera position and rotation for oval cup fit
  const camera = new THREE.PerspectiveCamera(
    60, // narrower FOV for oval fit
    window.innerWidth / (window.innerHeight - 77),
    0.1,
    1000
  );
  // Place camera higher and further back, slightly above center
  camera.position.set(0, 5.5, 7.2);
  camera.lookAt(0, yPos + 0.5, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x000000, 0.1);
  renderer.setSize(window.innerWidth, window.innerHeight - 77);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("viewer").appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(5, 25, 8);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 80;
  scene.add(directionalLight);

  const classTexture = new THREE.TextureLoader().load("/images/class.png");
  const classMaterial = new THREE.MeshBasicMaterial({ map: classTexture, transparent: true });
  const classGeometry = new THREE.PlaneGeometry(15, 15);
  const classPlane = new THREE.Mesh(classGeometry, classMaterial);
  classPlane.rotation.x = -Math.PI / 2 + leanRatio;
  classPlane.position.set(0, yPos + 0.01, 0);
  classPlane.receiveShadow = true;
  scene.add(classPlane);

  // const groundTexture = new THREE.TextureLoader().load("/images/ground.jpg");
  // groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  // groundTexture.repeat.set(250, 250);
  // groundTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const groundMaterial = new THREE.MeshStandardMaterial({
    // map: groundTexture,
    transparent: true,
    opacity: 0.25,
    color: 0x000,
    contrast: 1.5,
  });

  const groundGeometry = new THREE.PlaneGeometry(200, 200);
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2 + leanRatio;
  ground.position.y = yPos;
  ground.receiveShadow = true;
  scene.add(ground);

  let mixer = null;

  async function loadAvatar(url, color = null, pose = null) {
    if (model) {
      scene.remove(model);
      model.traverse &&
        model.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });
      model = null;
    }

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
    loader.setDRACOLoader(dracoLoader);
    const gltf = await loader.loadAsync("models/mh003.glb");
    const avatar = gltf.scene;

    const box = new THREE.Box3().setFromObject(avatar);
    const center = box.getCenter(new THREE.Vector3());
    avatar.position.sub(center);

    const size = box.getSize(new THREE.Vector3()).length();
    const desiredSize = 7.33;
    const scale = desiredSize / size;
    avatar.scale.setScalar(scale);

    let renderOrder = 1;
    avatar.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true;
        object.renderOrder = renderOrder++;

        if (object.material) {
          object.material.depthWrite = true;
          object.material.depthTest = true;
        }

        // console.log(object.name);
      }
    });

    scene.add(avatar);
    model = avatar;
    // Center model in oval cup
    model.position.set(0, yPos + 0.25, 0);
    model.rotation.x = leanRatio;
    mixer = new THREE.AnimationMixer(model);
    if (gltf.animations && gltf.animations.length > 0) {
      // Use pose index if provided, else default to 0
      let animIdx = pose && typeof pose === "number" ? pose : 0;
      animIdx = Math.min(animIdx, gltf.animations.length - 1);
      const action = mixer.clipAction(gltf.animations[animIdx]);
      action.play();
    }

    if (model) {
      model.traverse((object) => {
        if (object.isMesh && object.name.includes("hair")) {
          object.visible = false;
        }
      });
    }
  }

  loadAvatar();

  let isDragging = false;
  let previousMouseX = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;
  let targetZoom = camera.position.z;
  // Adjust zoom limits for oval fit
  const minZoom = 6.8;
  const maxZoom = 7.6;

  renderer.domElement.addEventListener("mousedown", (e) => {
    isDragging = true;
    previousMouseX = e.clientX;
  });
  renderer.domElement.addEventListener("mouseup", () => {
    isDragging = false;
  });
  renderer.domElement.addEventListener("mouseleave", () => {
    isDragging = false;
  });
  renderer.domElement.addEventListener("mousemove", (e) => {
    if (!isDragging || !model) return;
    const deltaX = e.clientX - previousMouseX;
    targetRotationY += deltaX * 0.01; // Rotate along Y axis only
    previousMouseX = e.clientX;
  });

  // Mouse wheel for zoom
  renderer.domElement.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      targetZoom += e.deltaY * 0.01;
      targetZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));
    },
    { passive: false },
  );

  // Cache values outside the loop to avoid recalculating
  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    // Only update mixer if needed
    if (mixer) {
      mixer.update(delta);
    }

    // Only update model rotation if dragging or target changed
    if (model && Math.abs(targetRotationY - currentRotationY) > 0.0001) {
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      model.rotation.y = currentRotationY;
    }

    // Only update camera zoom if changed
    if (Math.abs(targetZoom - camera.position.z) > 0.0001) {
      camera.position.z += (targetZoom - camera.position.z) * 0.1;
    }

    // Always look at model's center for oval fit
    camera.lookAt(0, yPos + 0.5, 0);

    // Only update classPlane animation if present
    // if (classPlane) {
    //   classPlane.rotation.z += 0.002;
    //   // Use cached time for sine calculation
    //   classPlane.position.y = yPos + 0.06 + Math.sin(now * 0.002) * 0.05;
    // }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / (window.innerHeight - 77);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 77);
  });
});

const selectHair = (hair) => {
  if (model) {
    model.traverse((object) => {
      if (object.isMesh && object.name.includes("hair")) {
        object.visible = false;
      }
      if (object.isMesh && object.name.includes(hair)) {
        object.visible = true;
      }
    });
  }
};

const selectHairColor = (hairColor) => {
  if (model) {
    model.traverse((object) => {
      if (object.isMesh && object.name.includes("hair")) {
        object.material.color = new THREE.Color(hairColor);
        object.material.emissive.setHex('0x' + hairColor.slice(1));
        object.material.emissiveIntensity = 0.05;
      }
    });
  }
};
</script>

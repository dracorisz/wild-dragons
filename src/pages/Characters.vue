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
  
</template>

<script setup>
import { ref, onMounted } from "vue";

defineEmits(["authChange"]);
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const selectedHairColor = ref("#99ff99");
const selectedHair = ref("afro_hair");
const yPos = -4;
const leanRatio = -0.25;
const desiredSize = 11;
const cameraLook = 5;
let model = null;

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / (window.innerHeight - 77), 0.5, 1000);
  camera.position.set(0, 5.5, 7.3);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0x87ceef, 0.9);
  renderer.setSize(window.innerWidth, window.innerHeight - 77);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.getElementById("viewer").appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  // loader.load("/images/sky.jpg", (texture) => {
  //   const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
  //   const skyMaterial = new THREE.MeshBasicMaterial({
  //     map: texture,
  //     side: THREE.BackSide,
  //   });
  //   const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  //   scene.add(sky);
  // });

  for (let i = 0; i < 15; i++) {
    loader.load("/images/cloud.png", (cloudTexture) => {
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        depthTest: false,
      });

      const width = 20 + Math.random() * 4;
      const height = 10 + Math.random() * 2;
      const cloudGeometry = new THREE.PlaneGeometry(width, height);
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
      const x = Math.random() * 80 - 40;
      const y = 2 + Math.random() * 20;
      const z = Math.random() * 4 - 20;
      cloud.position.set(x, y, z);
      scene.add(cloud);
    });
  }

  loader.load("/images/ground.jpg", (groundTexture) => {
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(20, 20);
    groundTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const groundMaterial = new THREE.MeshStandardMaterial({
      map: groundTexture,
      color: 0x7ec850,
      transparent: true,
      opacity: 1,
    });

    const groundGeometry = new THREE.PlaneGeometry(80, 40);
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2 + leanRatio;
    ground.position.y = yPos;
    ground.receiveShadow = true;
    scene.add(ground);
  });

  // Softer ambient and sunlight for natural look
  const ambientLight = new THREE.AmbientLight(0xcceeff, 3.3);
  scene.add(ambientLight);
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
  sunLight.position.set(20, 60, 20);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 20;
  sunLight.shadow.camera.far = 90;
  scene.add(sunLight);

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
    
    model.position.set(0, yPos + 0.005, 0);
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

  const classTexture = new THREE.TextureLoader().load("/images/class.png");
  const classMaterial = new THREE.MeshBasicMaterial({ map: classTexture, transparent: true });
  const classGeometry = new THREE.PlaneGeometry(4.4, 4.4);
  const classPlane = new THREE.Mesh(classGeometry, classMaterial);
  classPlane.rotation.x = -Math.PI / 2 + leanRatio;
  classPlane.position.set(0, yPos + 0.001, 0);
  classPlane.receiveShadow = true;
  scene.add(classPlane);

  loadAvatar();

  let isDragging = false;
  let previousMouseX = 0;
  let targetRotationY = 0;
  let currentRotationY = 0;
  let targetZoom = camera.position.z;
  
  const minZoom = 7;
  const maxZoom = 8;

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

  let lastTime = performance.now();
  function animate() {
    requestAnimationFrame(animate);
    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    if (mixer) mixer.update(delta);

    if (model && Math.abs(targetRotationY - currentRotationY) > 0.0001) {
      currentRotationY += (targetRotationY - currentRotationY) * 0.1;
      model.rotation.y = currentRotationY;
    }

    if (Math.abs(targetZoom - camera.position.z) > 0.0001) {
      camera.position.z += (targetZoom - camera.position.z) * 0.1;
    }

    camera.lookAt(0, yPos + cameraLook, 0);

    if (classPlane) {
      classPlane.rotation.z += 0.002;
      classPlane.position.y = yPos + 0.06 + Math.sin(now * 0.002) * 0.05;
    }

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

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Cube } from "./Cube";
import { getRandomInt } from "./main";

const materials = [
  new THREE.MeshBasicMaterial({ color: 0xdb2777 }),
  new THREE.MeshBasicMaterial({ color: 0x0a0a0a }),
];

const initialBoundary = 30;
const geometry = new THREE.BufferGeometry().setFromPoints([
  new THREE.Vector3(-initialBoundary, -initialBoundary, -initialBoundary),
  new THREE.Vector3(initialBoundary, -initialBoundary, -initialBoundary),
  new THREE.Vector3(initialBoundary, -initialBoundary, initialBoundary),
  new THREE.Vector3(-initialBoundary, -initialBoundary, initialBoundary),
  new THREE.Vector3(-initialBoundary, -initialBoundary, -initialBoundary),
]);
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0xffffff,
  linewidth: 2,
  transparent: true,
  opacity: 0.5,
});

const lowerLine = new THREE.Line(geometry, lineMaterial);
const upperLine = lowerLine.clone();
upperLine.position.y = initialBoundary * 2;
class Scene {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  renderer = new THREE.WebGLRenderer({ alpha: true });
  clock = new THREE.Clock(true);
  cubes: Cube[] = [];
  boundaryLines = new THREE.Group().add(lowerLine, upperLine);
  boundary = initialBoundary;
  constructor() {
    this.scene.background = null;
    this.camera.position.z = 70;
    this.camera.position.x = -70;
    this.renderer.setPixelRatio(2);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    const observer = new ResizeObserver((entries) => {
      this.renderer.setSize(
        entries[0].target.clientWidth,
        entries[0].target.clientHeight
      );
      this.camera.aspect =
        entries[0].target.clientWidth / entries[0].target.clientHeight;
      this.camera.updateProjectionMatrix();
    });
    observer.observe(document.body);
    new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.add(this.boundaryLines);
  }
  setCubes(num: number) {
    const totalCubes = this.cubes.length;
    if (num > totalCubes) {
      for (let i = 0; i < num - totalCubes; i++) {
        const newCube = new Cube(
          materials[getRandomInt(0, materials.length - 1)],
          this.boundary
        );
        this.cubes.push(newCube);
        this.scene.add(newCube);
      }
    } else {
      const deletedCubes = this.cubes.splice(num);
      deletedCubes.forEach((cube) => {
        this.scene.remove(cube);
      });
    }
  }

  setBoundary(newBoundary: number) {
    const newYScale = newBoundary / initialBoundary;
    this.boundary = newBoundary;
    this.boundaryLines.scale.set(newYScale, newYScale, newYScale);

    for (const cube of this.cubes) {
      cube.updateBoundary(newBoundary);
    }
  }

  start() {
    this.setCubes(10_000);
    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      this.update();
    });
  }

  update() {
    const delta = this.clock.getDelta();
    for (const cube of this.cubes) {
      cube.update(delta);
    }
  }
}

export { Scene };

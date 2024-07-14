import * as THREE from "three";
import { getRandomInt } from "./main";

const cubeSize = 1;
const axis = ["x", "y", "z"] as const;
const baseGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

class Cube extends THREE.Mesh {
  readonly totalDistance = 1;
  readonly speed = getRandomInt(1, 5);
  readonly waitTime = 0.5;
  boundary: number;
  movementAxis: (typeof axis)[number] = "x";
  movementDirection = 1;
  remainingDistance = this.totalDistance;
  currentWaitTime = 0;
  isWaiting = true;
  constructor(material: THREE.Material, boundary: number) {
    super(baseGeometry, material);
    this.boundary = boundary;
    this.position.set(
      getRandomInt(-this.boundary, this.boundary),
      getRandomInt(-this.boundary, this.boundary),
      getRandomInt(-this.boundary, this.boundary)
    );
  }

  update(delta: number) {
    if (this.isWaiting) {
      this.currentWaitTime += delta;
      if (this.currentWaitTime >= this.waitTime) {
        this.isWaiting = false;
        this.currentWaitTime = 0;
        this.movementAxis = axis[getRandomInt(0, axis.length - 1)];
        const spaceNegative = Math.round(
          this.boundary - this.position[this.movementAxis]
        );
        const spacePositive = Math.round(
          this.boundary + this.position[this.movementAxis]
        );
        if (spaceNegative < this.totalDistance) {
          this.movementDirection = -1;
        } else if (spacePositive < this.totalDistance) {
          this.movementDirection = 1;
        } else {
          this.movementDirection = Math.random() > 0.5 ? 1 : -1;
        }
        this.remainingDistance = this.totalDistance;
      }
    } else {
      const move = Math.min(delta * this.speed, this.remainingDistance);
      this.position[this.movementAxis] += move * this.movementDirection;
      this.remainingDistance -= move;
      if (this.remainingDistance <= 0) {
        this.isWaiting = true;
      }
    }
  }

  updateBoundary(newBoundary: number) {
    this.boundary = newBoundary;
  }
}

export { Cube };

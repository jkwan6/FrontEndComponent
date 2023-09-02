import { Component, Injectable } from "@angular/core";
import * as THREE from 'three';
import { IBoxDimensions } from './home-three-alternative-two.component'
import * as RAPIER from '@dimforge/rapier3d'
import { IElementDimensions } from "../../interface/IElementDimensions";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


@Injectable({
  providedIn: 'any'
}) // DI Decorator
export class ThreeJsWorld {

  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;

  constructor() {
    this.scene = new THREE.Scene();
  }

  public instantiateThreeJsScene(): THREE.Scene {
    this.scene = new THREE.Scene();
    return this.scene;
  }

  public instantiateThreeJsCamera(aspectRatio: number): THREE.PerspectiveCamera {
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
    return this.camera;
  }

  public instantiateThreeJsRenderer(canvas: HTMLCanvasElement, sizes: IElementDimensions): THREE.WebGLRenderer {
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true
    return this.renderer;
  }

  public instantiateThreeJsControls(): OrbitControls {
    const orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    //orbitControls.enableDamping = true
    orbitControls.minDistance = 0
    orbitControls.maxDistance = 15
    orbitControls.enablePan = false
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.zoomSpeed = 5;
    orbitControls.update();
    return orbitControls;
  }

  instantiateThreeJsLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight)
  }

  public createBoxMesh(boxDimensions: IBoxDimensions): THREE.Mesh {
    var boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(boxDimensions.length * 1, boxDimensions.height * 1, boxDimensions.width * 1),
      new THREE.MeshPhongMaterial({ color: 'red' })
    );
    this.scene.add(boxMesh);
    return boxMesh;
  }

  public createFloor(scale: RAPIER.Vector3, nsubdivs: number, heights: number[]): THREE.Mesh {
    var threeFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(scale.x, scale.z, nsubdivs, nsubdivs),
      new THREE.MeshStandardMaterial({
        color: 'grey'
      })
    );
    threeFloor.rotateX(- Math.PI / 2);
    threeFloor.receiveShadow = true;
    threeFloor.castShadow = true;
    this.scene.add(threeFloor);
    const vertices = threeFloor.geometry.attributes['position'].array;
    const dx = scale.x / nsubdivs;
    const dy = scale.z / nsubdivs;
    // store height data in map column-row map
    const columsRows = new Map();
    for (let i = 0; i < vertices.length; i += 3) {
      // translate into colum / row indices
      let row = Math.floor(Math.abs((vertices as any)[i] + (scale.x / 2)) / dx);
      let column = Math.floor(Math.abs((vertices as any)[i + 1] - (scale.z / 2)) / dy);
      // generate height for this column & row
      const randomHeight = Math.random();
      (vertices as any)[i + 2] = scale.y * randomHeight;
      // store height
      if (!columsRows.get(column)) {
        columsRows.set(column, new Map());
      }
      columsRows.get(column).set(row, randomHeight);
    }
    threeFloor.geometry.computeVertexNormals();
    for (let i = 0; i <= nsubdivs; ++i) {
      for (let j = 0; j <= nsubdivs; ++j) {
        heights.push(columsRows.get(j).get(i));
      }
    }
    return threeFloor;
  }


}

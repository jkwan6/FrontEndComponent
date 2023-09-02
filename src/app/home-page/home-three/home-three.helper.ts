import { Observable, tap } from "rxjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IElementDimensions } from "../../interface/IElementDimensions";
import * as dat from 'lil-gui';
import { SideNavService } from "../../service/SideNavService/SideNavService";
import { ThreeJsService } from "../../service/ThreeJsService/ThreeJsService";
import { Directive } from "@angular/core";
import { cameraType, ICameraInitialize } from "../../interface/ThreeJs/ICameraInitialize";
import * as THREE from "three";

export class HomeThreeBase {
  requestId!: number;
  sizes!: IElementDimensions;
  aspectRatio!: number;
  scene!: THREE.Scene;
  geometry!: THREE.BufferGeometry;
  material!: THREE.PointsMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer | any;
  axesHelper!: THREE.AxesHelper;
  texture!: THREE.Texture;
  controls!: OrbitControls;
  textureLoader!: THREE.TextureLoader;
  animateControls!: (() => {}) | any;
  animateScreenResize!: Observable<IElementDimensions>;
  player!: THREE.Group;
  cameras!: any;
  gui!: dat.GUI;
  // DI Injection

  constructor(
    protected sideNavService: SideNavService,
    protected threeJsService: ThreeJsService
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
    this.aspectRatio = this.sizes.width / this.sizes.height;
  }

  threeJsSetup() {
    var position = { x: 0, y: 50, z: 100 };
    var aspectRatio = this.aspectRatio;
    var fieldOfView = 75;
    const cameraInitialValues: ICameraInitialize =
      { position, aspectRatio, fieldOfView, cameraType: cameraType.PerspectiveCamera }
    let canvas: HTMLCanvasElement = document.querySelector('.HomeWebgl')!;

    // Wire Them Up
    this.scene = this.threeJsService.initializeScene();
    this.camera = this.threeJsService.initializePerspectiveCamera(this.camera, cameraInitialValues);
    this.renderer = this.threeJsService.initializeWebGlRenderer(canvas!, this.sizes);
    this.scene.add(this.camera);
    this.renderer.render(this.scene, this.camera);

    // CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    /*    this.controls.target.set(0, 0, 0);*/
    this.controls.enablePan = false;
    this.controls.maxDistance = 20;
    this.controls.minDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2.08; // radians
    this.controls.update();
  }
  initializeAnimateScreenResizeEvent() {
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes = {
        width: results.width * 0.925,     // Width
        height: 600,                      // Height - Edit --> Constant
      };
      this.aspectRatio = this.sizes.width / this.sizes.height;
      this.camera!.aspect = this.aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
  }
  // Material Setup
  floorSetup() {

    const axis = new THREE.AxesHelper(3);
    this.scene.add(axis)
    // #region PARTICLES

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    this.scene.add(ambientLight)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMapIntensity: 0.5,
        side: THREE.DoubleSide
      })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    this.scene.add(floor)
  }

}

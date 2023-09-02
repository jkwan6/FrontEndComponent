import { Observable, Subscription, tap } from "rxjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { IElementDimensions } from "../../interface/IElementDimensions";
import * as dat from 'lil-gui';
import { SideNavService } from "../../service/SideNavService/SideNavService";
import { ThreeJsService } from "../../service/ThreeJsService/ThreeJsService";
import { Directive } from "@angular/core";
import { cameraType, ICameraInitialize } from "../../interface/ThreeJs/ICameraInitialize";
import * as THREE from "three";
import { Vector3 } from "three";


export class HomeThreeBase {

  requestId!: number;
  sizes!: IElementDimensions;
  aspectRatio!: number;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer | any;
  controls!: OrbitControls;
  animateScreenResize!: Observable<IElementDimensions>;
  cameras!: any;
  subscription!: Subscription;
  cameraOrigin!: THREE.Vector3

  constructor(
    protected sideNavService: SideNavService,
  ) {

  }

  threeJsSetup(canvas: HTMLCanvasElement) {
    this.cameraOrigin = new Vector3(10,10,10)
    let position = { x: 0, y: 10, z: 550 };
    let aspectRatio = this.aspectRatio;
    let fieldOfView = 75;
    this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, 0.01, 1000);
    this.camera.position.set(position.x, position.y, position.z);
    this.camera.lookAt(this.cameraOrigin);
    this.scene = new THREE.Scene();
    this.scene.add(this.camera);
    this.renderer = new THREE.WebGLRenderer({canvas});
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.render(this.scene, this.camera);

    this.initializeControls();
  }


  initializeControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    //this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.maxDistance = 15;
    this.controls.minDistance = 15;
    this.controls.maxPolarAngle = Math.PI / 2.08;
    this.controls.update();
    this.controls.enableZoom = false;
  }




  initializeAnimateScreenResizeEvent() {
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 600;                                          // Height

      this.aspectRatio = this.sizes.width / this.sizes.height;
      this.camera!.aspect = this.aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }

  // Material Setup
  floorSetup() {
    const axis = new THREE.AxesHelper(3);
    this.scene.add(axis);
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambientLight);
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
    floor.receiveShadow = true;
    floor.rotation.x = - Math.PI * 0.5;
    this.scene.add(floor);
  }
}

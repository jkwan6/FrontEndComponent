import { HttpClient, HttpParams } from '@angular/common/http';
import { HostListener, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { cameraType, ICameraInitialize } from '../../interface/ThreeJs/ICameraInitialize';
import { SideNavService } from '../SideNavService/SideNavService';
import { ThreeJsService } from './ThreeJsService';

@Injectable({
  providedIn: 'any'
}) // DI Decorator
export class ThreeJsBase implements OnDestroy{

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
  player!: any;
  cameras!: any;
  // DI Injection

  constructor(
    private sideNavService: SideNavService,
    private threeJsService: ThreeJsService
  ) {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
    this.aspectRatio = this.sizes.width / this.sizes.height;
  }


  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }


  // Scene, Camera, Renderer, Controls Setup
  threeJsSetup() {
    var position = { x: 0, y: 20, z: 100 };
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
    this.controls.maxDistance = 15;
    this.controls.minDistance = 5;
    this.controls.maxPolarAngle = Math.PI / 2.08; // radians
    this.controls.update();
  }

}

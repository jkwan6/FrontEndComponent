import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'


@Component({
  selector: 'app-three-js-page-two',
  templateUrl: './three-js-page-two.component.html',
  styleUrls: ['./three-js-page-two.component.css']
})
export class ThreeJsPageTwoComponent implements AfterViewInit, OnDestroy {

  // PROPERTIES
  requestId: any;
  scene!: THREE.Scene;
  geometry!: THREE.BufferGeometry;
  materials!: THREE.PointsMaterial;
  mesh!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer | any;
  axesHelper!: THREE.AxesHelper;
  texture!: THREE.Texture;
  controls!: OrbitControls;
  gui!: dat.GUI;
  textureLoader!: THREE.TextureLoader;
  animate!: (() => {}) | any;
  points!: THREE.Points;

  @ViewChild('divElement') divElement: any;


  constructor() { }
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId)
      this.gui.destroy();
      this.renderer!.dispose();
      this.renderer.forceContextLoss();
      this.geometry.dispose();
      this.materials.dispose();
  }


  ngAfterViewInit(): void {

    // #region INITIAL DIV SETUP
    let sizes = {
      width: this.divElement.nativeElement.offsetWidth,
      height: this.divElement.nativeElement.offsetHeight,
    };
    let aspectRatio = sizes.width / sizes.height;
    // #endregion

    // #region SCENE SETUP
    this.scene = new THREE.Scene();
    this.axesHelper = new THREE.AxesHelper(3);
    this.scene.add(this.axesHelper);
    // #endregion

    // #region GENERATE GALAXY
    const parameters = {
      count: 100000,
      size: 0.01,
      radius: 5,
      branches: 3,
      spin: 1,
      randomness: 0.2,
      randomnessPower: 3,
      insideColor: '#ff6030',
      outsideColor: '#1b3984'
    };



    //let geometry: THREE.BufferGeometry;
    //let materials: THREE.PointsMaterial;
    //let points: THREE.Points;

    const generateGalaxy = () => {


      if (this.points != undefined) {
        this.geometry.dispose();
        this.materials.dispose();
        this.scene.remove(this.points);
      }



      this.geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(parameters.count * 3);
      const colors = new Float32Array(parameters.count * 3);
      const colorInside = new THREE.Color(parameters.insideColor);
      const colorOutisde = new THREE.Color(parameters.outsideColor);

      for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        const radius = Math.random() * parameters.radius;
        const branchAngle = (i % parameters.branches) / parameters.branches * 2 * Math.PI;
        const spinAngle = radius * parameters.spin;


        const randomX =Math.pow( Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

        const x = i3;
        const y = i3 + 1;
        const z = i3 + 2;


        positions[x] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[y] = 0 + randomY;
        positions[z] = Math.sin(branchAngle + spinAngle) * radius + randomZ;


        // Color

        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutisde, radius / parameters.radius);

        colors[i3 + 0] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b


      }

      this.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );

      this.geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
      );

      // Materials
      this.materials = new THREE.PointsMaterial(
        {
          size: parameters.size,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true
        }
      )

      // Points
      this.points = new THREE.Points(this.geometry, this.materials);
      this.scene.add(this.points);

    };
    generateGalaxy();
    // #endregion

    // #region CAMERA SETUP
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    this.scene.add(this.camera);
    // #endregion

    // #region RENDERER
    const canvas = document.querySelector('.webgl2');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!
    });
    // #endregion

    // #region CONTROL SETUP
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target.set(0, 0, 0);
    this.controls.update();
    // #endregion

    // #region INITIAL VIEW SETUP
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);
    // #endregion

    // #region DAT GUI
    this.gui = new dat.GUI({width: 360});


    this.gui.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy)
    this.gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
    this.gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy);
    this.gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy);
    this.gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy);
    this.gui.add(parameters, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
    this.gui.add(parameters, 'randomnessPower').min(1).max(10).step(1).onFinishChange(generateGalaxy);
    this.gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
    this.gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
    //
    // #endregion

    // #region CLOCK & ANIMATION
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(tick);
    }
    tick();
    // #endregion

    // #region RESIZE EVENT LISTENER
    window.addEventListener('resize', () => {
      let sizes = {
        width: this.divElement.nativeElement.offsetWidth,
        height: this.divElement.nativeElement.offsetHeight,
      };
      let aspectRatio = sizes.width / sizes.height;

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer.render(this.scene, this.camera);
    }, false);
    // #endregion
  }
}

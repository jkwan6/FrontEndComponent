import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'lil-gui'
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ScrollService } from '../../../../service/ScrollService/ScrollService';
import gsap from 'gsap';


@Component({
  selector: 'app-sub-menu1',
  templateUrl: './sub-menu1.component.html',
  styleUrls: ['./sub-menu1.component.css']
})



export class SubMenu1Component implements AfterViewInit, OnDestroy {

  // PROPERTIES
  requestId: any;
  scene!: THREE.Scene;
  geometry!: THREE.BoxGeometry;
  material!: THREE.MeshToonMaterial;
  mesh1!: THREE.Mesh;
  mesh2!: THREE.Mesh;
  mesh3!: THREE.Mesh;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  axesHelper!: THREE.AxesHelper;
  controls!: OrbitControls;
  gui!: dat.GUI;
  @ViewChild('divElement') divElement: any;

  constructor(private scrollService: ScrollService) { }



    ngOnDestroy(): void {
      window.cancelAnimationFrame(this.requestId)
      this.gui.destroy();
      this.renderer!.dispose();
      this.renderer.forceContextLoss();
      this.material.dispose();
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
    //this.axesHelper = new THREE.AxesHelper(3);
    //this.scene.add(this.axesHelper);
    // #endregion


    // #region PARAMETERS



    const parameters = {
      materialColor: "#ffedef"

    }


    // #endregion

    // #region OBJECTS

    const objectsDistance = 4;

    const textureLoader = new THREE.TextureLoader();
    const gradientTexture = textureLoader.load('../../../assets/textures/gradients/3.jpg');

    this.material = new THREE.MeshToonMaterial({
      color: parameters.materialColor,
      gradientMap: gradientTexture
    });

    gradientTexture.magFilter = THREE.NearestFilter;

    this.mesh1 = new THREE.Mesh(
      new THREE.TorusGeometry(1, 0.4, 16, 60),
      this.material
    )
    this.mesh1.position.x = 1;
    this.mesh1.scale.set(0.5, 0.5, 0.5)

    this.mesh2 = new THREE.Mesh(
      new THREE.ConeGeometry(1, 2, 32),
      this.material
    );
    this.mesh2.position.x = -1;
    this.mesh2.scale.set(0.5, 0.5, 0.5)

    this.mesh3 = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
      this.material
    );
    this.mesh3.scale.set(0.5, 0.5, 0.5)
    this.mesh3.position.x = 1;

    this.mesh1.position.y = - objectsDistance * 0;
    this.mesh2.position.y = - objectsDistance * 1;
    this.mesh3.position.y = - objectsDistance * 2;




    this.scene.add(this.mesh1, this.mesh2, this.mesh3)

    const sectionMeshes = [this.mesh1, this.mesh2, this.mesh3];


    // #endregion

    // #region PARTICLES


    const particlesCount = 500;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;    // X
      positions[i * 3 + 1] = 4 - (Math.random()) * 18;      // Y
      positions[i * 3 + 2] = (Math.random() -0.5) * 10;     // Z

    }

    const particlesGeometry = new THREE.BufferGeometry();

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Material
    const particleMaterial = new THREE.PointsMaterial({
      color: parameters.materialColor,
      sizeAttenuation: true,
      size: 0.01
    })

    const particles = new THREE.Points(particlesGeometry, particleMaterial);
    this.scene.add(particles)

    // #endregion



    // #region LIGHT

    const directionalLight = new THREE.DirectionalLight('#ffffff', 1);
    directionalLight.position.set(1, 1, 0)
    this.scene.add(directionalLight);




    // #endregion

    // #region CAMERA SETUP

    const cameraGroup = new THREE.Group()
    this.scene.add(cameraGroup);
    this.camera = new THREE.PerspectiveCamera(75, aspectRatio);
    this.camera.position.z = 3;
    cameraGroup.add(this.camera);
    // #endregion

    // #region RENDERER
    const canvas = document.querySelector('.webgl3');
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
      alpha: true
    });

    
    // #endregion

    // #region CONTROL SETUP
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    //this.controls.target.set(0, 0, 0);
    //this.controls.update();
    // #endregion

    // #region INITIAL VIEW SETUP
    this.renderer.setSize(sizes.width, sizes.height);
    this.renderer.render(this.scene, this.camera);
    // #endregion

    // #region DAT GUI
    this.gui = new dat.GUI({ width: 360 });

    this.gui.addColor(parameters, `materialColor`)
      .onChange(() => {
        this.material.color.set(parameters.materialColor)
        
      })

    // #endregion
    let scrollY = window.scrollY;
    let scrollX = window.scrollX;


    let currentSection = 0;


    // #region CLOCK & ANIMATION

    const cursor = {
      x : 0,
      y : 0
    }


    const clock = new THREE.Clock();
    let previousTime = 0;
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const deltaTime = elapsedTime - previousTime
      previousTime = elapsedTime;
      //console.log(deltaTime)
      /*      this.controls.update();*/


      // Animate Camera
      if (this.scrollService.getScrollY()) {
        this.camera.position.y =
          - this.scrollService.getScrollY()! / this.scrollService.getTotalScrollHeight()! * 1.5 * 8;
      }

      const parallaxX = cursor.x;
      const parallaxY = - cursor.y;
      cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 0.5 * deltaTime;
      cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 0.5 * deltaTime;



      // Animate Meshes
      for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1;
        mesh.rotation.y += deltaTime * 0.15;
      }


      this.renderer.render(this.scene, this.camera);
      window.requestAnimationFrame(tick);
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

      console.log('resizing')

      this.camera!.aspect = aspectRatio;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(sizes.width, sizes.height);
      this.renderer.render(this.scene, this.camera);
    }, false);
    // #endregion

    // #region SCROLL EVENT LISTENER
    document.addEventListener("scroll", () => {
      //console.log(this.scrollService.getScrollY())
      //console.log(this.scrollService.getTotalScrollHeight())
      scrollY = this.scrollService.getScrollY()!;
      //console.log(scrollY / sizes.height)

      let newSection = scrollY / sizes.height
      newSection = Math.round(newSection)


      if (newSection != currentSection) {
        currentSection = newSection

        gsap.to(
          sectionMeshes[currentSection].rotation,
          {
            duration: 2,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=2'
          }
        )

        console.log('changed', currentSection)
      }


      //console.log(newSection)
    }, true);
    // #endregion

    // #region MOUSE MOVE EVENT LISTENER
    window.addEventListener('mousemove', (event) => {
      cursor.x = event.clientX / window.innerWidth - 0.5;
      cursor.y = event.clientY / window.innerHeight - 0.5;
/*      console.log(cursor)*/
    });
    // #endregion

  }
}

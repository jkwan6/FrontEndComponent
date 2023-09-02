import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { CharacterControls } from './CharacterControls';
import * as RAPIER from '@dimforge/rapier3d'
import { RigidBody } from '@dimforge/rapier3d';
import { Ray } from 'cannon-es';
import { RapierPhysicsWorld } from './RapierPhysicsWorld';
import { ThreeJsWorld } from './ThreeJsWorld';
import { WebGLRenderer } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export interface IBoxDimensions {
  length: number,
  height: number,
  width: number
}

export enum modelAnimation {
  walk = 'walk',
  run = 'run',
  idle = 'idle',
  TPose = 'TPose'
}

@Component({
  selector: 'app-home-three-alternative-three',
  templateUrl: './home-three-alternative-three.component.html',
  styleUrls: ['./home-three-alternative-three.component.css'],
  providers: [RapierPhysicsWorld, ThreeJsWorld]
})
export class HomeThreeAlternativeThreeComponent implements OnInit, OnDestroy{

  constructor(
    private sideNavService: SideNavService,
    private rapierPhysics: RapierPhysicsWorld,
    private threeJsWorld: ThreeJsWorld
  ) {
    this.sizes = this.sideNavService.getBodyDims.value; this.sizes.height = 600;
    this.scene = this.threeJsWorld.instantiateThreeJsScene();
    this.camera = this.threeJsWorld.instantiateThreeJsCamera(this.sizes.width / this.sizes.height);
  }

  // #region PROPERTIES
  camera!: THREE.PerspectiveCamera;
  animateScreenResize!: Observable<IElementDimensions>;
  sizes!: IElementDimensions;
  subscription!: Subscription;
  scene!: THREE.Scene;
  canvas!: HTMLCanvasElement;
  world!: RAPIER.World;
  bodies: { rigid: RigidBody, mesh: THREE.Mesh }[] = [];
  animate!: (() => {}) | any;
  requestId!: number;
  renderer!: THREE.WebGLRenderer;
  keyboardUpEvent: (() => {}) | any;
  keyboardDownEvent: (() => {}) | any;
  mouse: THREE.Vector2 = new THREE.Vector2();
  pointerArrowHelper!: THREE.ArrowHelper;
  bodyArrowHelper!: THREE.ArrowHelper;
  pointerRayCaster: THREE.Raycaster = new THREE.Raycaster();
  bodyRayCaster: THREE.Raycaster = new THREE.Raycaster();
  characterControls!: CharacterControls;
  orbitControls!: OrbitControls;
  characterModel = new THREE.Group;
  environementWorld = new THREE.Group;
  // #endregion

  // #region ON DESTROY
  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.requestId);
    this.renderer!.dispose();
    this.renderer.forceContextLoss();
    this.subscription.unsubscribe();
    document.removeEventListener('keyup', this.keyboardUpEvent)
    document.removeEventListener('keydown', this.keyboardDownEvent)
    this.world.free();}
  // #endregion

  ngOnInit(): void {

    this.world = this.rapierPhysics.instantiatePhysicsWorld();              // Creating Physics World

    for (let i = 0; i < 20; i++) {
      var rngx = (0.5 - Math.random()) * 50
      var rngy = Math.random() * 50
      var rngz = (0.5 - Math.random()) * 50
      var boxPosition = new RAPIER.Vector3(rngx, rngy, rngz);               // Adding Box to Scene
      var box: IBoxDimensions = { length: 4, height: 5, width: 4 };
      var boxMesh = this.threeJsWorld.createBoxMesh(box)
      var boxRigidBody = this.rapierPhysics.createRigidBox(box, boxPosition);
      this.bodies.push({ rigid: boxRigidBody, mesh: boxMesh });             // Storing them
    }

    let heights: number[] = [];                                             // Creating Floor
    let scale = new RAPIER.Vector3(1000, 0, 1000);
    let nsubdivs = 20;
    this.threeJsWorld.createFloor(scale, nsubdivs, heights);
    this.rapierPhysics.createPhysicsFloor(scale, nsubdivs, heights);

    this.canvas = document.querySelector('.HomeWebgl')!;                    // Canvas & Renderer
    this.renderer = this.threeJsWorld.instantiateThreeJsRenderer(this.canvas, this.sizes);
    this.orbitControls = this.threeJsWorld.instantiateThreeJsControls();    // Controls
    this.threeJsWorld.instantiateThreeJsLights();                           // Light

    // RAYCASTER
    this.pointerArrowHelper = new THREE.ArrowHelper(this.pointerRayCaster.ray.direction, this.pointerRayCaster.ray.origin, 1, 0xff0000)
    this.scene.add(this.pointerArrowHelper);

    this.bodyArrowHelper = new THREE.ArrowHelper(this.bodyRayCaster.ray.direction, this.bodyRayCaster.ray.origin, 5, 0xff0000)
    this.scene.add(this.bodyArrowHelper);

    const gltfLoader = new GLTFLoader();
    gltfLoader
      .load('../../../../../assets/models/XBot/XBot2.glb',
        (gltf) => {
          this.characterModel = gltf.scene;
          this.characterModel.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          this.characterModel.position.set(0, 3, 0);
          this.scene.add(this.characterModel);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          const animationMixer = new THREE.AnimationMixer(this.characterModel);
          const animationsMap: Map<string, THREE.AnimationAction> = new Map()
          gltfAnimations.filter(a => a.name != modelAnimation.TPose).forEach((a: THREE.AnimationClip) => {
            animationsMap.set(a.name, animationMixer.clipAction(a))
          })

          // Rigid Body
          let bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(-10, 10, 1);
          let characterRigidBody = this.world.createRigidBody(bodyDesc);
          let dynamicCollider = RAPIER.ColliderDesc.cuboid(0.5,1.7,0.5);
          this.world.createCollider(dynamicCollider, characterRigidBody);
          this.characterControls = new CharacterControls(
            this.characterModel,
            animationMixer,
            animationsMap,
            this.orbitControls,
            this.camera,
            modelAnimation.idle,
            new RAPIER.Ray(
              { x: 0, y: 0, z: 0 },
              { x: 0, y: -1, z: 0 }
            ),
            characterRigidBody)
        }
    );


    const gltfloader = new GLTFLoader();
    const dracroLoader = new DRACOLoader();
    dracroLoader.setDecoderPath('../../../../../assets/draco/')

    gltfLoader.setDRACOLoader(dracroLoader);

    gltfLoader.load("../../../../../assets/models/AltTower.glb",
      (gltf) => {

        this.environementWorld = gltf.scene;
        gltf.scene.scale.set(100, 100, 100);
        gltf.scene.position.set(0, 49, 0);
        this.scene.add(gltf.scene)
      },
      () => { console.log('progress') },
      () => { console.log('error') }
    )


    // Loader
    var path = "../../../../../assets/models/poly_4.glb"
    var loader = new GLTFLoader();
    loader.load
      (
        path,
        object => {
          object.scene.scale.set(1.4, 1.4, 1.4);
          object.scene.position.set(0, 2.0, 0);
          this.scene!.add(object.scene)
        }
      )

    this.defineEvents();
  }

  defineEvents() {
    // #region EVENT LISTENERS
    /* <---------------------- ANIMATE FUNCTION ----------------------> */
    const clock = new THREE.Clock();
    this.animate = () => {
      let mixerUpdateDelta = clock.getDelta();
      if (this.characterControls) {
        this.characterControls.update(this.world, mixerUpdateDelta, keysPressed);
      }
      this.orbitControls.update()
      this.renderer.render(this.scene, this.camera);
      this.requestId = window.requestAnimationFrame(this.animate);

      this.world.step();
      this.bodies.forEach(body => {
        let position = body.rigid.translation();
        let rotation = body.rigid.rotation();

        body.mesh.position.x = position.x;
        body.mesh.position.y = position.y;
        body.mesh.position.z = position.z;

        body.mesh.setRotationFromQuaternion(
          new THREE.Quaternion(rotation.x,
            rotation.y,
            rotation.z,
            rotation.w));
      })

      let objectToTest: THREE.Mesh [] = [];

      this.bodies.forEach(body => {
        objectToTest.push(body.mesh)
      })

      const intersects = this.pointerRayCaster.intersectObjects(objectToTest);

      for (let object of objectToTest) {
        let varX: any;
        varX = object as unknown as THREE.Object3D;
        let materialColor = new THREE.Color('red');
        varX.material.color.set(materialColor)
        //console.log(varX.object.material)
      }

      for (let intersect of intersects) {
        let varX: any;
        varX = intersect as unknown as THREE.Object3D;
        let materialColor = new THREE.Color('blue');
        varX.object.material.color.set(materialColor)
        //console.log(varX.object.material)
      }


      this.pointerRayCaster.setFromCamera(this.mouse, this.camera);
      this.pointerArrowHelper.setDirection(this.pointerRayCaster.ray.direction);
      this.pointerArrowHelper.position.set(
        this.pointerRayCaster.ray.origin.x,
        this.pointerRayCaster.ray.origin.y,
        this.pointerRayCaster.ray.origin.z
      )


      this.bodyRayCaster.set(
        new THREE.Vector3(
          this.characterModel.position.x,
          this.characterModel.position.y,
          this.characterModel.position.z)
        , new THREE.Vector3(0, -1, 0))

      this.bodyArrowHelper.setDirection(this.bodyRayCaster.ray.direction);
      this.bodyArrowHelper.position.set(
        this.bodyRayCaster.ray.origin.x,
        this.bodyRayCaster.ray.origin.y,
        this.bodyRayCaster.ray.origin.z
      )


      if (this.bodyRayCaster.intersectObject(this.environementWorld)[0] !== undefined) { 
        //console.log(this.bodyRayCaster.intersectObject(this.environementWorld)[0].point);
        this.characterModel.position.set(
          this.characterModel.position.x,
          this.characterModel.position.y,
          this.characterModel.position.z
          )
      }
    }
    this.animate();

    /* <---------------------- MOUSE POSITION EVENT ----------------------> */
    this.canvas!.addEventListener('mousemove', (event: MouseEvent) => {
      var boundingRect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((event.pageX - boundingRect.left) > 0)
        ? (event.pageX - boundingRect.left)
        : 0
      this.mouse.y = ((boundingRect.bottom - event.pageY) > 0)
        ? (boundingRect.bottom - event.pageY)
        : 0
      var length = boundingRect.right - boundingRect.left;
      var height = boundingRect.bottom - boundingRect.top;
      this.mouse.x = (-1 * (length / 2 - this.mouse.x)) / length * 2;
      this.mouse.y = (-1 * (height / 2 - this.mouse.y)) / height * 2;
    });

    /* <---------------------- KEYBOARD PRESS EVENT ----------------------> */
    this.keyboardDownEvent = (event: any) => {
      if (event.shiftKey && this.characterControls) {
        this.characterControls.switchRunToggle()
      } else {
        (keysPressed as any)[event.key.toLowerCase()] = true
      }
      console.log(keysPressed);
    }
    this.keyboardUpEvent = (event: any) => {
      (keysPressed as any)[event.key.toLowerCase()] = false
    }

    const keysPressed = {}
    document.addEventListener('keydown', this.keyboardDownEvent, false);
    document.addEventListener('keyup', this.keyboardUpEvent, false);

    /* <---------------------- RESIZE EVENT ----------------------> */
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 600;                                          // Height

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera?.updateProjectionMatrix();
      this.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.renderer!.render(this.scene, this.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();
  }
}

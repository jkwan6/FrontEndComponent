import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SideNavService } from '../../service/SideNavService/SideNavService';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { MeshBVH, MeshBVHVisualizer, StaticGeometryGenerator } from 'three-mesh-bvh'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Observable, Subscription, tap } from 'rxjs';
import { IElementDimensions } from '../../interface/IElementDimensions';
import { IButtonPressed, IColliderVariables, IEventVariables, IGuiParams, IKeysPressed, IPlayerVariables, ITempVariables, IThreeJsMainComponents, modelAction } from '../home-three-alternative-four/CharacterControls/CharacterControlsUtils';
import { CharacterControls } from '../home-three-alternative-four/CharacterControls/CharacterControls';


@Component({
  selector: 'app-home-three-alternative-four',
  templateUrl: './home-three-alternative-four.component.html',
  styleUrls: ['./home-three-alternative-four.component.css'],

})
export class HomeThreeAlternativeFourComponent implements OnInit, OnDestroy {

  constructor(private sideNavService: SideNavService)
  {
    this.sizes = this.sideNavService.getBodyDims.value;
    this.sizes.height = 600;
    console.log(this.sizes)
  }

  // #region Properties
  keysPressed: any = {};
  sizes!: IElementDimensions;
  characterController!: CharacterControls;
  colliderVariables: IColliderVariables = {};
  mouseArrowHelper!: THREE.ArrowHelper;
  mouseRayCaster: THREE.Raycaster = new THREE.Raycaster();
  mouse: THREE.Vector2 = new THREE.Vector2();

  threeJsMainComponents: IThreeJsMainComponents =
  {
    camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50),
    renderer: new THREE.WebGLRenderer(),
    canvas: document.querySelector('.HomeWebgl')!,
    scene: new THREE.Scene()
    }

  playerVariables: IPlayerVariables =
  {
    player: {
      mesh: new THREE.Mesh(),
      capsuleInfo: { radius: 0, segment: new THREE.Line3() }
      },
      animatedVariables:
      {
        mesh: new THREE.Group,
        currentAction: modelAction.idle
      },
    playerVelocity: new THREE.Vector3(0, 0, 0),
    playerIsOnGround: false
    }

  buttonPressed: IButtonPressed = {
    fwdPressed : false,
    bkdPressed : false,
    lftPressed : false,
    rgtPressed : false
  }

  tempVariables: ITempVariables = {
    upVector : new THREE.Vector3(0, 1, 0),
    tempVector : new THREE.Vector3(),
    tempVector2 : new THREE.Vector3(),
    tempBox : new THREE.Box3(),
    tempMat : new THREE.Matrix4(),
    tempSegment : new THREE.Line3()
  }

  guiParams: IGuiParams = {
    firstPerson: false,
    displayCollider: false,
    displayBVH: false,
    visualizeDepth: 10,
    gravity: - 30,
    playerSpeed: 10,
    physicsSteps: 5
  };

  animateScreenResize!: Observable<IElementDimensions>;
  subscription!: Subscription;
  eventVariables: IEventVariables = {
    animate: (() => { }),
    keyboardUpEvent: (() => { }),
    keyboardDownEvent: (() => { }),
    requestId: 0
  }
  // #endregion

  @HostListener('unloaded')
  ngOnDestroy(): void {
    window.cancelAnimationFrame(this.eventVariables.requestId);
    this.threeJsMainComponents.renderer!.dispose();
    this.threeJsMainComponents.renderer.forceContextLoss();
    this.subscription.unsubscribe();
    document.removeEventListener('keyup', this.eventVariables.keyboardUpEvent)
    document.removeEventListener('keydown', this.eventVariables.keyboardDownEvent)
    this.sizes.height = 0;
    this.sizes.width = 2000;  // This one is a quick fix on the width that keeps on decreasing in size.
  }

  ngOnInit(): void {

    const bgColor = "#87CEEB";
    this.threeJsMainComponents.canvas = document.querySelector('.HomeWebgl')!;
    this.threeJsMainComponents.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.threeJsMainComponents.canvas});
    this.threeJsMainComponents.renderer.setPixelRatio(window.devicePixelRatio);
    this.threeJsMainComponents.renderer.setSize(this.sizes.width, this.sizes.height);
    this.threeJsMainComponents.renderer.setClearColor(bgColor);

    // scene setup
    this.threeJsMainComponents.scene = new THREE.Scene();
/*    this.threeJsMainComponents.scene.fog = new THREE.Fog(bgColor, 20, 70);*/
    // lights
    this.threeJsMainComponents.scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1));
    // camera setup
    this.threeJsMainComponents.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 50);
    this.threeJsMainComponents.camera.position.set(10, 10, - 10);
    this.threeJsMainComponents.camera.far = 500;
    this.threeJsMainComponents.camera.updateProjectionMatrix();
    this.threeJsMainComponents.controls = new OrbitControls(
      this.threeJsMainComponents.camera,
      this.threeJsMainComponents.renderer.domElement
    );
    // MousePointer
    this.mouseArrowHelper = new THREE.ArrowHelper(this.mouseRayCaster.ray.direction, this.mouseRayCaster.ray.origin, 1, 0xff0000)
    this.threeJsMainComponents.scene.add(this.mouseArrowHelper);

    // character
    this.playerVariables.player = {
      mesh : new THREE.Mesh(new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5), new THREE.MeshStandardMaterial()),
      capsuleInfo: { radius: 0.5, segment: new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, - 1.0, 0.0))}
    }
    this.playerVariables.player.mesh.geometry.translate(0, - 0.5, 0);
/*    this.threeJsMainComponents.scene.add(this.playerVariables.player.mesh);*/
    this.reset();

    // animations
    const gltfLoader = new GLTFLoader();
    gltfLoader
      .load('../../../../../assets/models/XBot/XBot2.glb',
        (gltf) => {
          this.playerVariables.animatedVariables.mesh.add(gltf.scene);
          this.playerVariables.animatedVariables.mesh.traverse(function (object: any) {
            if (object.isMesh) object.castShadow = true;
          });
          this.playerVariables.animatedVariables.mesh.position.set(
            this.playerVariables.player.mesh.position.x,
            this.playerVariables.player.mesh.position.y,
            this.playerVariables.player.mesh.position.z,
          );
          this.threeJsMainComponents.scene.add(this.playerVariables.animatedVariables.mesh);
          const gltfAnimations: THREE.AnimationClip[] = gltf.animations;
          this.playerVariables.animatedVariables.mixer = new THREE.AnimationMixer(this.playerVariables.animatedVariables.mesh);
          this.playerVariables.animatedVariables.animationsMap = new Map()
          gltfAnimations.filter(a => a.name != modelAction.TPose).forEach((a: THREE.AnimationClip) => {
            this.playerVariables.animatedVariables.animationsMap!.set(a.name, this.playerVariables.animatedVariables.mixer!.clipAction(a))
          })

          // Gotta Push it in here to avoid async issues
          this.characterController = new CharacterControls(
            this.playerVariables,
            this.guiParams,
            this.tempVariables,
            this.buttonPressed,
            this.threeJsMainComponents,
            this.colliderVariables,
            this.keysPressed
          );
        }
    );

    this.guiSetup();
    this.loadColliderEnvironment();
    this.defineEvents();
  }

  reset() {
    this.playerVariables.playerVelocity.set(0, 0, 0);
    this.playerVariables.player.mesh.position.set(15.75, - 3, 30);
    this.threeJsMainComponents.camera.position.sub(this.threeJsMainComponents.controls!.target);
    this.threeJsMainComponents.controls!.target.copy(this.playerVariables.player.mesh.position);
    this.threeJsMainComponents.camera.position.add(this.playerVariables.player.mesh.position);
    this.threeJsMainComponents.controls!.update();
  }

  guiSetup() {
    let gui = new GUI();
    gui.add(this.guiParams, 'firstPerson').onChange((v: any) => {
      if (!v) {
        this.threeJsMainComponents.camera
          .position
          .sub(this.threeJsMainComponents.controls!.target)
          .normalize()
          .multiplyScalar(10)
          .add(this.threeJsMainComponents.controls!.target);
      }
    });
    const visFolder = gui.addFolder('Visualization');
    visFolder.add(this.guiParams, 'displayCollider');
    visFolder.add(this.guiParams, 'displayBVH');
    visFolder.add(this.guiParams, 'visualizeDepth', 1, 20, 1).onChange((v: any) => {
      this.colliderVariables.visualizer!.depth = v;
      this.colliderVariables.visualizer!.update();
    });
    visFolder.open();

    const physicsFolder = gui.addFolder('Player');
    physicsFolder.add(this.guiParams, 'physicsSteps', 0, 30, 1);
    physicsFolder.add(this.guiParams, 'gravity', - 100, 100, 0.01).onChange((v: any) => {
      this.guiParams.gravity = parseFloat(v);
    });
    physicsFolder.add(this.guiParams, 'playerSpeed', 1, 20);
    physicsFolder.open();
    /*    gui.add(this.guiParams, 'reset');*/
    gui.open();
  }


  loadColliderEnvironment() {
    const dracroLoader = new DRACOLoader();
    dracroLoader.setDecoderPath('../../../../../assets/draco/')
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracroLoader);

    gltfLoader.load('../../../../../assets/models/KingsWaySimple.glb', (gltf) => {
      // Scale and position
      const gltfScene = gltf.scene;
      gltfScene.scale.setScalar(1);
      gltfScene.position.set(0, 10, 0)

      const box = new THREE.Box3();
      box.setFromObject(gltfScene);
      box.getCenter(gltfScene.position).negate();
      gltfScene.updateMatrixWorld(true);

      // visual geometry setup
      this.colliderVariables.environment = new THREE.Group();
      this.colliderVariables.environment.add(gltfScene)

      const staticGenerator = new StaticGeometryGenerator(this.colliderVariables.environment);
      staticGenerator.attributes = ['position'];

      const mergedGeometry = staticGenerator.generate();
      mergedGeometry.boundsTree = new MeshBVH(mergedGeometry);
      this.colliderVariables.collider = new THREE.Mesh(mergedGeometry);
      this.colliderVariables.visualizer = new MeshBVHVisualizer(this.colliderVariables.collider, this.guiParams.visualizeDepth);
      this.threeJsMainComponents.scene.add(this.colliderVariables.visualizer);
      this.threeJsMainComponents.scene.add(this.colliderVariables.collider);
      this.threeJsMainComponents.scene.add(this.colliderVariables.environment);
    });
  }

  defineEvents() {
    /* <---------------------- ANIMATE FUNCTION ----------------------> */
    let clock = new THREE.Clock();
    this.eventVariables.animate = () => {
      this.eventVariables.requestId = window.requestAnimationFrame(this.eventVariables.animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      if (this.guiParams.firstPerson) {
        this.threeJsMainComponents.controls!.maxPolarAngle = Math.PI;
        this.threeJsMainComponents.controls!.minDistance = 1e-4;
        this.threeJsMainComponents.controls!.maxDistance = 1e-4;
      } else {
        this.threeJsMainComponents.controls!.maxPolarAngle = Math.PI / 2;
        this.threeJsMainComponents.controls!.minDistance = 1;
        this.threeJsMainComponents.controls!.maxDistance = 20;
      }

      if (this.colliderVariables.collider) {
        this.colliderVariables.collider.visible = this.guiParams.displayCollider;
        this.colliderVariables.visualizer!.visible = this.guiParams.displayBVH;
        const physicsSteps = this.guiParams.physicsSteps;
        for (let i = 0; i < physicsSteps; i++) {
          this.characterController.updatePlayer(delta / physicsSteps);
        }
      }
      // if the player has fallen too far below the level reset their position to the start
      if (this.playerVariables.player.mesh.position.y < - 50) {
        this.reset();
      }
      // Moving Mouse Pointer Arrow And Ray
      this.mouseRayCaster.setFromCamera(this.mouse, this.threeJsMainComponents.camera);
      this.mouseArrowHelper.setDirection(this.mouseRayCaster.ray.direction);
      this.mouseArrowHelper.position.set(
        this.mouseRayCaster.ray.origin.x,
        this.mouseRayCaster.ray.origin.y,
        this.mouseRayCaster.ray.origin.z
      )
      // TODO: limit the camera movement based on the collider
      // raycast in direction of camera and move it if it's further than the closest point

      this.threeJsMainComponents.controls!.update();
      this.threeJsMainComponents.renderer.render(this.threeJsMainComponents.scene, this.threeJsMainComponents.camera);
    }
    this.eventVariables.animate();

    /* <---------------------- MOUSE POSITION EVENT ----------------------> */
    this.threeJsMainComponents.canvas!.addEventListener('mousemove', (event: MouseEvent) => {
      var boundingRect = this.threeJsMainComponents.canvas.getBoundingClientRect();
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

    /* <---------------------- RESIZE EVENT ----------------------> */
    this.animateScreenResize = this.sideNavService.getBodyDims.pipe(tap(results => {
/*      console.log(results)*/
      this.sizes.width = results.width * 0.925;                         // Width
      this.sizes.height = 600;                                          // Height
      this.threeJsMainComponents.camera.aspect = this.sizes.width / this.sizes.height;
      this.threeJsMainComponents.camera?.updateProjectionMatrix();
      this.threeJsMainComponents.renderer!.setSize(this.sizes.width, this.sizes.height);
      this.threeJsMainComponents.renderer!.render(this.threeJsMainComponents.scene, this.threeJsMainComponents.camera);
    }))
    this.subscription = this.animateScreenResize.subscribe();

    /* <---------------------- KEYBOARD PRESS EVENT ----------------------> */

    this.eventVariables.keyboardDownEvent = (event: any) => {
      if (event.shiftKey && this.characterController) {
        this.characterController.switchRunToggle()
      } else {
        (this.keysPressed as any)[event.key.toLowerCase()] = true
      }
      switch (event.code) {
        case 'KeyW': this.buttonPressed.fwdPressed = true; break;
        case 'KeyS': this.buttonPressed.bkdPressed = true; break;
        case 'KeyD': this.buttonPressed.rgtPressed = true; break;
        case 'KeyA': this.buttonPressed.lftPressed = true; break;
      case 'Space':
      if (this.playerVariables.playerIsOnGround) {
        this.playerVariables.playerVelocity.y = 10.0;
        this.playerVariables.playerIsOnGround = false;
      }
        break;
      }
    }
    this.eventVariables.keyboardUpEvent = (event: any) => {
      (this.keysPressed as any)[event.key.toLowerCase()] = false
      switch (event.code) {
        case 'KeyW': this.buttonPressed.fwdPressed = false; break;
        case 'KeyS': this.buttonPressed.bkdPressed = false; break;
        case 'KeyD': this.buttonPressed.rgtPressed = false; break;
        case 'KeyA': this.buttonPressed.lftPressed = false; break;
      };
    }
    document.addEventListener('keydown', this.eventVariables.keyboardDownEvent, false);
    document.addEventListener('keyup', this.eventVariables.keyboardUpEvent, false);
  }
}


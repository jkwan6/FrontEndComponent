import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { CharacterTranslation } from './CharacterControlsDetails/CharacterTranslation'
import { CharacterAnimation } from './CharacterControlsDetails/CharacterAnimation'
import { ControllerUtils, DIRECTIONS, IControllerParams } from './CharacterControlsDetails/ControllerUtils'
import { CharacterWalkDirection } from './CharacterControlsDetails/CharacterWalkDirection'
import { CharacterCameraUpdate } from './CharacterControlsDetails/CharacterCameraUpdate'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'

export class CharacterControls {
  // Reference from Parent
  model: THREE.Group;
  mixer: THREE.AnimationMixer;
  animationsMap: Map<string, THREE.AnimationAction>;
  orbitControl: OrbitControls;
  camera: THREE.Camera;
  ray: RAPIER.Ray;
  rigidBody: RAPIER.RigidBody;
  currentAction: string
  feetCollider: THREE.Raycaster[];
  feetArrowGroup: THREE.Group;
  // Global Variable
  toggleRun: boolean = true
  walkDirection = new THREE.Vector3()
  threeJsEnv: THREE.Group;
  feetRayStepper: THREE.Raycaster[];
  // Can do an DI with those
  characterWalkDirection: CharacterWalkDirection;
  animation: CharacterAnimation;
  characterTranslation: CharacterTranslation;
  characterCameraUpdate: CharacterCameraUpdate;
  threeRayCasterTempValues: THREE.Vector3[] = [];
  bodyCollider: THREE.Raycaster[];
  bodyArrowGroup: THREE.Group;
  capsuleMath: Capsule;
  worldOctTree: Octree;

  constructor(params: IControllerParams
  ) {
    this.model = params.model
    this.mixer = params.mixer
    this.animationsMap = params.animationsMap
    this.currentAction = params.currentAction
    this.ray = params.ray;
    this.rigidBody = params.rigidBody;
    this.orbitControl = params.orbitControl
    this.camera = params.camera;
    this.feetCollider = params.feetCollider;
    this.threeJsEnv = params.threeJsEnv;
    this.feetArrowGroup = params.feetArrowGroup;
    this.feetRayStepper = params.feetRayStepper;
    this.bodyCollider = params.bodyCollider;
    this.bodyArrowGroup = params.bodyArrowGroup;
    this.capsuleMath = params.capsuleMath;
    this.worldOctTree = params.worldOctTree


    // Constructor Future DI
    this.animation = new CharacterAnimation(this.animationsMap, this.mixer);
    this.characterWalkDirection = new CharacterWalkDirection(this.camera, this.model, this.feetArrowGroup, this.bodyArrowGroup);
    this.characterCameraUpdate = new CharacterCameraUpdate(this.camera, this.orbitControl)
    this.characterTranslation = new CharacterTranslation(
      this.camera,
      this.model,
      this.rigidBody,
      this.orbitControl,
      this.ray,
      this.feetCollider,
      this.threeJsEnv,
      this.feetRayStepper,
      this.bodyCollider,
      this.capsuleMath,
      this.worldOctTree
    )

    // Constructor Logic
    this.animationsMap.forEach((value, key) => (key == params.currentAction) ? value.play() : null);
  }

  public switchRunToggle() {
    this.toggleRun = !this.toggleRun
  }

  public update(world: RAPIER.World, delta: number, keysPressed: any) {
    // RETURNS TRUE IF WASD IS PRESSED
    var directionPressed = Object.values(DIRECTIONS).some(key => keysPressed[key] == true);

    // ANIMATION AND CURRENT ANIMATION
    var actions = ControllerUtils.previousAndCurrentAction(
      this.currentAction,
      directionPressed,
      this.toggleRun);

    // ACTIONS
    var previousAction = actions[0];
    this.currentAction = actions[1];
    this.animation.animateCharacter(previousAction, this.currentAction, delta);
    let velocity = ControllerUtils.calculateVelocity(this.currentAction)

    // WALK DIRECTION
    this.walkDirection = this.characterWalkDirection.calculateWalkDirection(
      keysPressed,
      this.currentAction);

    // UPDATE CAMERA POSITION
    //var threeTranslate = new THREE.Vector3;
    //this.model.getWorldPosition(threeTranslate);
    const translation = this.rigidBody.translation();
    this.characterCameraUpdate.updateCameraTarget(this.model, translation)

    // TRANSLATE BODY POSITION
    this.characterTranslation.calculateTranslation(
      translation,
      delta,
      this.ray,
      world,
      velocity,
      keysPressed,
      this.walkDirection,
    )
  }
}

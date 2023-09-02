import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as RAPIER from '@dimforge/rapier3d'
import { Capsule } from 'three/examples/jsm/math/Capsule';
import { Octree } from 'three/examples/jsm/math/Octree';
import { MeshBVHVisualizer } from 'three-mesh-bvh';

export interface IPlayerVariables {
  player: {
    mesh: THREE.Mesh,
    capsuleInfo: { radius: number, segment: THREE.Line3 }
  },
  animatedVariables: {
    mesh: THREE.Group,
    mixer?: THREE.AnimationMixer,
    animationsMap?: Map<string, THREE.AnimationAction>,
    currentAction?: string
  },
  playerVelocity: THREE.Vector3,
  playerIsOnGround: boolean
}

export interface IButtonPressed {
  fwdPressed: boolean,
  bkdPressed: boolean,
  lftPressed: boolean,
  rgtPressed: boolean
}

export interface IKeysPressed { };

export interface ITempVariables {
  upVector: THREE.Vector3,
  tempVector : THREE.Vector3,
  tempVector2 : THREE.Vector3,
  tempBox : THREE.Box3,
  tempMat : THREE.Matrix4,
  tempSegment : THREE.Line3
}

export interface IColliderVariables {
  environment?: THREE.Group,
  collider?: THREE.Mesh,
  visualizer?: MeshBVHVisualizer
}

export interface IGuiParams {
  firstPerson: boolean,
  displayCollider: boolean,
  displayBVH: boolean,
  visualizeDepth: number,
  gravity: number,
  playerSpeed: number,
  physicsSteps: number
};

export interface IEventVariables {
  animate: (() => { }) | any,
  keyboardUpEvent: (() => { }) | any,
  keyboardDownEvent: (() => { }) | any,
  requestId: number
}

export interface IThreeJsMainComponents {
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  canvas: HTMLCanvasElement,
  scene: THREE.Scene,
  controls?: OrbitControls
}

export enum DIRECTIONS {
  FORWARD = 'w',
  LEFT = 'a',
  BACKWARD = 's',
  RIGHT = 'd',
  SHIFT = 'shift'
}

export enum SPACEBAR {
  SPACEBAR = " "
}

export enum modelAction {
  walk = 'walk',
  run = 'run',
  idle = 'idle',
  TPose = 'TPose'
}

export class CharacterControlsUtils {

  static previousAndCurrentAction(currentAction: string, directionPressed: boolean, toggleRun: boolean): [previousAction: string, currentAction: string] {
    var previousAction = currentAction;
    var action: string;  // Reset
    if (directionPressed && toggleRun) { action = modelAction.run }
    else if (directionPressed) { action = modelAction.walk }
    else { action = modelAction.idle }
    (currentAction != action) ? currentAction = action : currentAction;
    return [previousAction, currentAction];
  }

  static calculateVelocity(currentAction: string): number {
    let velocity = 0
    let runVelocity = 10;
    let walkVelocity = 5;

    if (currentAction == modelAction.run || currentAction == modelAction.walk) {
      velocity = currentAction == modelAction.run ? runVelocity : walkVelocity
    }
    return velocity
  }
}

import * as THREE from 'three'
import * as RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SPACEBAR } from './ControllerUtils'
import { GravitySimulation } from './GravitySimulation'
import { Capsule } from 'three/examples/jsm/math/Capsule'
import { Octree } from 'three/examples/jsm/math/Octree'

export class CharacterTranslation {

  constructor(
    camera: THREE.Camera,
    model: THREE.Group,
    rigidBody: RAPIER.RigidBody,
    orbitControls: OrbitControls,
    ray: RAPIER.Ray,
    feetCollider: THREE.Raycaster[],
    threeJsEnv: THREE.Group,
    feetRayStepper: THREE.Raycaster[],
    bodyCollider: THREE.Raycaster[],
    capsuleMath: Capsule,
    worldOctTree: Octree
  ) {
    this.camera = camera;
    this.model = model;
    this.rigidBody = rigidBody;
    this.orbitControl = orbitControls
    this.ray = ray
    this.feetCollider = feetCollider
    this.threeJsEnv = threeJsEnv
    this.feetRayStepper = feetRayStepper
    this.gravitySim = new GravitySimulation(this.rigidBody);
    this.bodyCollider = bodyCollider;
    this.capsuleMath = capsuleMath;
    this.worldOctTree = worldOctTree
  }
  gravitySim: GravitySimulation;
  model: THREE.Group
  camera: THREE.Camera;
  rigidBody: RAPIER.RigidBody;
  ray: RAPIER.Ray;
  orbitControl: OrbitControls;
  feetCollider: THREE.Raycaster[]
  // constants
  gravity = new THREE.Vector3(0, -9.81, 0);
  variableToKnowIfFallingOrNot = 0;
  variableToKnowIfFallingOrNot1 = 0;
  threeJsEnv: THREE.Group
  feetRayStepper: THREE.Raycaster[];
  tempRayPoints: THREE.Vector3[] = [];
  tempRayPoints2: THREE.Vector3[] = [];
  bodyCollider: THREE.Raycaster[];
  capsuleMath: Capsule;
  worldOctTree: Octree;
  playerOnFloor: boolean = false;

  calculateTranslation(
    translation: RAPIER.Vector3,
    delta: number,
    ray: RAPIER.Ray,
    world: RAPIER.World,
    velocity: number,
    keysPressed: any,
    walkDirection: THREE.Vector3,
  ) {
    // Method Initialization
    if (translation.y < -10) {
      this.resetPosition(translation);
      return
    }
    this.update3JsModelToPhysicsModel(translation)
    this.tempRayPoints = [];
    this.variableToKnowIfFallingOrNot = walkDirection.y


    // Gets intercept of each Ray Caster with Environment
    this.feetCollider.forEach((ray) => {
      var intersects = ray.intersectObject(this.threeJsEnv);
      if (intersects[0]) {
        this.tempRayPoints.push(intersects[0].point)
      }
    })

    const result = this.worldOctTree.capsuleIntersect(this.capsuleMath);      // If Capsule is intersecting World
    this.playerOnFloor = false;                                                    // Reset playerOnFloor
    // If Capsule is intersecting World,
    // Check if Player is on Floor
    // If Player is not on Floor, do this
    // Else, do that
    if (result) {
      this.playerOnFloor = result.normal.y > 0;
    }

    // Get the first successful raycaster.
    let firstSuccesfulIntercept = this.tempRayPoints[0];
    let distanceFromIntersection: number;
    if (firstSuccesfulIntercept) {
      const pointOfImpact = firstSuccesfulIntercept;
      distanceFromIntersection = translation.y - (pointOfImpact.y + 0.0);
    }

    // Use different fall algorithm depending on distance from fall
    //if (distanceFromIntersection! < 0.0)
    //{
    //  this.variableToKnowIfFallingOrNot = 0
    //  walkDirection.y = this.fallLerp(this.variableToKnowIfFallingOrNot, Math.abs(distanceFromIntersection!), 0.2)
    //}
    //else if (distanceFromIntersection! < 0.5)
    //{
    //  this.gravitySim.resetGravitySimulation();
    //  walkDirection.y += this.fallLerp(this.variableToKnowIfFallingOrNot, -9.81 * 0.5 * delta, 0.1)
    //}
    //else
    //{
    //  walkDirection.y -= this.gravitySim.getDisplacement(delta);
    //}



if (this.playerOnFloor) {
      this.gravitySim.resetGravitySimulation();
      walkDirection.y += this.fallLerp(this.variableToKnowIfFallingOrNot, -9.81 * 0.5 * delta, 0.1)
    }
    else {
      walkDirection.y -= this.gravitySim.getDisplacement(delta);
    }



    this.tempRayPoints2 = [];

    // Gets intercept of each Ray Caster with Environment
    this.bodyCollider.forEach((ray) => {
      var intersects = ray.intersectObject(this.threeJsEnv);
      if (intersects[0]) {
        this.tempRayPoints2.push(intersects[0].point)
      }
    })
    //console.log(this.tempRayPoints2)
    // Get the first successful raycaster.
    let firstSuccesfulIntercept1 = this.tempRayPoints2[0];
    let distanceFromIntersection1: number;
    if (firstSuccesfulIntercept1) {
      const pointOfImpact = firstSuccesfulIntercept1;
      distanceFromIntersection1 = translation.z - (pointOfImpact.z + 0.0);
    }

    // Use different fall algorithm depending on distance from fall
/*    console.log(distanceFromIntersection1!)*/
    //if (distanceFromIntersection1! < 0.5) {
    //  walkDirection.x = 0
    //  walkDirection.z = 0
    //}
    //else {
    //  walkDirection.x = walkDirection.x * velocity * delta
    //  walkDirection.z = walkDirection.z * velocity * delta
    //}
    walkDirection.x = walkDirection.x * velocity * delta
    walkDirection.z = walkDirection.z * velocity * delta


    /*      console.log(result)*/
    // If Capsule is intersecting World,
    // Check if Player is on Floor
    // If Player is not on Floor, do this
    // Else, do that
    if (result) {
      if (!this.playerOnFloor) {
        walkDirection.addScaledVector(result.normal, - result.normal.dot(walkDirection));
      }
      this.capsuleMath.translate(result.normal.multiplyScalar(result.depth));
    }

    //walkDirection.x = walkDirection.x * velocity * delta
    //walkDirection.z = walkDirection.z * velocity * delta

    // Jump
    if (keysPressed[SPACEBAR.SPACEBAR]) {

      this.capsuleMath.translate(
        new THREE.Vector3(
          walkDirection.x,
          walkDirection.y + 1,
          walkDirection.z)
      )

      this.rigidBody.setNextKinematicTranslation({
        x: this.capsuleMath.start.x,
        y: this.capsuleMath.start.y,
        z: this.capsuleMath.start.z
      });

      //this.capsuleMath.end.set(
      //  translation.x + walkDirection.x,
      //  translation.y + walkDirection.y + 1,
      //  translation.z + walkDirection.z
      //)
    }
    else {
      
      this.capsuleMath.translate(
        new THREE.Vector3(
          walkDirection.x,
          walkDirection.y,
          walkDirection.z)
      )
      this.rigidBody.setNextKinematicTranslation({
        x: this.capsuleMath.start.x,
        y: this.capsuleMath.start.y,
        z: this.capsuleMath.start.z
      });
      //this.capsuleMath.end.set(
      //  translation.x + walkDirection.x,
      //  translation.y + walkDirection.y,
      //  translation.z + walkDirection.z
      //)
    }
    //console.log(this.capsuleMath.start)
    //console.log(this.capsuleMath.end)
  }


  fallLerp =
    (storedFall: number, displacement: number, factor: number) => {
      var x = storedFall * (1 - factor) + displacement * factor
      return x;
    };

  update3JsModelToPhysicsModel(translation: RAPIER.Vector3) {
    this.model.position.set(
      translation.x,
      translation.y,
      translation.z,
    )
  }

  resetPosition(translation: RAPIER.Vector3) {
    this.rigidBody.setNextKinematicTranslation({
      x: translation.x,
      y: 10,
      z: translation.z
    });
  }

  checkIfModelIsFallingBeneathWorld(translation: RAPIER.Vector3) {
    if (translation.y < -10) {
      this.resetPosition(translation);
    }
  }
}
